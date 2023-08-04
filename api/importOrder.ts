import axios from "./axios.config";
import { ICreateImportOrderDetail } from "./importOrderDetail";

const apiPrefix = "/importOrders";

export interface IImportOrderResponse {
    id: number,
    supplierId: number,
    warehouseId: number,
    trackingStateId: number,
    receiptId?: number,
    lastUpdatedTime: Date,
}

export interface ICreateImportOrder {
    supplierId: number,
    warehouseId: number,
    importOrderDetails: ICreateImportOrderDetail[],
}

export interface IUpdateImportOrder {
    supplierId: number,
    warehouseId: number,
}

export const getAllImportOrder = () => {
    return axios.get<IImportOrderResponse[]>(apiPrefix);
}

export const getImportOrderById = (id: number) => {
    return axios.get<IImportOrderResponse>(`${apiPrefix}/${id}`)
}

export const createImportOrder = (data: ICreateImportOrder) => {
    return axios.post(`${apiPrefix}`, data);
}

export const updateImportOrder = (id: number, data: IUpdateImportOrder) => { 
    return axios.put(`${apiPrefix}/${id}`, data);
}

export const updateImportOrderState = (orderId: number, data: {stateId: number}) => {
    return axios.put(`${apiPrefix}/${orderId}/state`, data);
}

export const deleteImportOrder = (id: number) => {
    return axios.delete(`${apiPrefix}/${id}`);
}