'use client';
import { getBranchById } from "@/api/branch";
import { deleteWarehouse, getWarehouseById } from "@/api/warehouse";
import BackwardButton from "@/components/BackwardButton";
import Header from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Table from "@/layouts/Table";
import { getWhsProductsByWarehouse, IWarehouseProductResponse } from "@/api/stock";
import { IProductResponse, getAllProducts } from "@/api/product";
import usePopup from "@/utils/hooks/usePopup";
import Popup from "@/components/Popup";
import useNotification from "@/utils/hooks/useNotification";
import Title from "@/components/Title";
import InfoContainer, { InfoItem } from "@/components/InfoContainer";
import ControlContainer, { ControlItem } from "@/components/ControlContainer";
import Button from "@/components/Button";
import PageTitle from "@/components/PageTitle";

interface IProduct {
    id: number,
    name: string,
    quantity: number,
}

export default function Page({
    params
}: {
    params: {id: string}
}) {
    const warehouseId = Number.parseInt(params.id);
    
    return (
        <section className="w-full flex flex-col">
            <Header>
                <div className="flex items-center gap-4">
                    <BackwardButton />
                    <PageTitle text="Warehouse Details" />
                </div>
            </Header>
            <Main>
                <div className="w-full h-full flex gap-3">
                    <InfoSection warehouseId={warehouseId} />
                    <ProductSection warehouseId={warehouseId} />
                </div>
            </Main>
        </section>
    )
}

function InfoSection({
    warehouseId
}: {
    warehouseId: number
}) {
    const notify = useNotification();
    const [showLoading, hideLoading] = useLoadingAnimation();
    const router = useRouter();
    const popup = usePopup();
    const [infoList, setInfoList] = useState<{title: string, content: string}[]>([]);

    useEffect(() => {
        fetchWarehouseInfo(); 
    }, []);
    
    async function fetchWarehouseInfo() {
        showLoading();
        try {
            const {data} = await getWarehouseById(warehouseId);
            const {data: branch} = await getBranchById(data.branchId);

            setInfoList([
                {title: "ID", content: data.id.toString()},
                {title: "Name", content: data.name },
                {title: "Address", content: data.address },
                {title: "Branch", content:  branch.name},
            ])
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    async function deleteThisWarehouse() {
        try {
            showLoading();
            await deleteWarehouse(warehouseId);
            router.push("./")
            notify("Delete warehouse successfully!", "success");
        }
        catch (error) {
            console.log(error);
            notify("Delete warehouse failed!", "error");
        }
        finally {
            hideLoading();
        }
    }

    const deleteWarehousePopup = 
        <Popup text="This warehouse will be deleted, you're sure?">
            <Button 
                variant="contained"
                onClick={() => {
                    popup.hide();
                    deleteThisWarehouse();
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
            <Title icon="warehouse">Warehouse</Title>
            
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
                            href={`${warehouseId}/edit`}
                        >Go</Button>
                    </div>
                </ControlItem>
                <ControlItem text="Delete">
                    <div className="w-full flex py-1 px-2 justify-end">
                        <Button
                            variant="outlined"
                            icon="trash"
                            onClick={() => {
                                popup.show(deleteWarehousePopup);
                            }}
                        >Delete</Button>
                    </div>
                </ControlItem>
            </ControlContainer>
        </section>
    )
}

function ProductSection({
    warehouseId
}: {
    warehouseId: number
}) {
    const [showLoading, hideLoading] = useLoadingAnimation();
    const [products, setProducts] = useState<IProduct[]>([]); 
    const notify = useNotification();

    useEffect(() => {
        fetchWarehouseProducts();
    }, []);

    async function fetchWarehouseProducts() {
        try {
            showLoading();
            const {data: whProductData} = await getWhsProductsByWarehouse(warehouseId);
            const {data: productData} = await getAllProducts();

            const newProds: IProduct[] = [];

            whProductData.forEach((whsProd: IWarehouseProductResponse) => {
                const {name} = 
                    productData.find((prod: IProductResponse) => whsProd.productId === prod.id) 
                    ?? {name: ""};
                    
                newProds.push({
                    id: whsProd.productId,
                    name,
                    quantity: whsProd.quantity
                });
            });

            setProducts(newProds);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    } 

    return (
        <section className="w-3/5 p-3 h-full flex flex-col border rounded-r-sm gap-6">
            <Table
                columns={[
                    {id: 1, text: "Id", key: "id", linkRoot: "/admin-dashboard/products/"},
                    {id: 2, text: "Product Name", key: "name"},
                    {id: 3, text: "Quantity", key: "quantity"}, 
                ]}
                dataSet={products}
            />
        </section>
    )
}