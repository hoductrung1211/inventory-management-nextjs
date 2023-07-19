import axios from "./axios.config";

const apiPrefix = "/products";

export interface IProductResponse {
    id: number,
    name: string,
    sku: string,
    categoryId: number,
    dimensions: string,
    weight: string,
    tempPrice: number,
    imageUrl: string,
}

export const getAllProducts = () => {
    return axios.get(apiPrefix);
}

export const getProductById = (id: number) => {
    return axios.get(`${apiPrefix}/${id}`)
}

export const createProduct = (name: string, sku: string, catId: string, dimensions: string, weight: string, price: string, imageUrl: string) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("sku", sku);
    formData.append("categoryId", catId);
    formData.append("dimensions", dimensions);
    formData.append("weight", weight);
    formData.append("tempPrice", price);
    formData.append("imageUrl", imageUrl);

    return axios.post(`${apiPrefix}`, formData);
}

export const deleteProduct = (id: number) => {
    return axios.delete(`${apiPrefix}/${id}`);
}

export const updateProduct = (id: number, name: string, sku: string, catId: string, dimensions: string, weight: string, price: string, imageUrl: string) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("sku", sku);
    formData.append("categoryId", catId);
    formData.append("dimensions", dimensions);
    formData.append("weight", weight);
    formData.append("tempPrice", price);
    formData.append("imageUrl", imageUrl);

    return axios.put(`${apiPrefix}/${id}`, formData);
}