import { baseApi } from "../../../utils/apiBaseQuery";

export interface ChatParticipant {
    _id: string;
    fullName?: string;
    name?: string;
    email?: string;
    role?: string;
    profile?: string;
}

export interface ChatObject {
    _id: string;
    participants: ChatParticipant[];
    status: string;
    isPinned?: boolean;
    isSolved?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface MessageObject {
    _id?: string;
    text?: string;
    message?: string;
    image?: string | null;
    seen?: boolean;
    sender?: any;
    receiver?: any;
    chatId?: string;
    createdAt?: string | null;
    updatedAt?: string | null;
}

export interface ChatListItem {
    chat: ChatObject;
    message?: MessageObject;
    unreadMessageCount?: number;
}

export interface ChatListResponseData {
    pinned?: ChatListItem[];
    unpinned?: ChatListItem[];
}

export interface ChatListResponse {
    success: boolean;
    message: string;
    data: ChatListResponseData;
}

export const chatsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getChats: builder.query<ChatListResponse, void>({
            query: () => {
                return {
                    url: `/chat/my-chat-list`,
                    method: "GET",
                };
            },
            providesTags: ["chat"],
        }),

        seenChats: builder.query({
            query: (chatId) => {
                return {
                    url: `/message/my-messages/${chatId}`,
                    method: "GET",
                };
            },
            providesTags: ["chat"],
        }),


    }),
});

export const {
    useGetChatsQuery,
    useSeenChatsQuery
} = chatsApi;
