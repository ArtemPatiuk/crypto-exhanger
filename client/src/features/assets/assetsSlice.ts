import { IAsset } from "../../app/types/asset";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from '@reduxjs/toolkit';

import { assetsApi } from "../../app/services/assets";
import { RootState } from "../../app/store";
import { Meta } from '../../app/types/pagination';

interface InitialState {
    assets: IAsset[];
    meta: Meta | null;
    isAddModalOpen: boolean;
    isProfileModalOpen: boolean;
    selectedAssetId: string | null;
}

const initialState: InitialState = {
    assets: [],
    meta: null,
    isAddModalOpen: false,
    isProfileModalOpen: false,
    selectedAssetId: null
}
const slice = createSlice({
    name: "assets",
    initialState,
    reducers: {
        logout: () => initialState,
        setAddModalOpen: (state, action: PayloadAction<boolean>) => {
            state.isAddModalOpen = action.payload;
        },
        setProfileModalOpen: (state, action: PayloadAction<{ open: boolean; id?: string | null }>) => {
            state.isProfileModalOpen = action.payload.open;
            if (action.payload.id !== undefined) {
                state.selectedAssetId = action.payload.id;
            }
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(assetsApi.endpoints.getAllAssets.matchFulfilled, (state, action) => {
            state.assets = action.payload.data;
            state.meta = action.payload.meta;
        })
    }
})
export const { logout, setAddModalOpen, setProfileModalOpen } = slice.actions;
export default slice.reducer;

const selectAssetsState = (state: RootState) => state.assets;
export const selectAllAssets = (state: RootState) => state.assets.assets;
export const selectAssetsMeta = (state: RootState) => state.assets.meta;
export const selectIsAddModalOpen = (state: RootState) => state.assets.isAddModalOpen;
export const selectProfileModalState = createSelector(
    [selectAssetsState],
    (assets) => ({
        isOpen: assets.isProfileModalOpen,
        id: assets.selectedAssetId // или selectedAssetId, как он у тебя назван
    })
);