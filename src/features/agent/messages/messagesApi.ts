import { baseApi } from "../../../utils/apiBaseQuery";

export interface MessageSender {
    _id: string;
    fullName?: string;
    name?: string;
    email?: string;
    role?: string;
    phone?: string;
    profile?: string;
}

export interface ApiMessageItem {
    _id: string;
    message?: string;
    text?: string;
    image?: string | null;
    seen?: boolean;
    sender?: MessageSender | string;
    receiver?: string;
    chatId?: string;
    replyTo?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface MessagesNewResult {
    pinned?: ApiMessageItem[];
    result?: ApiMessageItem[];
}

export interface MessagesData {
    meta?: {
        page: number;
        limit: number;
        total: number;
        totalPage: number;
    };
    newResult?: MessagesNewResult;
}

export interface MessagesResponse {
    success: boolean;
    message: string;
    data: MessagesData | ApiMessageItem[] | any;
}

export const messagesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMessages: builder.query<MessagesResponse, string>({
            query: (chatId) => {
                return {
                    url: `/message/my-messages/${chatId}`,
                    method: "GET",
                };
            },
            providesTags: ["messages"],
        }),

        createMessage: builder.mutation<any, FormData | Record<string, any>>({
            query: (messageData) => {
                return {
                    url: `/message/send-messages`,
                    method: "POST",
                    body: messageData,
                };
            },
            invalidatesTags: ["chat", "messages"],
        }),


        markAsSolved: builder.mutation({
            query: (chatId: string) => {
                return {
                    url: `/chat/solved/${chatId}`,
                    method: "PATCH",
                };
            },
            invalidatesTags: ["chat", "messages"],
        }),



    }),
});

export const {
    useGetMessagesQuery,
    useCreateMessageMutation,
    useMarkAsSolvedMutation
} = messagesApi;
