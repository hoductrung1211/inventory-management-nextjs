import axios from "./axios.config";

const apiPrefix = "/roles";

export interface IRoleResponse {
    id: number,
    name: string,
    description: string, 
}

export const GetAllRoles = () => {
    return axios.get<IRoleResponse[]>(apiPrefix);
}

export const getRoleById = (id: number) => {
    return axios.get<IRoleResponse>(`${apiPrefix}/${id}`);
};

export const createRole = (name: string, description: string ) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    return axios.post(`${apiPrefix}`, formData);
}

export const updateRole = (id: number, name: string, description: string ) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    return axios.put(`${apiPrefix}/${id}`, formData);
}

export const deleteRole = (id: number) => {
    return axios.delete(`${apiPrefix}/${id}`);
}