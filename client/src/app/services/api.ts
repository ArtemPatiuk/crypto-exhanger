import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { logout, refreshSuccess } from "../../features/auth/authSlice";

import { RootState } from '../store';

const baseQuery = fetchBaseQuery({
  baseUrl: "http://my-dev-site.com:8000/api",
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token =
      (getState() as RootState).auth.accessToken ||
      localStorage.getItem("token");

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

//const baseQueryWithRetry = retry(baseQuery, { maxRetries: 1 });
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery(
      { url: '/auth/refresh-tokens', method: 'GET', credentials: 'include' }, 
      api, 
      extraOptions
    );
    
    if (refreshResult.data) {
      api.dispatch(refreshSuccess(refreshResult.data as any)); 
      const newToken = (refreshResult.data as any).accessToken;
      if (newToken) {
        localStorage.setItem("token", newToken);
      }
      result = await baseQuery(args, api, extraOptions);
    } else {
      localStorage.removeItem("token");
      api.dispatch(logout());
    }
  }
  return result;
};
export const api = createApi({
  reducerPath: "splitApi",
  baseQuery: baseQueryWithReauth,
  refetchOnMountOrArgChange: true,
  endpoints: () => ({}),
  tagTypes:['Assets']
});