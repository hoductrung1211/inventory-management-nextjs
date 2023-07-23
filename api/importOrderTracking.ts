import axios from "./axios.config";

const apiPrefix = "/importOrderTrackings";

export interface IImportOrderTrackingResponse {
    id: number,
    imOrderId: number,
    dateTime: string,
    isCanceled: boolean, 
    employeeId: number, 
    content: string, 
    trackingStateId: number, 
}

export const getAllBranches = () => {
    return axios.get<IImportOrderTrackingResponse[]>(apiPrefix);
}

export const getBranchById = (id: number) => {
    return axios.get<IImportOrderTrackingResponse>(`${apiPrefix}/${id}`)
}

export const createBranch = (name: string = "", address: string = "") => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("address", address);

    return axios.post(`${apiPrefix}`, formData);
}

export const updateBranch = (id: number, name: string = "", address: string = "") => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("address", address);

    return axios.put(`${apiPrefix}/${id}`, formData);
}

export const deleteBranch = (id: number) => {
    return axios.delete(`${apiPrefix}/${id}`);
}