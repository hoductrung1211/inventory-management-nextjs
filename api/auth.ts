import axios from "./axios.config";

const apiPrefix = "/authentication";
 
export const login = async (username: string, password: string) => {
    const form = new FormData();
    form.append("username", username);
    form.append("password", password);
    return axios.post<string>(`${apiPrefix}/login`, form);
}