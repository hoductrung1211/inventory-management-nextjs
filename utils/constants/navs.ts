import { adminUrls, staffUrls } from "./urls";
 

export const enum NavType {
    Link,
    Func,
}

export interface ILinkNavType {
    icon: string,
    url: string,
    text: string
}

export interface IFuncNavType {
    icon: string,
    func: () => {},
    text: string,
}

export const staffNavs = [
    // {icon: 'house', url: staffUrls.Home, text: "Home"}, 
    {icon: 'receipt', url: staffUrls.ImportReceipts, text: "Import Receipts"}, 
    {icon: 'file-invoice-dollar', url: staffUrls.ExportReceipts, text: "Export Receipts"}, 
    {icon: 'dolly', url: staffUrls.Imports, text: "Import Orders"}, 
    {icon: 'truck-fast', url: staffUrls.Exports, text: "Export Orders"}, 
    {icon: 'box-open', url: staffUrls.Products, text: "Products"}, 
    {icon: 'boxes-stacked', url: staffUrls.ProductCategories, text: "Product Categories"}, 
    // {icon: 'warehouse', url: staffUrls.Warehouses, text: "Warehouses"}, 
]

export const adminNavs = [
    {icon: 'house', url: adminUrls.Home, text: "Home"}, 
    {icon: 'receipt', url: adminUrls.ImportReceipts, text: "Import Receipts"}, 
    {icon: 'file-invoice-dollar', url: adminUrls.ExportReceipts, text: "Export Receipts"}, 
    {icon: 'dolly', url: adminUrls.Imports, text: "Import Orders"}, 
    {icon: 'truck-fast', url: adminUrls.Exports, text: "Export Orders"}, 
    {icon: 'box-open', url: adminUrls.Products, text: "Products"}, 
    {icon: 'boxes-stacked', url: adminUrls.ProductCategories, text: "Product Categories"}, 
    {icon: 'handshake-angle', url: adminUrls.Suppliers, text: "Suppliers"}, 
    {icon: 'cart-shopping', url: adminUrls.Customers, text: "Customers"}, 
    {icon: 'warehouse', url: adminUrls.Warehouses, text: "Warehouses"}, 
    {icon: 'building', url: adminUrls.Branches, text: "Branches"}, 
    {icon: 'user-tie', url: adminUrls.Employees, text: "Employees"},
    {icon: 'user', url: adminUrls.Users, text: "Users"},
    // {icon: 'chart-simple', url: adminUrls.Users, text: "Reports"}, 

]

export const userNavs = [
    {icon: 'right-from-bracket', func: () => {}, text: "Log out"},
]