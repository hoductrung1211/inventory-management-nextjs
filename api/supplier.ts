import axios from "./axios.config";
import { IImportReceiptResponse } from "./importReceipt";

const apiPrefix = "/suppliers";

export interface ISupplierResponse {
    id: number,
    name: string,
    phoneNumber: string,
    email: string,
    address?: string,
    detailDescription?: string,
}

export const getAllSuppliers = () => {
    return axios.get<ISupplierResponse[]>(apiPrefix);
}

export const getSupplierById = (id: number) => {
    return axios.get<ISupplierResponse>(`${apiPrefix}/${id}`)
}

export const getSupplierReceipts = (id: number) => {
    return axios.get<IImportReceiptResponse[]>(`${apiPrefix}/${id}/receipts`);
}

export const createSupplier = (data: {
    name: string,
    phoneNumber: string,
    email: string,
    address?: string,
    detailDescription?: string,
}) => { 
    return axios.post(`${apiPrefix}`, data);
}

export const deleteSupplier = (id: number) => {
    return axios.delete(`${apiPrefix}/${id}`);
}

export const updateSupplier = (id: number, data: {
    name: string,
    phoneNumber: string,
    email: string,
    address?: string,
    detailDescription?: string,
}) => {
    return axios.put(`${apiPrefix}/${id}`, data);
}