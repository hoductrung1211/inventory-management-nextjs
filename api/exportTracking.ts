import axios from "./axios.config";

const apiPrefix = "/exportTrackings";

export interface IExportTrackingResponse {
    orderId: number,
    dateTime: Date,
    employeeId: number, 
    content: string,
}

export const getTrackingsByOrderId = (orderId: number) => {
    return axios.get<IExportTrackingResponse[]>(`${apiPrefix}/${orderId}`);
}

 