import { baseApi } from "../../../utils/apiBaseQuery";

export interface CustomerItem {
    id?: string;
    _id?: string;
    fullName: string;
    email: string;
    profile?: string;
    role?: string;
    phone?: string;
    chatId?: string;
}

export interface CustomerResponse {
    success: boolean;
    message: string;
    data: CustomerItem[];
}

export const customerApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCustomer: builder.query<CustomerResponse, void>({
            query: () => {
                return {
                    url: `/support-team/customer`,
                    method: "GET",
                };
            },
            providesTags: ["customer"],
        }),
    }),
});

export const {
    useGetCustomerQuery
} = customerApi;
