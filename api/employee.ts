import axios from "./axios.config";

const apiPrefix = "/employees";

export interface IEmployeeResponse {
    id: number,
    firstName: string,
    lastName: string,
    address?: string,
    gender: boolean,
    dateOfBirth?: Date,
    email: string,
    salary?: number,
    imageUrl?: string,
    branchId: number,
    managerId?: number,
}

export interface ICreateEmployee {
    branchId: number, 
    firstName: string, 
    lastName: string, 
    email: string, 
    address?: string, 
    gender?: boolean, 
    dateOfBirth?: string, 
    salary?: number, 
    imageUrl?: string, 
    managerId?: number,
}

export interface IEmployeeActivity {
    orderId: number,
    dateTime: Date,
    content: string,
    type: string
}

export const getAllEmployees = () => {
    return axios.get<IEmployeeResponse[]>(apiPrefix);
}

export const getEmployeeById = (id: number) => {
    return axios.get<IEmployeeResponse>(`${apiPrefix}/${id}`)
}

export const getEmployeeActivities = (id: number) => {
    return axios.get<IEmployeeActivity[]>(`${apiPrefix}/${id}/activities`)
}

export const createEmployee = (data: ICreateEmployee) => {
    return axios.post(`${apiPrefix}`, data);
}

export const deleteEmployee = (id: number) => {
    return axios.delete(`${apiPrefix}/${id}`);
}

export const updateEmployee = (
    id: number,
    data: ICreateEmployee
) => { 
    return axios.put(`${apiPrefix}/${id}`, data);
}