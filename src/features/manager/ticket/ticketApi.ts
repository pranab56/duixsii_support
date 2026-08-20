import { baseApi } from "../../../utils/apiBaseQuery";

export interface Participant {
    _id: string;
    profile?: string;
    fullName: string;
    email: string;
    role?: string;
    phone?: string;
}

export interface TicketItem {
    _id: string;
    participants: Participant[];
    assignSupportAgentId?: string | null;
    isSolved?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface TicketListMeta {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
}

export interface TicketListResponse {
    success: boolean;
    message: string;
    data: {
        meta: TicketListMeta;
        result: TicketItem[];
    };
}

export interface AgentItem {
    id: string;
    fullName: string;
    email: string;
    profile?: string;
    agentStatus?: string;
    totalAssignedChat?: number;
    totalSolvedChat?: number;
}

export interface AgentListData {
    totalActiveAgent: number;
    availableAgent: number;
    averageAssignedChat: number;
    totalOnlineAgent: number;
    totalOfflineAgent: number;
    totalBusyAgent: number;
    allAgent: AgentItem[];
}

export interface AgentListResponse {
    success: boolean;
    message: string;
    data: AgentListData;
}

export interface AssignTicketPayload {
    chatId: string;
    assignAgentId: string;
}

export interface AssignTicketResponse {
    success: boolean;
    message: string;
    data?: any;
}

export const ticketApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllTicket: builder.query<TicketListResponse, { page?: number } | void>({
            query: (params) => {
                const pageNum = params?.page || 1;
                return {
                    url: `/chat/all-chat-list?assigned=assigned&page=${pageNum}`,
                    method: "GET",
                };
            },
            providesTags: ["ticket"],
        }),

        getAllAgent: builder.query<AgentListResponse, void>({
            query: () => {
                return {
                    url: `/support-team/agent?assigned=assigned`,
                    method: "GET",
                };
            },
            providesTags: ["ticket"],
        }),

        assignTicket: builder.mutation<AssignTicketResponse, AssignTicketPayload>({
            query: (data) => {
                return {
                    url: `/chat/assign-agent`,
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["ticket", "chat", "manager_overview"],
        }),
    }),
});

export const {
    useGetAllTicketQuery,
    useGetAllAgentQuery,
    useAssignTicketMutation,
} = ticketApi;
