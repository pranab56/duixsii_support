import { baseApi } from "../../utils/apiBaseQuery";

export interface SettingsData {
    logo?: string;
    platformName?: string;
    privacyPolicy?: string;
    privacy?: string;
    aboutUs?: string;
    about?: string;
    support?: string;
    termsOfService?: string;
    termsCondition?: string;
    termsAndConditions?: string;
    terms?: string;
}

export interface SettingsResponse {
    success: boolean;
    message: string;
    data?: SettingsData;
}

export const settingsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSettings: builder.query<SettingsResponse, { key?: string; value?: string } | void>({
            query: (params) => {
                if (params?.key) {
                    const key = params.key;
                    const value = params.value || key;
                    return {
                        url: `/setting?${key}=${value}`,
                        method: "GET",
                    };
                }
                return {
                    url: `/setting`,
                    method: "GET",
                };
            },
            providesTags: ["settings"],
        }),
    }),
});

export const {
    useGetSettingsQuery,
} = settingsApi;
