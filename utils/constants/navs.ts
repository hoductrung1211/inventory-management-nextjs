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
    {icon: 'house', url: staffUrls.Products, text: "My room"}, 
]

export const adminNavs = [
    {icon: 'house', url: adminUrls.Home, text: "Home"}, 
    {icon: 'box-open', url: adminUrls.Products, text: "Products"}, 
    {icon: 'boxes-stacked', url: adminUrls.ProductCategories, text: "Product Categories"}, 
    {icon: 'handshake-angle', url: adminUrls.Customers, text: "Customers"}, 
    {icon: 'truck-field', url: adminUrls.Suppliers, text: "Suppliers"}, 
    {icon: 'warehouse', url: adminUrls.Warehouses, text: "Warehouses"}, 
    {icon: 'building', url: adminUrls.Branches, text: "Branches"}, 
    {icon: 'user-tie', url: adminUrls.Employees, text: "Employees"},
    {icon: 'user', url: adminUrls.Users, text: "Users"},
    {icon: 'chart-simple', url: adminUrls.Users, text: "Reports"}, 

]

export const userNavs = [
    {icon: 'right-from-bracket', func: () => {}, text: "Log out"},
]