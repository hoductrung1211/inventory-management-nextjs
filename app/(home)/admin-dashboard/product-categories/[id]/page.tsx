'use client';
import { getCategoryById } from "@/api/category";
import BackwardButton from "@/components/BackwardButton";
import Popup from "@/components/Popup";
import Header from "@/layouts/DashboardHeader";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import usePopup from "@/utils/hooks/usePopup";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { deleteCategory } from "@/api/category";
import { IProductResponse, getAllProducts } from "@/api/product";
import Table from "@/layouts/Table";
import Main from "@/layouts/DashboardMain";
import Title from "@/components/Title";
import InfoContainer, { InfoItem } from "@/components/InfoContainer";
import ControlContainer, { ControlItem } from "@/components/ControlContainer";
import Button from "@/components/Button";
import PageTitle from "@/components/PageTitle";
 
export default function Page({
    params
}: {
    params: {id: string}
}) {
    const categoryId = Number.parseInt(params.id);

    return (
        <section className="w-full flex flex-col">
            <Header>
                <div className="flex items-center gap-4">
                    <BackwardButton /> 
                    <PageTitle text="Category Details" />
                </div>
            </Header>
            <Main>
                <div className="w-full h-full flex gap-3">
                    <InfoSection categoryId={categoryId} />
                    <ProductSection categoryId={categoryId} />
                </div>
            </Main>
        </section>
    )
}

function InfoSection({
    categoryId
}: {
    categoryId: number
}) { 
    const router = useRouter();
    const [showLoading, hideLoading] = useLoadingAnimation();
    const popup = usePopup();
    const notify = useNotification();
    const [infoList, setInfoList] = useState<{title: string, content: string}[]>([]);

    useEffect(() => {
        fetchCategory();
    }, []);

    async function fetchCategory() {
        try {
            showLoading();
            const {data} = await getCategoryById(categoryId);
            setInfoList([
                {title: "ID", content: data.id.toString()},
                {title: "Name", content: data.name},
                {title: "Description", content: data.description},
            ])
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    async function deleteThisCategory() {
        try {
            showLoading();
            await deleteCategory(categoryId);
            router.push("./")
            notify("Delete category successfully!", "success");
        }
        catch (error) {
            console.log(error);
            notify("Delete category failed!", "error");
        }
        finally {
            hideLoading();
        }
    }

    const deleteCateogryPopup = 
        <Popup text="This warehouse will be deleted, you're sure?">
            <Button 
                variant="contained"
                onClick={() => {
                    popup.hide();
                    deleteThisCategory();
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
            <Title icon="boxes">Product Category</Title>
            
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
                            href={`${categoryId}/edit`}
                        >Go</Button>
                    </div>
                </ControlItem>
                <ControlItem text="Delete">
                    <div className="w-full flex py-1 px-2 justify-end">
                        <Button
                            variant="outlined"
                            icon="trash"
                            onClick={() => {
                                popup.show(deleteCateogryPopup);
                            }}
                        >Delete</Button>
                    </div>
                </ControlItem>
            </ControlContainer>
        </section>
    )
}

function ProductSection({
    categoryId
}: {
    categoryId: number
}) {
    const [products, setProducts] = useState<IProductResponse[]>([]);
    useEffect(() => {
        fetchProducts();
    }, []);
    
    async function fetchProducts() {
        try {
            let {data} = await getAllProducts();
            setProducts(data.filter(prod => prod.categoryId == categoryId));
        }
        catch (error) {
            console.log(error);
        } 
    }

    return (
        <section className="w-3/5 p-3 pt-6 h-full flex flex-col border rounded-r-sm gap-6">
            <Table
                columns={[
                    {id: 1, text: "Id", key: "id", linkRoot: "/admin-dashboard/products/"},
                    {id: 2, text: "Product Name", key: "name"},
                    {id: 3, text: "SKU", key: "sku"},
                ]}
                dataSet={products}
            />
        </section>
    )
}