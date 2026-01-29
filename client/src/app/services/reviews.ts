import { Review } from "../types/review"

import { api } from "./api"

export interface User {
    name: string;
}
export interface Reviews {
    id: string;
    userId: string;
    text: string;
    createdAt: Date;
    user?: User;
}
export const reviewsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllReviews: builder.query<Reviews[], void>({
            query: () => ({
                url: "/reviews",
                method: "GET",
            })
        }),
        addReview: builder.mutation<Review, Review>({
            query: (review) => ({
                url: "/reviews/add",
                method: "POST",
                body: review
            })
        }),
        removeReview: builder.mutation<string, string>({
            query: (id) => ({
                url: `/reviews/remove/${id}`,
                method: "POST",
                body: { id }
            })
        }),
    })
}
)
export const {
    useGetAllReviewsQuery, useAddReviewMutation, useRemoveReviewMutation
} = reviewsApi;

export const {
    endpoints: {
        getAllReviews, addReview, removeReview
    } } = reviewsApi