export const enum HomeUrls {
    Home = "/",
    StaffLogin = "/staff-login/",
    AdminLogin = "/login/",
}

const staffBasePath = "/staff-dashboard/";
export const enum staffUrls {
    Home = staffBasePath,
    Products = staffBasePath + "products/",
}

const adminBasePath = "/admin-dashboard/";
export const enum adminUrls {
    Home = adminBasePath,
    ImportReceipts = adminBasePath + "import-receipts/",
    ExportReceipts = adminBasePath + "export-receipts/",
    Imports = adminBasePath + "imports/",
    Exports = adminBasePath + "exports/",
    Products = adminBasePath + "products/",
    ProductCategories = adminBasePath + "product-categories/",
    Warehouses = adminBasePath + "warehouses/",
    Suppliers = adminBasePath + "suppliers/",
    Customers = adminBasePath + "customers/",
    Branches = adminBasePath + "branches/",
    Users = adminBasePath + "users/",
    Employees = adminBasePath + "employees/",
}