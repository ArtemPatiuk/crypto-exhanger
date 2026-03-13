import { AvailableCoin, AvailableNetworkByCoin, CountAssets, ICoin, INetwork, ProfileAsset, UpdateAsset } from "../types/asset"

import { api } from "./api"


export const assetsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllAssets: builder.query<ICoin[], void>({
            query: () => ({
                url: "/assets",
                method: "GET",
            }),
            providesTags:["Assets"]
        }),
        getListAvailableCoin: builder.query<AvailableCoin[], void>({
            query: () => ({
                url: "/assets/get-coins-list",
                method: "GET",
            })
        }),
        getCountAssets: builder.query<CountAssets, void>({
            query: () => ({
                url: "/assets/get-coin-count",
                method: "GET",
            }),
            providesTags: ["Assets"]
        }),
        getListAvailableNetwork: builder.query<AvailableNetworkByCoin, string>({
            query: (name) => ({
                url: `/assets/${name}/networks`,
                method: "GET",
            }),
            providesTags: ["Assets"]
        }),
        getAssetById: builder.query<ProfileAsset, string>({
            query: (id) => ({
                url: `/assets/${id}`,
                method: "GET",
            })
        }),
        editAsset: builder.mutation<string, UpdateAsset>({
            query: (asset) => ({
                url: `/assets/${asset.id}`,
                method: "PATCH",
                body: asset
            }),
            invalidatesTags:["Assets"]
        }),
        removeAsset: builder.mutation<string, string>({
            query: (id) => ({
                url: `/assets/${id}`,
                method: "DELETE",
                body: { id },              
            }),
            invalidatesTags: ["Assets"]
        }),
        addAsset: builder.mutation<ICoin, ICoin>({
            query: (asset) => ({
                url: `/assets`,
                method: "POST",
                body: asset
            }),
            invalidatesTags: ["Assets"]
        }),
    })
});

export const {
    useGetAllAssetsQuery,
    useGetAssetByIdQuery,
    useEditAssetMutation,
    useRemoveAssetMutation,
    useAddAssetMutation,
    useGetListAvailableCoinQuery,
    useGetListAvailableNetworkQuery,
    useGetCountAssetsQuery
} = assetsApi;

export const {
    endpoints: {
        getAllAssets, getAssetById, editAsset, removeAsset, addAsset, getListAvailableCoin, getListAvailableNetwork, getCountAssets
    } } = assetsApi