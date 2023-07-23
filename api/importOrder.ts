import axios from "./axios.config";

const apiPrefix = "/importOrders";

export interface IImportOrderResponse {
    id: number,
    partnerId: number,
    isCanceled: boolean, 
}

export const getAllImportOrder = () => {
    return axios.get<IImportOrderResponse[]>(apiPrefix);
}

export const getImportOrderById = (id: number) => {
    return axios.get<IImportOrderResponse>(`${apiPrefix}/${id}`)
}

export const createImportOrder = (partnerId: number) => {
    const formData = new FormData();
    formData.append("partnerId", partnerId + "");

    return axios.post(`${apiPrefix}`, formData);
}

export const updateImportOrder = (id: number, isCanceled: boolean) => { 
    return axios.put(`${apiPrefix}/${id}`, {
        isCanceled
    });
}

export const deleteImportOrder = (id: number) => {
    return axios.delete(`${apiPrefix}/${id}`);
}