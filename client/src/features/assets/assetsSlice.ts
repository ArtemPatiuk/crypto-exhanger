import { ICoin } from "../../app/types/asset";
import { createSlice } from "@reduxjs/toolkit";

import { assetsApi } from "../../app/services/assets";
import { RootState } from "../../app/store";

interface InitialState {
    assets: ICoin[] | null
}

const initialState: InitialState = {
    assets: null,
}
const slice = createSlice({
    name: "assets",
    initialState,
    reducers: {
        logout: () => initialState,
    },
    extraReducers: (builder) => {
        builder.addMatcher(assetsApi.endpoints.getAllAssets.matchFulfilled, (state, action) => {
            state.assets = action.payload;
        })
    }
})
export default slice.reducer;

export const selectAssets = (state: RootState) => state.assets;