import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AuthResponse, Product, User } from '../../types';
import { BASE_URL } from '../../utils';

interface SignUpData {
  firstName: string;
  lastName: string;
  password: string;
  birthDate?: string;
  picture?: string;
}

interface SignInData {
  firstName: string;
  lastName: string;
  password: string;
}

interface ProductData {
  name: string;
  price: number;
  discountedPrice?: number;
  picture?: string;
  description?: string;
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { endpoint }) => {
      const token = localStorage.getItem('token');
      const protectedEndpoints = [
        'getMyProducts',
        'addProduct',
        'updateProduct',
        'getProfile',
        'updateProfile',
      ];
      if (token && protectedEndpoints.includes(endpoint)) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Products', 'Profile'],
  endpoints: (builder) => ({
    signUp: builder.mutation<
      AuthResponse,
      Partial<User> & { password: string }
    >({
      query: (body) => ({
        url: '/auth/signup',
        method: 'POST',
        body,
      }),
    }),
    signIn: builder.mutation<AuthResponse, { email: string; password: string }>(
      {
        query: (body) => ({
          url: '/auth/signin',
          method: 'POST',
          body,
        }),
      }
    ),
    getProfile: builder.query<User, void>({
      query: () => '/profile',
      providesTags: ['Profile'],
    }),
    updateProfile: builder.mutation<User, FormData>({
      query: (body) => ({
        url: '/profile',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),
    getProducts: builder.query<Product[], void>({
      query: () => '/products',
      providesTags: ['Products'],
    }),
    getMyProducts: builder.query<Product[], void>({
      query: () => '/products/my',
      providesTags: ['Products'],
    }),
    getProductById: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: ['Products'],
    }),
    addProduct: builder.mutation<Product, FormData>({
      query: (formData) => ({
        url: '/products',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Products'],
    }),
    updateProduct: builder.mutation<
      Product,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['Products'],
    }),
  }),
});

export const {
  useSignUpMutation,
  useSignInMutation,
  useGetProductsQuery,
  useGetMyProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = apiSlice;
