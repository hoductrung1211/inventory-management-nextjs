import axios from "./axios.config";

const apiPrefix = "/exportReceipts";

export interface ICreateExportReceipt {
    orderId: number,
    warehouseId: number,
    customerId: number,
    receiptDetails: {
        productId: number,
        quantity: number,
        price: number
    }[]   
}

export const createExportReceipt = (data: ICreateExportReceipt) => {
    return axios.post(`${apiPrefix}`, data);
}

export interface IExportReceiptResponse {
    id: number,
    orderId: number,
    warehouseId: number,
    employeeId: number,
    customerId: number,
    dateTime: Date,
}

export const getAllExportReceipt = () => {
    return axios.get<IExportReceiptResponse[]>(`${apiPrefix}`);
}

export const getExportReceipt = (id: number) => {
    return axios.get<IExportReceiptResponse>(`${apiPrefix}/${id}`);
}

export const deleteExportReceipt = (id: number) => {
    return axios.delete(`${apiPrefix}/${id}`);
}
 