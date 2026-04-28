import { AvailableCoin, AvailableNetworkByCoin, CountAssets, IAsset, ProfileAsset, UpdateAsset, AssetFiltersResponse, GetAllAssetsRequest } from "../types/asset"
import { PaginationResponse } from '../types/pagination';

import { api } from "./api"


export const filessApi = api.injectEndpoints({
    endpoints: (builder) => ({
        uploadImage: builder.mutation<{fileName:string},FormData>({
            query: (formData) => ({
                url: "/files/upload-image",
                method: "POST",
                body: formData,
            }),
        }),
    })
});

export const {
    useUploadImageMutation
} = filessApi;

export const {
    endpoints: {
        uploadImage
    } } = filessApi