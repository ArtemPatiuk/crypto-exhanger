import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { logout, refreshSuccess } from "../../features/auth/authSlice";

import { RootState } from '../store';

const baseQuery = fetchBaseQuery({
  baseUrl: "http://192.168.0.205:8000/api",
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
const baseQueryWithRetry = retry(baseQuery, { maxRetries: 1 });

export const api = createApi({
  reducerPath: "splitApi",
  baseQuery: baseQueryWithRetry,
  refetchOnMountOrArgChange: true,
  endpoints: () => ({}),
});