import axios from "./axios.config";

const apiPrefix = "/importOrderTrackings";

export interface IImportOrderTrackingResponse {
    imOrderId: number,
    dateTime: Date,
    employeeId: number, 
    content: string,
}

export const getTrackingsByOrderId = (imOrderId: number) => {
    return axios.get<IImportOrderTrackingResponse[]>(`${apiPrefix}/${imOrderId}`);
}

 