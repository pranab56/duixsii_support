import { baseApi } from "../../../utils/apiBaseQuery";

export interface TicketItem {
    _id?: string;
    id?: string;
    userName?: string;
    name?: string;
    fullName?: string;
    user?: { fullName?: string; name?: string };
    message?: string;
    lastMessage?: string;
    subject?: string;
    createdAt?: string;
    time?: string;
    status?: string;
}

export interface WeeklyPerformanceItem {
    day: string;
    pending: number;
    solved: number;
};

export interface AgentOverviewData {
    pendingChats: number;
    solvedChats: number;
    activeChats?: number;
    avarageRating?: number;
    averageRating?: number;
    recentAssignedTickets: TicketItem[];
    weeklyPerformance: WeeklyPerformanceItem[];
}

export interface AgentOverviewResponse {
    success: boolean;
    message: string;
    data: AgentOverviewData;
}

export const overviewApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getOverview: builder.query<AgentOverviewResponse, void>({
            query: () => {
                return {
                    url: `/support-team/overview-by-agent`,
                    method: "GET",
                };
            },
            providesTags: ["agent_overview"],
        }),
    }),
});

// Export hooks
export const {
    useGetOverviewQuery
} = overviewApi;
