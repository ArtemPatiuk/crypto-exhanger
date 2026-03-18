import { IAsset } from "../../app/types/asset";
import { createSlice } from "@reduxjs/toolkit";

import { assetsApi } from "../../app/services/assets";
import { RootState } from "../../app/store";
import { Meta } from '../../app/types/pagination';

interface InitialState {
    assets: IAsset[];
    meta: Meta | null;
}

const initialState: InitialState = {
    assets: [],
    meta: null
}
const slice = createSlice({
    name: "assets",
    initialState,
    reducers: {
        logout: () => initialState,
    },
    extraReducers: (builder) => {
        builder.addMatcher(assetsApi.endpoints.getAllAssets.matchFulfilled, (state, action) => {
            state.assets = action.payload.data;
            state.meta = action.payload.meta;
        })
    }
})
export default slice.reducer;

export const selectAssetsState = (state: RootState) => state.assets;
export const selectAllAssets = (state: RootState) => state.assets.assets;
export const selectAssetsMeta = (state: RootState) => state.assets.meta;