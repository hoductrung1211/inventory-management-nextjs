import axios from "./axios.config";

const apiPrefix = "/stocks";

export interface IWarehouseProductResponse {
    warehouseId: number,
    productId: number,
    quantity: number,
}

export const getAllWhsProducts = () => {
    return axios.get<IWarehouseProductResponse[]>(apiPrefix);
}

export const getWhsProductsByWarehouse = (warehouseId: number) => {
    return axios.get<IWarehouseProductResponse[]>(`${apiPrefix}/${warehouseId}`);
}

export const getWhsProductByProdId = (id: number) => {
    return axios.get<IWarehouseProductResponse[]>(`${apiPrefix}`, {
        params: {
            prodId: id
        }
    });
}