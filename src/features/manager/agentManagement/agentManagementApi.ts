import { baseApi } from "../../../utils/apiBaseQuery";

export interface AgentListItem {
    id: string;
    fullName: string;
    email: string;
    profile?: string;
    agentStatus: 'online' | 'offline' | 'busy' | string;
    totalAssignedChat: number;
    totalSolvedChat: number;
}

export interface GetAllAgentData {
    totalActiveAgent: number;
    availableAgent: number;
    averageAssignedChat: number;
    totalOnlineAgent: number;
    totalOfflineAgent: number;
    totalBusyAgent: number;
    allAgent: AgentListItem[];
}

export interface GetAllAgentResponse {
    success: boolean;
    message: string;
    data: GetAllAgentData;
}

export interface SingleAgentDetails {
    _id: string;
    fullName: string;
    email: string;
    profile?: string;
    agentStatus: string;
}

export interface PerformanceReportDay {
    day: string;
    count: number;
}

export interface RecentReviewUser {
    _id: string;
    fullName: string;
}

export interface RecentReviewItem {
    _id: string;
    userId: RecentReviewUser;
    rating: number;
    review: string;
    createdAt: string;
}

export interface RatingDistributionItem {
    rating: number;
    count: number;
}

export interface SingleAgentData {
    agent: SingleAgentDetails;
    performanceReports: PerformanceReportDay[];
    totalChatHandled: number;
    recentReviews: RecentReviewItem[];
    rattingDistribution: RatingDistributionItem[];
}

export interface SingleAgentResponse {
    success: boolean;
    message: string;
    data: SingleAgentData;
}

export const agentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllAgent: builder.query<GetAllAgentResponse, void>({
            query: () => {
                return {
                    url: `/support-team/agent?assigned=assigned`,
                    method: "GET",
                };
            },
            providesTags: ["agent"],
        }),

        getSingleAgent: builder.query<SingleAgentResponse, string>({
            query: (id) => {
                return {
                    url: `/support-team/agent/${id}?type=monthly`,
                    method: "GET",
                };
            },
            providesTags: ["agent"],
        }),
    }),
});

export const {
    useGetAllAgentQuery,
    useGetSingleAgentQuery,
} = agentApi;
