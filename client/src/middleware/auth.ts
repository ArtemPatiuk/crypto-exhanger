import { createListenerMiddleware } from "@reduxjs/toolkit";

import { authApi } from "../app/services/auth";

export const listenerMidlleware = createListenerMiddleware();

listenerMidlleware.startListening({
    matcher: authApi.endpoints.login.matchFulfilled,
    effect: async (action, listenerApi) => {
        if (action.payload.accessToken) {
            localStorage.setItem('token', action.payload.accessToken);
            console.log('💾 token saved');
        }

        // if (action.payload.user) {
        //     localStorage.setItem('user', JSON.stringify(action.payload.user));
        //     console.log('💾 user saved:', action.payload.user);
        // }
    }
})
////listenerApi.cancelActiveListeners();