import { AvailableCoin, AvailableNetworkByCoin, ICoin } from "../types/asset"

import { api } from "./api"


export const assetsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllAssets: builder.query<ICoin[], void>({
            query: () => ({
                url: "/assets",
                method: "GET",
            })
        }),
        getListAvailableCoin: builder.query<AvailableCoin[], void>({
            query: () => ({
                url: "/assets/get-coins-list",
                method: "GET",
            })
        }),
        getListAvailableNetwork: builder.query<AvailableNetworkByCoin, string>({
            query: (name) => ({
                url: `/assets/${name}/networks`,
                method: "GET",
            })
        }),
        getAssetById: builder.query<ICoin, string>({
            query: (id) => ({
                url: `/assets/${id}`,
                method: "GET",
            })
        }),
        editAsset: builder.mutation<string, ICoin>({
            query: (asset) => ({
                url: `/assets/${asset.id}`,
                method: "PUT",
                body: asset
            })
        }),
        removeAsset: builder.mutation<string, string>({
            query: (id) => ({
                url: `/assets/${id}`,
                method: "DELETE",
                body: { id }
            })
        }),
        addAsset: builder.mutation<ICoin, ICoin>({
            query: (asset) => ({
                url: `/assets`,
                method: "POST",
                body: asset
            })
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
    useGetListAvailableNetworkQuery
} = assetsApi;

export const {
    endpoints: {
        getAllAssets, getAssetById, editAsset, removeAsset, addAsset, getListAvailableCoin, getListAvailableNetwork
    } } = assetsApi