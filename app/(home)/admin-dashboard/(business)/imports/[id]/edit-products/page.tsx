'use client' 
import Header, { Button } from "@/layouts/DashboardHeader"
import Main from "@/layouts/DashboardMain"
import { Color } from "@/utils/constants/colors"
import { useEffect, useState } from "react";
import useNotification from "@/utils/hooks/useNotification";
import SupplierSection, { CreateSupplier, Field, SelectSupplier } from "@/layouts/SupplierSection";
import ProductsSection, { IOrderDetail } from "@/layouts/ProductsSection"; 
import { useRouter } from "next/navigation"; 
import { IImportOrderDetailResponse, deleteImportOrderDetail, getImportOrdersDetailById } from "@/api/importOrderDetail";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import { IProductResponse, getAllProducts, getProductById } from "@/api/product";
import { couldStartTrivia } from "typescript";
import DataTable, { IDetailData } from "./DataTable";
import AddControlSection from "./AddControlSection";
import EditControlSection from "./EditControlSection";
import usePopup from "@/utils/hooks/usePopup";
import BackwardButton from "@/components/BackwardButton";

export default function Page({
    params
}: {
    params: {id: string}
}) { 
    const router = useRouter();
    const [showLoading, hideLoading] = useLoadingAnimation();
    const notify = useNotification();
    const popup = usePopup();
    // Page
    const orderId = Number.parseInt(params.id);
    const [orderProducts, setOrderProducts] = useState<IImportOrderDetailResponse[]>([]);
    // Table
    const [dataset, setDataset] = useState<IDetailData[]>([]);
    // Edit
    const [selectedProduct, setSelectedProduct] = useState<IImportOrderDetailResponse>(); // selected == undefined --> State Adding 
    // Add
    const [productDropdown, setProductDropdown] = useState<{text: string, value: number}[]>([]);
    const [productName, setProductName] = useState("");

    useEffect(() => {
        setUpData();
    }, []);

    const setUpData = async () => {
        try {
            showLoading();
            const {data: orderProducts} = await getImportOrdersDetailById(orderId);
            setOrderProducts(orderProducts);

            const {data: products} = await getAllProducts();
            setDataset(orderProducts.map(orderProd => {
                const prod = products.find(p => p.id === orderProd.productId);
                return {
                    price: orderProd.price.toLocaleString(),
                    product: prod?.name ?? "",
                    productId: orderProd.productId,
                    quantity: orderProd.quantity.toLocaleString(),
                    totalPrice: (orderProd.price * orderProd.quantity).toLocaleString(),
                }
            }));

            const newDropdown = products.filter(prod => 
                !orderProducts.find(orProd => orProd.productId == prod.id)
            ).map(prod => ({
                text: prod.name,
                value: prod.id
            }));

            setProductDropdown(newDropdown);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    } 

    const handleChangeSelected = async (id: number) => { 
        setSelectedProduct(orderProducts.find(prod => prod.productId === id));
        const {data} = await getProductById(id)
        setProductName(data.name)
    }

    const handleDelete = (productId: number) => {
        showLoading();
        deleteImportOrderDetail(orderId, productId)
        .then(res => {
            setDataset(dataset.filter(item => item.productId != productId));
        })
        .catch(error => console.log(error))
        .finally(() => hideLoading());
    }

    const handleUpdate = (newQuantity: number, newPrice: number) => {
        setSelectedProduct(undefined);
        const productId = selectedProduct?.productId;
        setDataset(dataset.map(detail => {
            if (detail.productId == productId)
                return ({
                    ...detail,
                    price: newPrice.toLocaleString(),
                    quantity: newQuantity.toLocaleString(),
                    totalPrice: (newPrice * newQuantity).toLocaleString(),
                });
            return detail;
        }))
    }

    const handleCancelEdit = () => { 
        setSelectedProduct(undefined);
    }

    return (
        <section className="w-full flex flex-col">
            <Header>
                <div className="flex gap-4">
                    <BackwardButton />
                </div>
            </Header>
            <Main>
                <div className="w-full h-full flex flex-col gap-2 rounded-md">
                    <DataTable
                        dataset={dataset} 
                        handleChangeSelected={handleChangeSelected}
                        handleDelete={handleDelete}
                    />
                    <section className="flex-shrink-0 table-layout gap-2 h-14 px-2 items-center bg-gray-50 rounded-md">
                    {
                        selectedProduct ?
                        <EditControlSection
                            key={selectedProduct?.productId ?? 0}
                            detail={selectedProduct}
                            productName={productName}
                            // dropdown={productDropdown}
                            handleCancelEdit={handleCancelEdit}
                            handleUpdate={handleUpdate}
                        /> :
                        <AddControlSection />
                    }
                    </section> 
                </div>
            </Main>
        </section>
    )
}
