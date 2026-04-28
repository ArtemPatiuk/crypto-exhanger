import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../app/types/user";
import { authApi } from "../../app/services/auth";
import { RootState } from "../../app/store";

interface InitialState {
    user: IUser | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isAuthModalOpen: boolean,
    isExchangeModalOpen: boolean;
}

const initialState: InitialState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isAuthModalOpen: false,
    isExchangeModalOpen: false,
};

const slice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: () => initialState,
        refreshSuccess: (state, action: PayloadAction<{ user: IUser | null; accessToken: string }>) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.isAuthenticated = true;
        },
        setAuthModalOpen: (state, action: PayloadAction<boolean>) => {
            state.isAuthModalOpen = action.payload;
        },
        setExchangeModalOpen: (state, action: PayloadAction<boolean>) => {
            state.isExchangeModalOpen = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.isAuthenticated = true;
                state.isAuthModalOpen = false;
            })
            .addMatcher(authApi.endpoints.register.matchFulfilled, (state, action) => {
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.isAuthenticated = true;
                state.isAuthModalOpen = false;
            })
            .addMatcher(authApi.endpoints.current.matchFulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
                state.isAuthModalOpen = false;
            });

    }
})

export const { logout, refreshSuccess, setAuthModalOpen, setExchangeModalOpen } = slice.actions;

export default slice.reducer;

export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;

export const selectUser = (state: RootState) => state.auth.user;

export const selectAccessToken = (state: RootState) => state.auth.accessToken;

export const selectIsAuthModalOpen = (state: RootState) => state.auth.isAuthModalOpen;

export const selectIsExchangeModalOpen = (state: RootState) => state.auth.isExchangeModalOpen;
