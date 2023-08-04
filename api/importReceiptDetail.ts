import axios from "./axios.config";

const apiPrefix = "/importReceiptDetails";
 
export interface IImportReceiptDetailResponse {
    productId: number,
    quantity: number,
    price: number,
}

export const getAllImportReceiptDetail = () => {
    return axios.get<IImportReceiptDetailResponse[]>(`${apiPrefix}`);
}

export const getImportReceiptDetail = (receiptId: number) => {
    return axios.get<IImportReceiptDetailResponse[]>(`${apiPrefix}/${receiptId}`);
}