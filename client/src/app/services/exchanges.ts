import { ExchangeRequest } from "../types/exhangerequest"

import { api } from "./api"

export const exchangesApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllExchanges: builder.query<ExchangeRequest[], void>({
            query: () => ({
                url: "/exchanges",
                method: "GET",
            })
        }),
        getAllExchangesUsers: builder.query<ExchangeRequest[], void>({
            query: () => ({
                url: "/exchanges/userexchanges",
                method: "GET",
            })
        }),
        getExchangeById: builder.query<ExchangeRequest, string>({
            query: (id) => ({
                url: `/exchanges/${id}`,
                method: "GET",
            })
        }),
        editExchange: builder.mutation<string, ExchangeRequest>({
            query: (exchange) => ({
                url: `/exchanges/edit/${exchange.id}`,
                method: "PUT",
                body: exchange
            })
        }),
        removeExchange: builder.mutation<string, string>({
            query: (id) => ({
                url: `/exchanges/remove/${id}`,
                method: "POST",
                body: { id }
            })
        }),
        sendCrypto: builder.mutation<string, string>({
            query: (id) => ({
                url: `/exchanges/send/${id}`,
                method: "POST",
                body: { id }
            })
        }),
        addExchange: builder.mutation<ExchangeRequest, ExchangeRequest>({
            query: (exchange) => ({
                url: `/exchanges`,
                method: "POST",
                body: exchange
            })
        }),

    })
})

export const {
    useGetAllExchangesQuery,
    useGetAllExchangesUsersQuery,
    useGetExchangeByIdQuery,
    useEditExchangeMutation,
    useRemoveExchangeMutation,
    useAddExchangeMutation,
    useSendCryptoMutation,
} = exchangesApi

export const {
    endpoints: {
        getAllExchanges, getAllExchangesUsers, getExchangeById, editExchange, removeExchange, addExchange, sendCrypto
    }
} = exchangesApi;
