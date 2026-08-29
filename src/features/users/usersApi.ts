import { baseApi } from "../../utils/apiBaseQuery";

export interface SupportAgentUser {
    _id: string;
    profile?: string;
    fullName: string;
    email: string;
    role?: string;
    isActive?: boolean;
    address?: string;
    phone?: string;
    createdAt?: string;
}

export interface SupportAgentResponse {
    success: boolean;
    message: string;
    meta?: {
        page: number;
        limit: number;
        total: number;
        totalPage: number;
    };
    data?: {
        result: SupportAgentUser[];
        totalUsers?: number;
        activeUsers?: number;
        blockedUsers?: number;
    };
}

export const usersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllSupportAgent: builder.query<SupportAgentResponse, void>({
            query: () => ({
                url: `/users/all?role=support_agent&limit=100`,
                method: "GET",
            }),
            providesTags: ["users"],
        }),
    }),
});

export const {
    useGetAllSupportAgentQuery,
} = usersApi;
