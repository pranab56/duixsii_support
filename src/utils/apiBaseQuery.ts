import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { logout } from '../features/auth/authSlice';
import { baseURL } from './BaseURL';
import { getToken } from './storage';

const cleanBaseURL = (baseURL || "").endsWith('/') ? baseURL.slice(0, -1) : (baseURL || "");

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${cleanBaseURL}/api/v1`,
  prepareHeaders: (headers) => {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    const forgetToken = typeof window !== "undefined" ? localStorage.getItem("forgetToken") : null;
    if (forgetToken && !headers.has("token")) {
      headers.set("token", forgetToken);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const url = typeof args === "string" ? args : args?.url;

    // Only trigger logout on auth-specific endpoints
    // For all other 401s (profile, notification, etc.) we do NOT force logout
    // — the API might return 401 for role/permission reasons, not session expiry
    const isSessionExpiredEndpoint =
      url?.includes("/auth/me") ||
      url?.includes("/auth/profile") ||
      url?.includes("/auth/verify");

    if (isSessionExpiredEndpoint) {
      console.warn("[Auth] Session expired, logging out.");
      api.dispatch(logout());
      api.dispatch(baseApi.util.resetApiState());
    } else {
      // Log for debugging — check browser Network tab for the failing URL
      console.warn(`[Auth] 401 received on: ${url} — user NOT logged out automatically.`);
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: ["agent_overview", "faq", "settings", "rating", "customer", "chat", "messages", "profile", "manager_overview", "ticket", "agent", "notification", "users"],
});
