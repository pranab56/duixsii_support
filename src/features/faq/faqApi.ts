import { baseApi } from "../../utils/apiBaseQuery";

export interface IFaqItem {
    _id: string;
    question: string;
    answer: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface FaqMeta {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
}

export interface FaqResponse {
    success: boolean;
    message: string;
    meta?: FaqMeta;
    data: IFaqItem[];
}

export const faqApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getFAQ: builder.query<FaqResponse, number | void>({
            query: (page = 1) => {
                return {
                    url: `/faq?page=${page}`,
                    method: "GET",
                };
            },
            providesTags: ["faq"],
        }),
    }),
});

// Export hooks
export const {
    useGetFAQQuery
} = faqApi;
