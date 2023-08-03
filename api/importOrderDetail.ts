import axios from "./axios.config";

const apiPrefix = "/importOrderDetails";

export interface IImportOrderDetailResponse {
    orderId: number,
    productId: number,
    quantity: number,
    price: number,
}

export interface ICreateImportOrderDetail {
    productId: number,
    quantity: number,
    price: number,
}

export const getImportOrdersDetailById = (orderId: number) => {
    return axios.get<IImportOrderDetailResponse[]>(`${apiPrefix}/${orderId}`);
}

export const createImportOrderDetail = (data: {
    orderId: number, 
    productId: number,
    quantity: number,
    price: number
}) => {
    return axios.post<ICreateImportOrderDetail>(`${apiPrefix}`, data);
}

export const updateImportOrderDetail = (orderId: number, productId: number, data: {
    quantity: number,
    price: number,
}) => {
    return axios.put(`${apiPrefix}/${orderId}/${productId}`, data);
}

export const deleteImportOrderDetail = (orderId: number, productId: number) => {
    return axios.delete(`${apiPrefix}/${orderId}/${productId}`);
}