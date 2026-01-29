import { Review } from "../../app/types/review";
import { createSlice } from "@reduxjs/toolkit";

import { reviewsApi } from "../../app/services/reviews";
import { RootState } from "../../app/store";

interface InitialState {
    reviews: Review[] | null
}

const initialState: InitialState = {
    reviews: null,
}
const slice = createSlice({
    name: "reviews",
    initialState,
    reducers: {
        logout: () => initialState,
    },
    extraReducers: (builder) => {
        builder.addMatcher(reviewsApi.endpoints.getAllReviews.matchFulfilled, (state, action) => {
            state.reviews = action.payload;
        })
    }
})
export default slice.reducer;

export const selectReviews = (state: RootState) => state.reviews;