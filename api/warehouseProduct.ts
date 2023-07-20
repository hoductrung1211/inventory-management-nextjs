import axios from "./axios.config";

const apiPrefix = "/warehouseProducts";

export interface IWarehouseProductResponse {
    warehouseId: number,
    productId: number,
    quantity: number,
}

export const getAllWhsProducts = () => {
    return axios.get<IWarehouseProductResponse[]>(apiPrefix);
}

export const getWhsProductsByWarehouse = (warehouseId: number) => {
    return axios.get<IWarehouseProductResponse[]>(`${apiPrefix}`, {
        params: {
            warehouseId: warehouseId
        }
    });
}

export const getWhsProductByProdId = (id: number) => {
    return axios.get<IWarehouseProductResponse[]>(`${apiPrefix}/${id}`);
}