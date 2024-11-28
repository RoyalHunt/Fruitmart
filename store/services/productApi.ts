import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Product {
  id: string;
  name: string;
  price: number;
  stockLevel: number;
}

export const productApi = createApi({
  reducerPath: 'product',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['products'],

  endpoints: (build) => ({
    getProducts: build.query<Product[], void>({
      query: () => 'products',
      providesTags: ['products'],
    }),
  }),
});

export const { useGetProductsQuery } = productApi;
