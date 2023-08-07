import axios from "./axios.config";

const apiPrefix = "/exportOrderDetails";

export interface IExportOrderDetailResponse {
    orderId: number,
    productId: number,
    quantity: number,
    price: number,
}

export interface ICreateExportOrderDetail {
    productId: number,
    quantity: number,
    price: number,
}

export const getExportOrdersDetailById = (orderId: number) => {
    return axios.get<IExportOrderDetailResponse[]>(`${apiPrefix}/${orderId}`);
}

export const createExportOrderDetail = (data: {
    orderId: number, 
    productId: number,
    quantity: number,
    price: number
}) => {
    return axios.post<ICreateExportOrderDetail>(`${apiPrefix}`, data);
}

export const updateExportOrderDetail = (orderId: number, productId: number, data: {
    quantity: number,
    price: number,
}) => {
    return axios.put(`${apiPrefix}/${orderId}/${productId}`, data);
}

export const deleteExportOrderDetail = (orderId: number, productId: number) => {
    return axios.delete(`${apiPrefix}/${orderId}/${productId}`);
}