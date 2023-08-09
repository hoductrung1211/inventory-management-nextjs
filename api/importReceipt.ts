import axios from "./axios.config";

const apiPrefix = "/importReceipts";

export interface ICreateImportReceipt {
    importOrderId: number,
    warehouseId: number,
    supplierId: number,
    receiptDetails: {
        productId: number,
        quantity: number,
        price: number
    }[]   
}

export const createImportReceipt = (data: ICreateImportReceipt) => {
    return axios.post(`${apiPrefix}`, data);
}

export interface IImportReceiptResponse {
    id: number,
    orderId: number,
    warehouseId: number,
    employeeId: number,
    supplierId: number,
    dateTime: Date,
}

export const getAllImportReceipt = () => {
    return axios.get<IImportReceiptResponse[]>(`${apiPrefix}`);
}

export const getImportReceipt = (id: number) => {
    return axios.get<IImportReceiptResponse>(`${apiPrefix}/${id}`);
}