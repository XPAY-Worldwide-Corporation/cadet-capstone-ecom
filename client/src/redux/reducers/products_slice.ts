import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AxiosInstance from "../api/myapi";

export type Product = {
    id:string,
    store_id: string,
    name:string,
    description:string,
    price:number,
    category:string,
    stocks:number,
    image:string
}

interface ProductState {
    products: Product[] | []
    loading_products: boolean
    loading_create: boolean
}

const initialState = {
    products:[],
    loading_products: false,
    loading_create: false
}satisfies ProductState as ProductState

export const upload_product_image = createAsyncThunk('/upload_product_image', async (file:File) => {
    try {
        const data = new FormData()
        data.append('file', file)
        return (await AxiosInstance.post('/products/upload', data)).data
    } catch (error:any) {
        throw new Error(error.response.data.message)
    }
})

export const create_product = createAsyncThunk('/create_product', async (inputs:Object) => {
    try {
        return (await AxiosInstance.post('/products', inputs)).data
    } catch (error:any) {
        throw new Error(error.response.data.message)
    }
})

export const fetch_products = createAsyncThunk('/fetch_products', async () => {
    try {
        return (await AxiosInstance.get(`/products`)).data 
    } catch (error:any) {
        throw new Error(error.response.data.message)
    }
})

export const fetch_product = createAsyncThunk('/fetch_product', async (id: string) => {
    try {
        return (await AxiosInstance.get(`/products/${id}`)).data 
    } catch (error:any) {
        throw new Error(error.response.data.message)
    }
})

export const fetch_myproducts = createAsyncThunk('/fetch_myproducts/:id', async (id: string) => {
    try {
        return (await AxiosInstance.get(`/products/store-products/${id}`)).data 
    } catch (error:any) {
        throw new Error(error.response.data.message)
    }
})

export const search_product = createAsyncThunk('/search_product', async (name: string) => {
    try {
        return (await AxiosInstance.get(`/products/search/${name}`)).data
    } catch (error: any) {
        throw new Error(error.response.data.message)
    }
})

export const delete_product = createAsyncThunk('/delete_product', async (id: string) => {
    try {
        return (await AxiosInstance.delete(`/products/${id}`)).data
    } catch (error: any) {
        throw new Error(error.response.data.message)
    }
})

const productSlice = createSlice({
    name:'product',
    initialState,
    reducers:{},
    extraReducers: builder => {
        builder.addCase(create_product.pending, (state) => {
            state.loading_create = true
        })
        builder.addCase(create_product.rejected, (state) => {
            state.loading_create = false
        })
        builder.addCase(create_product.fulfilled, (state, action) => {
            state.loading_create = false
            state.products = [...state.products, action.payload]
        })

        builder.addCase(fetch_products.pending, (state) => {
            state.loading_products = true
        })
        builder.addCase(fetch_products.rejected, (state) => {
            state.loading_products = false
        })
        builder.addCase(fetch_products.fulfilled, (state, action) => {
            state.loading_products = false
            state.products = action.payload
        })

        builder.addCase(search_product.pending, (state) => {
            state.loading_products = true
        })
        builder.addCase(search_product.rejected, (state) => {
            state.loading_products = false
        })
        builder.addCase(search_product.fulfilled, (state, action) => {
            state.loading_products = false
            state.products = action.payload
        })
    }
})

export default productSlice.reducer