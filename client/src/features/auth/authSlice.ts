import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../app/types/user";
import { authApi } from "../../app/services/auth";
import { RootState } from "../../app/store";

interface InitialState {
    user: IUser | null;
    accessToken: string | null;
    isAuthenticated: boolean;
}

const initialState: InitialState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
};

const slice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: () => initialState,
        refreshSuccess: (state, action) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.isAuthenticated = true;
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.isAuthenticated = true;
            })
            .addMatcher(authApi.endpoints.register.matchFulfilled, (state, action) => {
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.isAuthenticated = true;
            })
            .addMatcher(authApi.endpoints.current.matchFulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
            });

    }
})

export const { logout,refreshSuccess } = slice.actions;

export default slice.reducer;

export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;

export const selectUser = (state: RootState) => state.auth.user;

export const selectAccessToken = (state: RootState) => state.auth.accessToken;