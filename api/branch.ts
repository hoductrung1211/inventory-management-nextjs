import axios from "./axios.config";

const apiPrefix = "/branches";

export interface IBranchResponse {
    id: number,
    name: string,
    address: string,
}

export const getAllBranches = () => {
    return axios.get<IBranchResponse[]>(apiPrefix);
}

export const getBranchById = (id: number) => {
    return axios.get<IBranchResponse>(`${apiPrefix}/${id}`)
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