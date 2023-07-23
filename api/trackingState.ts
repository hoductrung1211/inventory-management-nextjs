import axios from "./axios.config";

const apiPrefix = "/trackingStates";

export interface ITrackingStateResponse {
    id: number,
    name: string,
}

export const getAllTrackingStates = () => {
    return axios.get<ITrackingStateResponse[]>(apiPrefix);
}

export const getTrackingStateById = (id: number) => {
    return axios.get<ITrackingStateResponse>(`${apiPrefix}/${id}`)
}

export const createTrackingState = (name: string ) => {
    const formData = new FormData();
    formData.append("name", name); 

    return axios.post(`${apiPrefix}`, formData);
}

export const deleteTrackingState = (id: number) => {
    return axios.delete(`${apiPrefix}/${id}`);
}

export const updateTrackingState = (id: number, name: string) => {
    const formData = new FormData();
    formData.append("name", name);
    return axios.put(`${apiPrefix}/${id}`, formData);
}