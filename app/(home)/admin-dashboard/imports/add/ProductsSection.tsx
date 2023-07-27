'use client';
import {IProductResponse, getAllProducts } from "@/api/product";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import { ChangeEvent, useEffect, useState } from "react";
import { IOrderDetail } from "./page";
import { IDropdownData } from "@/components/DropDown";
import { Button } from "@/layouts/DashboardHeader";
import { Color } from "@/utils/constants/colors";
import Icon from "@/components/Icon";

export default function ProductsSection({
    details,
    setDetails
}: {
    details: IOrderDetail[],
    setDetails: (newDetail: IOrderDetail[]) => void
}) {
    const notify = useNotification();
    const [showLoading, hideLoading] = useLoadingAnimation();
    // Data
    const [productDropdowns, setProductDropdowns] = useState<IDropdownData[]>([]);
    const [products, setProducts] = useState<IProductResponse[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            showLoading();
            const {data} = await getAllProducts();
            setProductDropdowns(data.map(item => ({
                text: item.name,
                value: item.id
            })));  
            setProducts(data);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    } 

    const handleAddDetail = (newDetail: IOrderDetail) => {
        setProductDropdowns(productDropdowns.filter(dd => dd.value != newDetail.productId));
        setDetails([
            ...details,
            newDetail
        ])
    }

    const handleRemoveDetail = (id: number) => {
        const newdropdown = products.find(prod => prod.id == id);
        setProductDropdowns([
            ...productDropdowns,
            {
                text: newdropdown?.name + "",
                value: newdropdown?.id + ""
            }
        ]);
        setDetails(details.filter(item => item.productId != id))
    }

    return (
        <div className="flex flex-col gap-2 h-full rounded-md overflow-hidden">
            <Header />
            <DetailsTable 
                details={details}
                handleRemoveDetail={handleRemoveDetail}
            />
            <DetailData 
                products={productDropdowns}
                handleAddDetail={handleAddDetail}
            />
        </div>
    )
}

const DetailData = ({
    products,
    handleAddDetail
}: {
    products: IDropdownData[],
    handleAddDetail: (newDetail: IOrderDetail) => void
}) => {
    const [orderDetail, setOrderDetail] = useState<IOrderDetail>({
        price: 1,
        productId: 0,
        productName: "",
        quantity: 1
    });

    useEffect(() => {
        if (products.length)
            setOrderDetail({
                ...orderDetail,
                productId: Number.parseInt(products[0].value + ""),
                productName: products[0].text,
            });
    }, [products]);

    if (products.length === 0)
        return (<></>)

    return (
        <section className="mt-auto flex-shrink-0 grid grid-cols-6 gap-1 place-content-center h-14 px-2 bg-gray-50 rounded-md">
            <div className="col-span-2 ">
                <select 
                    className="w-full h-10 pl-2 outline-none border-2 rounded-md"
                    value={orderDetail.productId}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                        const newProdId = Number.parseInt(e.target.value)
                        const isNaN = Number.isNaN(newProdId);
                        if (isNaN) return;

                        const product = products.find(prod => prod.value == newProdId);
                        setOrderDetail({
                            ...orderDetail,
                            productId: newProdId,
                            product: product?.text ?? ""
                        });
                    }}
                >
                {
                    products.map(prod => 
                        <option key={prod.value} value={prod.value}>{prod.text}</option>    
                    )
                }
                </select>
            </div>
            <div className="col-span-1">
                <input 
                    className="w-full h-10 pl-2 outline-none border-2 rounded-md"
                    type="number"
                    min="1"
                    max="1000000"
                    placeholder="Quantity"
                    value={orderDetail.quantity}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setOrderDetail({
                            ...orderDetail,
                            quantity: Number.parseInt(e.target.value)
                        })
                    }}
                />
            </div>
            <div className="col-span-2">
                <input 
                    className="w-full h-10 pl-2 outline-none border-2 rounded-md"
                    type="number"
                    min="1"
                    placeholder="Price"
                    value={orderDetail.price}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setOrderDetail({
                            ...orderDetail,
                            price: Number.parseInt(e.target.value)
                        })
                    }}
                />
            </div>
            <Button
                bgColor={Color.GREEN}
                color={Color.WHITE}
                text="Add"
                actionHandler={() => {
                    setOrderDetail({
                        price: 1,
                        productId: 0,
                        productName: "",
                        quantity: 1
                    });
                    handleAddDetail(orderDetail);
                }}
            />
        </section>
    )
}
 
const DetailsTable = ({
    details,
    handleRemoveDetail
}: {    
    details: IOrderDetail[],
    handleRemoveDetail: (id: number) => void
}) => {
    return (
        <main className="flex flex-col h-full max-h-[380px] overflow-auto">
        {
            details.map( detail => (
                <div 
                    key={detail.productId}
                    className="flex-shrink-0 min-h-[44px] grid grid-cols-6 border-2 border-transparent odd:bg-gray-50 hover:bg-gray-100 hover:border-gray-300"
                >
                {
                    headers.map(h => (
                        <div 
                            key={h.id}
                            className={`grid place-items-center h-full col-span-${h.col}`}
                        >
                        {typeof(detail[h.key]) == 'number' ? detail[h.key].toLocaleString() : detail[h.key]}
                        </div>
                    ))
                }
                <div 
                    className="grid place-items-center h-full col-span-1"
                >
                    <button 
                        className="grid place-items-center h-9 w-9 bg-red rounded-md text-gray-50"
                        onClick={() => handleRemoveDetail(detail.productId)}
                    >
                        <Icon
                            name="trash"
                            size="lg"
                        />
                    </button>
                </div>
                </div>
            ))
        }
        </main>
    )
}

interface IHeader {
    id: number,
    text: string,
    col: number,
    key: string,
}
const headers: IHeader[] = [
    {id: 1, text: "Product", key: "productName", col: 2},
    {id: 2, text: "Quantity", key: "quantity", col: 1},
    {id: 3, text: "Price", key: "price", col: 2},
    // {id: 4, text: "Action", key: "price", col: 1},
];
const Header = () => {
    return (
        <header className="flex-shrink-0 grid grid-cols-6 h-11  text-white">
        {
            headers.map(header => (
                <div key={header.id} className={`grid place-items-center font-bold bg-slate-700  col-span-${header.col} hover:bg-opacity-80`}>
                    {header.text}
                </div>
            ))
        } 
        <div className={`grid place-items-center font-bold bg-slate-700  col-span-1 hover:bg-opacity-80`}>
            Action
        </div>
        </header>
    )
}