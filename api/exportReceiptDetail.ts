import axios from "./axios.config";

const apiPrefix = "/exportReceiptDetails";
 
export interface IExportReceiptDetailResponse {
    productId: number,
    quantity: number,
    price: number,
}

export const getAllExportReceiptDetail = () => {
    return axios.get<IExportReceiptDetailResponse[]>(`${apiPrefix}`);
}

export const getExportReceiptDetail = (receiptId: number) => {
    return axios.get<IExportReceiptDetailResponse[]>(`${apiPrefix}/${receiptId}`);
}
