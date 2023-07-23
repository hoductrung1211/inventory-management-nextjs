import axios from "./axios.config";

const apiPrefix = "/partners";

export interface IPartnerResponse {
    id: number,
    name: string,
    phoneNumber: string,
    email: string,
    address?: string,
    detailDescription?: string,
}

export const getAllPartners = () => {
    return axios.get<IPartnerResponse[]>(apiPrefix);
}

export const getPartnerStateById = (id: number) => {
    return axios.get<IPartnerResponse>(`${apiPrefix}/${id}`)
}

export const createPartner = (data: {
    name: string,
    phoneNumber: string,
    email: string,
    address?: string,
    detailDescription?: string,
}) => { 
    return axios.post(`${apiPrefix}`, data);
}

export const deletePartner = (id: number) => {
    return axios.delete(`${apiPrefix}/${id}`);
}

export const updatePartner = (id: number, data: {
    name: string,
    phoneNumber: string,
    email: string,
    address?: string,
    detailDescription?: string,
}) => {
    return axios.put(`${apiPrefix}/${id}`, data);
}