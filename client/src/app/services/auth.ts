import { IUser } from "../../app/types/user";

import { api } from "./api"

export type UserData = Omit<IUser, "id">;
type ResponseLoginData = { accessToken:string; user: IUser }
//IUser & { accessToken: string };
export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<ResponseLoginData, UserData>({
            query: (userData) => ({
                url: "/auth/login",
                method: "POST",
                body: userData
            })
        }),
        register: builder.mutation<ResponseLoginData, UserData>({
            query: (userData) => ({
                url: "/auth/register",
                method: "POST",
                body: userData
            })
        }),
        current: builder.query<IUser, void>({
            query: () => ({
                url: "/auth/current",
                method: "GET"
            })
        }),
        refresh: builder.query<ResponseLoginData, void>({
            query: () => ({
                url: "/auth/refresh-tokens",
                method: "GET",
                credentials: "include",
            }),
        }),
    })
})

export const { useLoginMutation, useRegisterMutation, useCurrentQuery, useLazyRefreshQuery, } = authApi;

export const { endpoints: { login, register, current } } = authApi;