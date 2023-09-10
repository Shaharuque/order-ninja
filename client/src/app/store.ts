import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../features/api/apiSlice";



export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice(RTK query)
    [apiSlice.reducerPath]: apiSlice.reducer,
    //async thunk reducers

  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
});
