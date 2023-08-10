'use client';

import { getExportOrdersDetailById } from "@/api/exportOrderDetail";
import { getExportReceiptDetail } from "@/api/exportReceiptDetail";
import { getImportReceiptDetail } from "@/api/importReceiptDetail";
import { getAllProducts } from "@/api/product";
import Icon from "@/components/Icon";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import { useEffect, useState } from "react";

interface IDetailData {
    product: string,
    quantity: number,
    price: number,
}

export default function TableDetailView({
    orderId,
}: {
    orderId: number,
}) {
    const [showLoading, hideLoading] = useLoadingAnimation();
    const [details, setDetails] = useState<IDetailData[]>([]);
    
    useEffect(() => {
        fetchDetails();
    }, []);

    const fetchDetails = async () => {
        showLoading();
        try {
            const {data: orderDetails} = await getImportReceiptDetail(orderId);
            const {data: products} = await getAllProducts();

            setDetails(orderDetails.map(detail => {
                const product = products.find(p => p.id == detail.productId);
                return {
                    product: product?.name ?? "",
                    quantity: detail.quantity,
                    price: detail.price,
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

    const total = details.reduce<number>((res, item) => res + item.price * item.quantity, 0);
    return (
        <section className="flex flex-col gap-2 w-1/2">
            <div className="flex items-center py-2 gap-3">
                <div className="w-12 aspect-square grid place-items-center rounded-full text-gray-700 bg-slate-200"><Icon name="box" size="xl" /></div>
                <h3 className="font-semibold">
                    Receipt Items
                </h3>
            </div>
            <div className=" flex flex-col h-full">
                <header className="grid grid-cols-6 items-center py-1 px-2 h-11 border-b text-center font-semibold bg-gray-50 rounded-t-md">
                    <div className="col-span-3">Item</div>
                    <div className="col-span-1">Quantity</div>
                    <div className="col-span-2">Price</div>
                </header>
                <main className="h-[440px]  overflow-auto">
                {
                    details.map(item => (
                        <div key={item.product} className="grid grid-cols-6 items-center text-center  py-1 px-2 h-11 border-b hover:bg-gray-50">
                            <div className="col-span-3">{item.product}</div>
                            <div className="col-span-1 ">{item.quantity}</div>
                            <div className="col-span-2 ">VND {item.price.toLocaleString()}</div>
                        </div>
                    ))
                }
                </main>
            </div>
            <div className="h-full flex flex-col justify-between bg-gray-50 p-3 ">
                <p className="h-6 flex items-center font-semibold">RECEIPT SUMMARY</p> 
                <p className=" flex items-center justify-between">
                    <span className="">Sub Total</span>
                    VND {total.toLocaleString()}
                </p> 
                <p className=" flex items-center justify-between">
                    <span className="">VAT</span>
                    0%
                </p> 
                <p className=" flex items-center justify-between font-semibold">
                    <span className="">Total</span>
                    VND {total.toLocaleString()}
                </p> 
            </div>
        </section>
    )
}