import axios from "./axios.config";

const apiPrefix = "/warehouses";

export interface IWarehouseResponse {
    id: number,
    name: string,
    address: string,
    branchId: number,
}

export const getAllWarehouses = (branchId?: number) => {
    if (branchId)
        return axios.get<IWarehouseResponse[]>(apiPrefix, {
            params: {"branch" : branchId}
        });
    return axios.get<IWarehouseResponse[]>(apiPrefix);
}

export const getWarehouseById = (id: number) => {
    return axios.get<IWarehouseResponse>(`${apiPrefix}/${id}`);
}

export const createWarehouse = (branchId: number, name: string, address: string) => {
    const formData = new FormData();
    formData.append("branchId", branchId + "");
    formData.append("name", name);
    formData.append("address", address);

    return axios.post(`${apiPrefix}`, formData);
}

export const updateWarehouse = (warehouseId: number, name: string, address: string, branchId: number) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("address", address);
    formData.append("branchId", branchId + "");

    return axios.put(`${apiPrefix}/${warehouseId}`, formData);
}

export const deleteWarehouse = (id: number) => {
    return axios.delete(`${apiPrefix}/${id}`);
}