import { baseApi } from "../../../utils/apiBaseQuery";

export interface AgentProductivityItem {
    totalAssignedChat: number;
    totalSolvedChat: number;
    agentId: string;
    fullName: string;
    profile?: string;
    solveRate: number;
}

export interface ParticipantItem {
    _id: string;
    profile?: string;
    fullName: string;
    email: string;
}

export interface RecentTicketItem {
    _id: string;
    participants: ParticipantItem[];
    createdAt: string;
}

export interface ManagerOverviewData {
    totalAgent: number;
    unassignedAgent: number;
    averageRating: number;
    agentProductivity: AgentProductivityItem[];
    recentTickets: RecentTicketItem[];
}

export interface ManagerOverviewResponse {
    success: boolean;
    message: string;
    data: ManagerOverviewData;
}

export const overviewApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getOverview: builder.query<ManagerOverviewResponse, void>({
            query: () => {
                return {
                    url: `/support-team/overview-by-manager`,
                    method: "GET",
                };
            },
            providesTags: ["manager_overview"],
        }),
    }),
});

export const {
    useGetOverviewQuery
} = overviewApi;
