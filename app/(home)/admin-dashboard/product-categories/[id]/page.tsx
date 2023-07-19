'use client';
import { ICategoryResponse, getCategoryById } from "@/api/category";
import BackwardButton from "@/components/BackwardButton";
import Popup from "@/components/Popup";
import Header, { Button } from "@/layouts/DashboardHeader";
import { Color } from "@/utils/constants/colors";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import usePopup from "@/utils/hooks/usePopup";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { deleteCategory } from "@/api/category";
import { IProductResponse, getAllProducts } from "@/api/product";
import Title from "@/components/DashboardTitle";
import Table from "@/layouts/Table";
import InfoBar from "@/components/InfoBar";
import Image from "next/image";
import Main from "@/layouts/DashboardMain";

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
    const [showLoading, hideLoading] = useLoadingAnimation();
    const router = useRouter();
    const categoryId = Number.parseInt(params.id);
    const popup = usePopup();
    const notify = useNotification();
    const [category, setCategory] = useState<ICategoryResponse>({
        id: 1,
        name: "",
        description: "",
        imageUrl: "",
    });
    const [products, setProducts] = useState<IProduct[]>([]);
 
    useEffect(() => {
        fetchCategoris();
        fetchProducts();
    }, []);

    async function fetchCategoris() {
        try {
            showLoading();
            const {data} = await getCategoryById(categoryId);
            setCategory(data);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    async function fetchProducts() {
        try {
            showLoading();
            let {data} = await getAllProducts();
            data = data.filter((item: IProductResponse) => {
                if (item.categoryId == categoryId)
                    return {
                        id: item.id,
                        name: item.name,
                    }
            });
            setProducts(data);
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
                text="Delete"
                color={Color.WHITE}
                bgColor={Color.RED} 
                actionHandler={() => {
                    popup.hide();
                    deleteThisCategory();
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
                    <Button
                        text="Edit"
                        color={Color.WHITE}
                        bgColor={Color.ORANGE} 
                        actionHandler={() => router.push(`${categoryId}/edit`)}
                    />
                    <Button
                        text="Delete"
                        color={Color.WHITE}
                        bgColor={Color.RED} 
                        actionHandler={() => {
                            popup.show(deleteCateogryPopup);
                        }}
                    />
                </div>
            </Header>
            <Main>
                <div className="w-full h-full flex gap-3">
                    <InfoSection category={category} />
                    <ProductSection products={products} />
                </div>
            </Main>
        </section>
    )
}


function InfoSection({
    category
}: {
    category: ICategoryResponse
}) {
    const inforBars: {label: string, key: "id" | "name" | "description" | "imageUrl", icon: string}[] = [
        {label: "Id", key: "id", icon: "hashtag"},
        {label: "Name", key: "name", icon: "signature"},
        {label: "Description", key: "description", icon: "comment-dots"},
    ];
    
    return (
        <section className="w-2/5 p-3 pt-6 h-full flex flex-col border-2 rounded-l-sm gap-6">
            <Title
                text="Detailed Information"
                icon="circle-info"
                color={Color.BLUE}
            />
            <div className="relative w-full h-80">
                <Image
                    className="object-cover"
                    src={category.imageUrl ?? "/images/warehouse.webp"}
                    alt="Log in image"
                    fill
                /> 
            </div>
            <div className="flex flex-col gap-3"> 
                {inforBars.map(infoBar =>
                    <InfoBar
                        key={infoBar.label}
                        label={infoBar.label}
                        value={category?.[infoBar.key] ?? ""}
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
    products: IProduct[]
}) {
    return (
        <section className="w-3/5 p-3 pt-6 h-full flex flex-col border-2 rounded-r-sm gap-6">
            <Title text="Products belong to this category" icon="box-open" color={Color.GREEN} />
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