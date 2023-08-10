'use client';
import BackwardButton from "@/components/BackwardButton";
import Popup from "@/components/Popup";
import Header, { Button } from "@/layouts/DashboardHeader";
import { Color } from "@/utils/constants/colors";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import usePopup from "@/utils/hooks/usePopup";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCategoryById } from "@/api/category";
import {  deleteProduct, getProductById } from "@/api/product";
import Title from "@/components/DashboardTitle";
import Table from "@/layouts/Table";
import InfoBar from "@/components/InfoBar";
import Image from "next/image";
import Main from "@/layouts/DashboardMain";
import { IProductData } from "../page";
import { getWhsProductByProdId } from "@/api/stock";
import { getAllWarehouses } from "@/api/warehouse";

interface IWarehouse {
    id: number,
    name: string,
    quantity: number
}

export default function Page({
    params
}: {
    params: {id: string}
}) {
    const router = useRouter();
    const [showLoading, hideLoading] = useLoadingAnimation();
    const popup = usePopup();
    const notify = useNotification();

    const [product, setProduct] = useState<IProductData>({
        id: 0,
        name: "",
        catName: "",
        sku: "",
        categoryId: 0,
        dimensions: "",
        weight: "",
        tempPrice: 0,
        imageUrl: "",
    });
    const [warehouses, setWarehouses] = useState<IWarehouse[]>([]);
    const productId = Number.parseInt(params.id);

    useEffect(() => {
        fetchProduct();
        fetchWarehouses();
    }, []);

    async function fetchProduct() {
        try {
            showLoading();
            const {data} = await getProductById(productId);
            const {data: cat} = await getCategoryById(data.categoryId);
            setProduct({
                ...data,
                catName: cat.name
            });
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    async function fetchWarehouses() {
        try {
            showLoading();
            const {data: prodWarehouseData} = await getWhsProductByProdId(productId);
            const {data: warehouseData}  = await getAllWarehouses();
            setWarehouses(prodWarehouseData.map(pwhs => {
                const {name} = warehouseData.
                    find(whs => pwhs.warehouseId === whs.id) 
                    ?? {name: ""};
                const id = pwhs.warehouseId;
                const quantity = pwhs.quantity;
                return {
                    id,
                    name,
                    quantity,
                };
            }));
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    async function deleteThisProduct() {
        try {
            showLoading();
            await deleteProduct(productId);
            router.push("./")
            notify("Delete product successfully!", "success");
        }
        catch (error) {
            console.log(error);
            notify("Delete product failed!", "error");
        }
        finally {
            hideLoading();
        }
    }

    const deleteProductPopup = 
        <Popup text="This product will be deleted, you're sure?">
            <Button
                text="Delete"
                color={Color.WHITE}
                bgColor={Color.RED} 
                actionHandler={() => {
                    popup.hide();
                    deleteThisProduct();
                }}
            />
            <Button
                text="Cancel"
                color={Color.BLACK}
                bgColor={Color.WHITE} 
                actionHandler={() => {popup.hide()}}
            />
        </Popup>

    return (
        <section className="w-full flex flex-col">
            <Header>
                <div className="flex gap-4">
                    <BackwardButton />
                </div>
            </Header>
            <Main>
                <div className="w-full h-full flex gap-3">
                    <InfoSection product={product} />
                    <WarehouseSection products={warehouses} />
                </div>
            </Main>
        </section>
    )
}


function InfoSection({
    product
}: {
    product: IProductData
}) {
    const inforBars: {label: string, key: "id" | "name" | "sku" | "catName" | "dimensions" | "weight" | "tempPrice", icon: string}[] = [
        {label: "Id", key: "id", icon: "hashtag"},
        {label: "Name", key: "name", icon: "signature"},
        {label: "SKU", key: "sku", icon: "lightbulb"},
        {label: "Category", key: "catName", icon: "square-caret-down"},
        {label: "Dimensions", key: "dimensions", icon: "arrows-left-right"},
        {label: "Weight", key: "weight", icon: "weight-hanging"},
        {label: "Temperature Price", key: "tempPrice", icon: "tag"},
    ];
    
    return (
        <section className="w-2/5 p-3 pt-6 h-full flex flex-col border-2 rounded-l-sm gap-6">
            <Title
                text="Detailed Information"
                icon="circle-info"
                color={Color.BLUE}
            />
            <div className="relative w-full h-40">
                <Image
                    className="object-cover"
                    src={product.imageUrl ?? "/images/warehouse.webp"}
                    alt="Log in image"
                    fill
                /> 
            </div>
            <div className="flex flex-col gap-3"> 
                {inforBars.map(infoBar =>
                    <InfoBar
                        key={infoBar.label}
                        label={infoBar.label}
                        value={product?.[infoBar.key] ?? ""}
                        icon={infoBar.icon}
                    />
                )}
            </div>
        </section>
    )
}

function WarehouseSection({
    products
}: {
    products: IWarehouse[]
}) {
    return (
        <section className="w-3/5 p-3 pt-6 h-full flex flex-col border-2 rounded-r-sm gap-6">
            <Title text="Warehouses have this product" icon="box-open" color={Color.GREEN} />
            <Table
                columns={[
                    {id: 1, text: "Id", key: "id", linkRoot: "/admin-dashboard/warehouses/"},
                    {id: 2, text: "Warehouse", key: "name"},
                    {id: 3, text: "Quantity", key: "quantity"},
                ]}
                dataSet={products}
            />
        </section>
    )
}