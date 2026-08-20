import { baseApi } from "../../../utils/apiBaseQuery";

export interface ReviewUser {
    _id?: string;
    fullName?: string;
    name?: string;
    email?: string;
    chatId?: string;
}

export interface IReviewItem {
    _id: string;
    userId?: ReviewUser;
    user?: ReviewUser;
    rating: number;
    review: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ReviewMeta {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
}

export interface ReviewResponse {
    success: boolean;
    message: string;
    meta?: ReviewMeta;
    data: IReviewItem[];
}

export const ratingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getRating: builder.query<ReviewResponse, number | void>({
            query: (page = 1) => {
                return {
                    url: `/review-rating/agent?page=${page}`,
                    method: "GET",
                };
            },
            providesTags: ["rating"],
        }),
    }),
});

export const {
    useGetRatingQuery
} = ratingApi;
