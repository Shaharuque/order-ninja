import { apiSlice } from "../api/apiSlice";



export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //Manage Session Get Patient
    getNoDiscountedProducts: builder.query({
      query: () => ({
        url: `/public/without/discounted`,
        method: "GET",
        headers: {
          "content-type": "Application/json",
        },
        credentials: "include",
      }),
    }),
  }),
});

export const { useGetNoDiscountedProductsQuery } = productsApiSlice;
