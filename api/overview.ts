import axios from "./axios.config";

const apiPrefix = "/overviews";

export interface BranchOverview {
    count: number;
}
export const getBranchOverview = async () => {
    return axios.get<BranchOverview>(`${apiPrefix}/branch`);
}

export interface CategoryOverview {
    count: number;
}
export const getCategoryOverview = async () => {
    return axios.get<CategoryOverview>(`${apiPrefix}/category`);
}

export interface CustomerOverview {
    count: number;
}
export const getCustomerOverview = async () => {
    return axios.get<CustomerOverview>(`${apiPrefix}/customer`);
}

export interface EmployeeOverview {
    count: number;
}
export const getEmployeeOverview = async () => {
    return axios.get<EmployeeOverview>(`${apiPrefix}/employee`);
}

export interface ExportOrderOverview {
    count: number;
    UnfinishedCount: number
}
export const getExportOrderOverview = async () => {
    return axios.get<ExportOrderOverview>(`${apiPrefix}/export-order`);
}

export interface ExportReceiptDetailOverview {
    totalCost: number;
}
export const getExportReceiptDetailOverview = async () => {
    return axios.get<ExportReceiptDetailOverview>(`${apiPrefix}/export-receipt-detail`);
}

export interface ImportOrderOverview {
    count: number;
    unfinishedCount: number
}
export const getImportOrderOverview = async () => {
    return axios.get<ImportOrderOverview>(`${apiPrefix}/import-order`);
}

export interface ImportReceiptDetailOverview {
    totalCost: number;
}
export const getImportReceiptDetailOverview = async () => {
    return axios.get<ImportReceiptDetailOverview>(`${apiPrefix}/import-receipt-detail`);
}

export interface ProductOverview {
    count: number;
}
export const getProductOverview = async () => {
    return axios.get<ProductOverview>(`${apiPrefix}/product`);
}

export interface SupplierOverview {
    count: number;
}
export const getSupplierOverview = async () => {
    return axios.get<SupplierOverview>(`${apiPrefix}/supplier`);
}

export interface WarehouseOverview {
    count: number;
}
export const getWarehouseOverview = async () => {
    return axios.get<WarehouseOverview>(`${apiPrefix}/warehouse`);
}