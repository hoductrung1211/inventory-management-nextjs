import axios from "./axios.config";

const apiPrefix = "/importTrackings";

export interface IImportTrackingResponse {
    imOrderId: number,
    dateTime: Date,
    employeeId: number, 
    content: string,
}

export const getTrackingsByOrderId = (imOrderId: number) => {
    return axios.get<IImportTrackingResponse[]>(`${apiPrefix}/${imOrderId}`);
}

 