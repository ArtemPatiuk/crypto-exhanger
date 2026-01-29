import { IAsset } from "../types/asset"

import { api } from "./api"


export const assetsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllAssets: builder.query<IAsset[], void>({
            query: () => ({
                url: "/assets",
                method: "GET",
            })
        }),
        getAssetById: builder.query<IAsset, string>({
            query: (id) => ({
                url: `/assets/${id}`,
                method: "GET",
            })
        }),
        editAsset: builder.mutation<string, IAsset>({
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
        addAsset: builder.mutation<IAsset, IAsset>({
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
    useAddAssetMutation
} = assetsApi;

export const {
    endpoints: {
        getAllAssets, getAssetById, editAsset, removeAsset, addAsset
    } } = assetsApi