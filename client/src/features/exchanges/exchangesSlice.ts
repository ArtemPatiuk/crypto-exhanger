import { ExchangeRequest } from "../../app/types/exhangerequest";
import { createSlice } from "@reduxjs/toolkit";
import { exchangesApi } from "../../app/services/exchanges";
import { RootState } from "../../app/store";


interface InitialState {
    exchanges: ExchangeRequest[] | null
}

const initialState: InitialState = {
    exchanges: null
}
const slice = createSlice({
    name: "exchanges",
    initialState,
    reducers: {
        logout: () => initialState,
    },
    extraReducers: (builder) => {
        builder.addMatcher(exchangesApi.endpoints.getAllExchanges.matchFulfilled, (state, action) => {
            state.exchanges = action.payload;
        })
    }
})
export default slice.reducer;

export const selectExchanges = (state: RootState) => state.exchanges;