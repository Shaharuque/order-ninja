import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3055/api/",
    // prepareHeaders: (headers, { getState, endpoint }) => {
    //   const token = getState()?.authInfo?.accessToken;
    //   console.log(token);
    //   if (token) {
    //     headers.set("Authorization", token);
    //   }

    //   return headers;
    // },
  }),
  tagTypes: [],
  endpoints: (builder) => ({}),
});
