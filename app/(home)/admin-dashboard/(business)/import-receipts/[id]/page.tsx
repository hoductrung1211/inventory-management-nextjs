'use client';
import { getWarehouseById } from "@/api/warehouse";
import BackwardButton from "@/components/BackwardButton";
import Title from "@/components/DashboardTitle";
import Header from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import { Color } from "@/utils/constants/colors";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import { useEffect, useState } from "react";
import Image from "next/image";
import InfoBar from "@/components/InfoBar";
import Table from "@/layouts/Table";
import { getAllProducts } from "@/api/product";
import { IReceipt } from "../page";
import { getImportReceipt } from "@/api/importReceipt";
import { getEmployeeById } from "@/api/employee";
import datetimeFormat from "@/utils/functions/datetimeFormat";
import { getImportReceiptDetail } from "@/api/importReceiptDetail";
 
export default function Page({
    params
}: {
    params: {id: string}
}) {
    const [showLoading, hideLoading] = useLoadingAnimation();
    const receiptId = Number.parseInt(params.id); 
    const [receipt, setReceipt] = useState<IReceipt>({
        id: 0,
        orderId: 0,
        warehouse: "",
        employee: "",
        datetime: "",
    });
    const [products, setProducts] = useState<{
        product: string,
        quantity: string,
        price: string,
    }[]>([]);

    useEffect(() => {
        fetchReceipt();
        fetchProducts();
    }, []);

    async function fetchReceipt() {
        showLoading();
        try {
            const {data: receiptResponse} = await getImportReceipt(receiptId);
            const {data : warehouse} = await getWarehouseById(receiptResponse.warehouseId);
            const {data: employee} = await getEmployeeById(receiptResponse.employeeId);
            
            setReceipt({
                ...receiptResponse,
                employee: employee?.lastName + " " + employee?.firstName,
                datetime: datetimeFormat(receiptResponse.dateTime),
                warehouse: warehouse.name,
            })
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }
 
    async function fetchProducts() {
        showLoading();
        try {
            const {data: detailsResponse} = await getImportReceiptDetail(receiptId);
            const {data: productsResponse} = await getAllProducts();
            
            setProducts(detailsResponse.map(d => {
                const product = productsResponse.find(p => p.id === d.productId);
                return {
                    product: product?.name + "",
                    price: d.price.toLocaleString(),
                    quantity: d.quantity.toLocaleString(),
                }
            }));
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    return (
        <section className="w-full flex flex-col">
            <Header>
                <div className="flex gap-4">
                    <BackwardButton />
                </div>
            </Header>
            <Main>
                <div className="w-full h-full flex gap-3">
                    <InfoSection receipt={receipt} />
                    <ProductSection products={products} />
                </div>
            </Main>
        </section>
    )
}



function InfoSection({
    receipt,
}: {
    receipt: IReceipt
}) {
    const inforBars: {label: string, key: "id" | "orderId" | "warehouse" | "employee" | "datetime", icon: string}[] = [
        {label: "Id", key: "id", icon: "hashtag"},
        {label: "Order Id", key: "orderId", icon: "truck"},
        {label: "Warehouse", key: "warehouse", icon: "warehouse"},
        {label: "Employee", key: "employee", icon: "user-tie"},
        {label: "Datetime", key: "datetime", icon: "clock"},
    ];

    return (
        <section className="w-2/5 p-3 pt-6 h-full flex flex-col border-2 rounded-l-sm gap-6">
            <Title
                text="Detailed Information"
                icon="circle-info"
                color={Color.BLACK}
            />
            <div className="relative w-full h-64">
                <Image
                    className="object-cover"
                    src="/images/receipt.jpg"
                    alt="Log in image"
                    fill
                /> 
            </div>
            <div className="flex flex-col gap-3"> 
                {inforBars.map(infoBar =>
                    <InfoBar
                        key={infoBar.label}
                        label={infoBar.label}
                        value={receipt?.[infoBar.key] ?? ""}
                        icon={infoBar.icon}
                    />
                )}
            </div>
        </section>
    )
}

function ProductSection({
    products
}: {
    products: {
        product: string,
        quantity: string,
        price: string,
    }[]
}) {
    return (
        <section className="w-3/5 p-3 pt-6 h-full flex flex-col border-2 rounded-r-sm gap-6">
            <Title text="Products" icon="box-open" color={Color.BLACK} />
            <Table
                columns={[
                    {id: 1, text: "Product Name", key: "product"},
                    {id: 2, text: "Quantity", key: "quantity"},
                    {id: 3, text: "Price", key: "price"}, 
                ]}
                dataSet={products}
            />
        </section>
    )
}