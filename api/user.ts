import axios from "./axios.config";

const apiPrefix = "/user";

export interface IUserResponse {
    username: string,
    password: string,
    employeeId: number,
    roleId: number,
}

export const GetAllUsers = () => {
    return axios.get<IUserResponse[]>(apiPrefix);
}

export const getUserById = (id: number) => {
    return axios.get<IUserResponse>(`${apiPrefix}/${id}`);
};

export const createUser = (
    username: string,
    password: string,
    employeeId: number,
    roleId: number,
) => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("employeeId", employeeId + "");
    formData.append("roleId", roleId + "");
    return axios.post(`${apiPrefix}`, formData);
}

export const updateUser = (
    id: number,
    username: string,
    password: string,
    employeeId: number,
    roleId: number,
) => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("employeeId", employeeId + "");
    formData.append("roleId", roleId + "");
    return axios.put(`${apiPrefix}/${id}`, formData);
}

export const deleteUser = (id: number) => {
    return axios.delete(`${apiPrefix}/${id}`);
}