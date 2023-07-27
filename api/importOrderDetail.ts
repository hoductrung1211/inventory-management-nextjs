import axios from "./axios.config";

const apiPrefix = "/importOrderDetails";

export interface IImportOrderDetailResponse {
    importOrderId: number,
    productId: number,
    quantity: number,
    price: number,
}

export interface ICreateImportOrderDetail {
    productId: number,
    quantity: number,
    price: number,
}

export const getAllBranches = () => {
    return axios.get<IImportOrderDetailResponse[]>(apiPrefix);
}
 