'use client';

import { getExportOrderById } from "@/api/exportOrder";
import { getExportOrdersDetailById } from "@/api/exportOrderDetail";
import { createExportReceipt } from "@/api/exportReceipt";
import { getAllProducts } from "@/api/product";
import { getWarehouseById } from "@/api/warehouse";
import Icon from "@/components/Icon";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import { useEffect, useState } from "react";

interface IDetailData {
    productId: number,
    product: string,
    quantity: number,
    price: number,
    isRemoved: boolean
}

export default function TableReceiptView({
    orderId,
    handleRefreshInfo,
    backToViewMode
}: {
    orderId: number,
    handleRefreshInfo: () => void,
    backToViewMode: () => void,
}) {
    const notify = useNotification();
    const [showLoading, hideLoading] = useLoadingAnimation();
    const [details, setDetails] = useState<IDetailData[]>([]);
    
    useEffect(() => {
        fetchDetails();
    }, []);

    const fetchDetails = async () => {
        showLoading();
        try {
            const {data: orderDetails} = await getExportOrdersDetailById(orderId);
            const {data: products} = await getAllProducts();

            setDetails(orderDetails.map(detail => {
                const product = products.find(p => p.id == detail.productId);
                return {
                    productId: detail.productId,
                    product: product?.name ?? "",
                    quantity: detail.quantity,
                    price: detail.price,
                    isRemoved: false
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

    async function handleCreateReceipt() {
        showLoading();
        if (!checkConstraints())
            return;

        const dataDetails = details.map(detail => ({
            "productId": detail.productId,
            "quantity": detail.quantity,
            "price": detail.price,
        }));
        
        try {
            const {data: order} = await getExportOrderById(orderId);

            console.log({
                orderId: orderId,
                warehouseId: order.warehouseId,
                receiptDetails: dataDetails
            });

            await createExportReceipt({
                orderId: orderId,
                warehouseId: order.warehouseId,
                customerId: order.customerId,
                receiptDetails: dataDetails
            });

            handleRefreshInfo();
            notify("Create receipt successfully!", "success");
            backToViewMode();
        }
        catch (error) {
            console.log(error);
            notify("Create receipt failed!", "error");
        }
        finally {
            hideLoading();
        }
    }

    function checkConstraints(): boolean {
        const itemNotRemove = details.find(d => !d.isRemoved);
        if (!itemNotRemove) {
            notify("Cannot create a receipt with no items", "error");
            return false;
        }
        return true;
    }

    return (
        <section className="flex flex-col gap-2 w-1/2">
            <div className="flex items-center py-2 gap-3">
                <div className="w-12 aspect-square grid place-items-center rounded-full text-gray-700 bg-slate-200"><Icon name="receipt" size="xl" /></div>
                <h3 className="font-semibold">
                    Receipt Items
                </h3>
            </div>
            <div className=" flex flex-col h-full">
                <header className="grid grid-cols-7 items-center py-1 px-2 h-11 border-b text-center font-semibold bg-gray-50 rounded-t-md">
                    <div className="col-span-2">Item</div>
                    <div className="col-span-2">Quantity</div>
                    <div className="col-span-2">Price</div>
                    <div className="col-span-1">Removed</div>
                </header>
                <main className="h-[480px]  overflow-auto">
                {
                    details.map(item => (
                        <div 
                            key={item.productId} 
                            className={"grid grid-cols-7 items-center gap-1 text-center  py-1 px-2 h-11 border-b" + (item.isRemoved ? " bg-red-100" : "  hover:bg-gray-50 ")}
                        >
                            <div className="col-span-2">{item.product}</div>
                            <div className="col-span-2 h-full">
                                <input 
                                    className="w-full h-full px-2 text-end border rounded-md"
                                    type="number" 
                                    value={item.quantity}
                                    onChange={e => {
                                        setDetails(details.map(d => {
                                            if (d.product === item.product)
                                                return {
                                                    ...d,
                                                    quantity: Number.parseInt(e.target.value)
                                                };
                                            return d;
                                        }));
                                    }}
                                />
                            </div>
                            <div className="col-span-2 h-full">
                                <input 
                                    className="w-full h-full px-2 text-end border rounded-md"
                                    type="number" 
                                    value={item.price}
                                    onChange={e => {
                                        setDetails(details.map(d => {
                                            if (d.product === item.product)
                                                return {
                                                    ...d,
                                                    price: Number.parseInt(e.target.value)
                                                };
                                            return d;
                                        }));
                                    }}
                                />
                            </div>
                            <div className="col-span-1 ">
                                <input 
                                    className="w-5 aspect-square cursor-pointer"
                                    type="checkbox" 
                                    checked={item.isRemoved}
                                    onChange={e => {
                                        setDetails(details.map(d => {
                                            if (d.product === item.product)
                                                return {
                                                    ...d,
                                                    isRemoved: e.target.checked
                                                };
                                            return d;
                                        }));
                                    }}
                                />
                            </div>
                        </div>
                    ))
                }
                </main> 
            </div> 
            <div className="flex justify-end items-center  ">
                <button 
                    className="flex items-center gap-2 h-10 px-3 text-white bg-blue-500 font-semibold  rounded-md border"
                    onClick={handleCreateReceipt}
                >
                    Done
                    <Icon name="square-check" size="xl" />
                </button>
            </div>
        </section>
    )
}