import axios from "./axios.config";
import { ICreateExportOrderDetail } from "./exportOrderDetail";

const apiPrefix = "/exportOrders";

export interface IExportOrderResponse {
    id: number,
    customerId: number,
    warehouseId: number,
    trackingStateId: number,
    receiptId?: number,
    lastUpdatedTime: Date
}

export interface ICreateExportOrder {
    customerId: number,
    warehouseId: number,
    exportOrderDetails: ICreateExportOrderDetail[],
}

export interface IUpdateExportOrder {
    customerId: number,
    warehouseId: number,
}

export const getAllExportOrder = () => {
    return axios.get<IExportOrderResponse[]>(apiPrefix);
}

export const getExportOrderById = (id: number) => {
    return axios.get<IExportOrderResponse>(`${apiPrefix}/${id}`)
}

export const createExportOrder = (data: ICreateExportOrder) => {
    return axios.post(`${apiPrefix}`, data);
}

export const updateExportOrder = (id: number, data: IUpdateExportOrder) => { 
    return axios.put(`${apiPrefix}/${id}`, data);
}

export const updateExportOrderState = (orderId: number, data: {stateId: number}) => {
    return axios.put(`${apiPrefix}/${orderId}/state`, data);
}

export const deleteExportOrder = (id: number) => {
    return axios.delete(`${apiPrefix}/${id}`);
}
 