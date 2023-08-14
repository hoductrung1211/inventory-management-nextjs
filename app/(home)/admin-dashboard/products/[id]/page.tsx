'use client';
import BackwardButton from "@/components/BackwardButton";
import Popup from "@/components/Popup";
import Header from "@/layouts/DashboardHeader";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import usePopup from "@/utils/hooks/usePopup";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCategoryById } from "@/api/category";
import {  deleteProduct, getProductById } from "@/api/product";
import Table from "@/layouts/Table";
import Main from "@/layouts/DashboardMain";
import { IProductData } from "../page";
import { getWhsProductByProdId } from "@/api/stock";
import {  getAllWarehouses } from "@/api/warehouse";
import Title from "@/components/Title";
import InfoContainer, { InfoItem } from "@/components/InfoContainer";
import ControlContainer, { ControlItem } from "@/components/ControlContainer";
import Button from "@/components/Button";
import PageTitle from "@/components/PageTitle";

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
    const productId = Number.parseInt(params.id);

    return (
        <section className="w-full flex flex-col">
            <Header>
                <div className="flex items-center gap-4">
                    <BackwardButton />
                    <PageTitle text="Product Details" />
                </div>
            </Header>
            <Main>
                <div className="w-full h-full flex gap-3">
                    <InfoSection productId={productId} />
                    <WarehouseSection productId={productId} />
                </div>
            </Main>
        </section>
    )
}


function InfoSection({
    productId
}: {
    productId: number
}) {
    const router = useRouter();
    const [showLoading, hideLoading] = useLoadingAnimation();
    const popup = usePopup();
    const notify = useNotification();
    const [infoList, setInfoList] = useState<{title: string, content: string}[]>([]);
 
    useEffect(() => {
        fetchProduct();
    }, []);

    async function fetchProduct() {
        try {
            showLoading();
            const {data} = await getProductById(productId);
            const {data: cat} = await getCategoryById(data.categoryId);
            setInfoList([
                {title: "ID", content: data.id.toString()},
                {title: "Name", content: data.name},
                {title: "SKU", content: data.sku},
                {title: "Category", content: cat.name},
                {title: "Dimensions", content: data.dimensions},
                {title: "Weight", content: data.weight},
                {title: "Temperature Price", content: "VND " + data.tempPrice.toLocaleString()},

            ])
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
                variant="contained"
                onClick={() => {
                    popup.hide();
                    deleteThisProduct();
                }}
            >
                Delete
            </Button>
            <Button   
                onClick={() => {popup.hide()}}
            >Cancel</Button>
        </Popup>
    return (
        <section className="w-1/2 p-3 flex flex-col gap-5  border ">
            <Title icon="box-open">Product</Title>
            
            <InfoContainer>
            {infoList.map(info => (
                <InfoItem info={info} />
            ))}                            
            </InfoContainer>
            
            <ControlContainer>
                <ControlItem text="Edit Information">
                    <div className="w-full flex py-1 px-2 justify-end">
                        <Button
                            variant="outlined"
                            icon="arrow-right"
                            href={`${productId}/edit`}
                        >Go</Button>
                    </div>
                </ControlItem>
                <ControlItem text="Delete">
                    <div className="w-full flex py-1 px-2 justify-end">
                        <Button
                            variant="outlined"
                            icon="trash"
                            onClick={() => {
                                popup.show(deleteProductPopup);
                            }}
                        >Delete</Button>
                    </div>
                </ControlItem>
            </ControlContainer>
        </section>
    )
}

function WarehouseSection({
    productId
}: {
    productId: number
}) {
    const [warehouses, setWarehouses] = useState<IWarehouse[]>([]);

    
    useEffect(() => {
        fetchWarehouses();
    }, []);


    async function fetchWarehouses() {
        try {
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
    }
    return (
        <section className="w-1/2 p-3 pt-6 h-full flex flex-col border rounded-r-sm gap-6">
            <Table
                columns={[
                    {id: 1, text: "Id", key: "id", linkRoot: "/admin-dashboard/warehouses/"},
                    {id: 2, text: "Warehouse", key: "name"},
                    {id: 3, text: "Quantity", key: "quantity"},
                ]}
                dataSet={warehouses}
            />
        </section>
    )
}