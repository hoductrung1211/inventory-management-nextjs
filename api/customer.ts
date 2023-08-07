import axios from "./axios.config";

const apiPrefix = "/customers";

export interface ICustomerResponse {
    id: number,
    name: string,
    phoneNumber: string,
    email: string,
    address: string
}

export const getAllCustomers = () => {
    return axios.get<ICustomerResponse[]>(`${apiPrefix}`);
}

export const getCustomerById = (id: number) => {
    return axios.get<ICustomerResponse>(`${apiPrefix}/${id}`)
}

export const createCustomer = (data: {
    name: string,
    phoneNumber: string,
    email: string,
    address: string,
}) => { 
    return axios.post(`${apiPrefix}`, data);
}

export const deleteCustomer = (id: number) => {
    return axios.delete(`${apiPrefix}/${id}`);
}

export const updateCustomer = (id: number, data: {
    name: string,
    phoneNumber: string,
    email: string,
    address: string, 
}) => {
    return axios.put(`${apiPrefix}/${id}`, data);
}