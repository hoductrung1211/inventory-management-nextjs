import axios from "./axios.config";

const apiPrefix = "/categories";

export interface ICategoryResponse {
    id: number,
    name: string,
    description: string,
    imageUrl: string,
}

export const GetAllCategories = () => {
    return axios.get<ICategoryResponse[]>(apiPrefix);
}

export const getCategoryById = (id: number) => {
    return axios.get<ICategoryResponse>(`${apiPrefix}/${id}`);
};

export const createCategory = (name: string, description: string, imageUrl: string) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("imageUrl", imageUrl);
    return axios.post(`${apiPrefix}`, formData);
}

export const updateCategory = (id: number, name: string, description: string, imageUrl: string) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("imageUrl", imageUrl);
    return axios.put(`${apiPrefix}/${id}`, formData);
}

export const deleteCategory = (id: number) => {
    return axios.delete(`${apiPrefix}/${id}`);
}