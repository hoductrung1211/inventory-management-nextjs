import axios from "./axios.config";
import { ICreateImportOrderDetail } from "./importOrderDetail";

const apiPrefix = "/importOrders";

export interface IImportOrderResponse {
    id: number,
    supplierId: number,
    warehouseId: number,
    trackingStateId: number,
    lastUpdatedTime: Date,
}

export interface ICreateImportOrder {
    supplierId: number,
    warehouseId: number,
    importOrderDetails: ICreateImportOrderDetail[],
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

export const updateImportOrder = (id: number, isCanceled: boolean) => { 
    return axios.put(`${apiPrefix}/${id}`, {
        isCanceled
    });
}

export const deleteImportOrder = (id: number) => {
    return axios.delete(`${apiPrefix}/${id}`);
}