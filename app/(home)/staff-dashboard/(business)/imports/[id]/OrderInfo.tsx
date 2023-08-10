'use client';

import { ITrackingStateResponse, getAllTrackingStates, getTrackingStateById } from "@/api/trackingState";
import { IWarehouseResponse, getWarehouseById } from "@/api/warehouse";
import Icon from "@/components/Icon";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import { ChangeEvent, useEffect, useState } from "react";
import { ViewMode } from "./page";
import { useRouter } from "next/navigation";
import { IImportOrderResponse, getImportOrderById, updateImportOrderState } from "@/api/importOrder";
import { ISupplierResponse, getSupplierById } from "@/api/supplier";

export default function OrderInfo({
    orderId,
    mode,
    setMode,
    handleRefreshInfo,
}: {
    orderId: number,
    mode: ViewMode,
    setMode: (newMode: ViewMode) => void,
    handleRefreshInfo: () => void,
}) {
    const router = useRouter();
    const [showLoading, hideLoading] = useLoadingAnimation();
    const notify = useNotification();

    const [order, setOrder] = useState<IImportOrderResponse>({
        id: orderId,
        supplierId: 0,
        lastUpdatedTime: new Date(),
        trackingStateId: 0,
        warehouseId: 0,
        receiptId: 0,
    });
    const [warehouse, setWarehouse] = useState<IWarehouseResponse>();
    const [trackingState, setTrackingState] = useState<ITrackingStateResponse>();
    const [trackingStateList, setTrackingStateList] = useState<ITrackingStateResponse[]>([]);
    const [supplier, setSupplier] = useState<ISupplierResponse>();

    const infoList: {title: string, content: string | undefined}[] = [
        {title: "Supplier", content: supplier?.name},
        {title: "Warehouse", content: warehouse?.name},
        {title: "State", content: trackingState?.name},
        // {title: "Last updated", content: datetimeFormat(order?.lastUpdatedTime ?? new Date())},
        {title: "Receipt", content: order?.receiptId ? "Đã khởi tạo" : "Chưa khởi tạo", },
    ];
    const [stateId, setStateId] = useState<number>();

    useEffect(() => {
        fetchOrder();
    }, []);

    async function fetchOrder() {
        showLoading();
        try {
            const {data: orderRes} = await getImportOrderById(orderId);
            const {data: warehouseRes} = await getWarehouseById(orderRes.warehouseId);
            const {data: trackingStateRes} = await getTrackingStateById(orderRes.trackingStateId);
            const {data: supplierRes} = await getSupplierById(orderRes.supplierId);
            const {data: trackingStateList} = await getAllTrackingStates();

            setOrder(orderRes);
            setWarehouse(warehouseRes);
            setTrackingState(trackingStateRes);
            setSupplier(supplierRes);
            setTrackingStateList(trackingStateList);

            setStateId(orderRes?.trackingStateId);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    async function handleUpdateState() {
        if (stateId == order.trackingStateId)
            return;

        showLoading();
        try {
            if (stateId == undefined)
                return;
            await updateImportOrderState(orderId, {stateId});
            setOrder({
                ...order,
                trackingStateId: stateId,
            });
            handleRefreshInfo();
            notify("Update state successfully!", "success");
        }
        catch (error) {
            console.log(error);
            notify("Update state failed!", "error");
        }
        finally {
            hideLoading();
        }
    }

    function handleChangeState(e: ChangeEvent<HTMLSelectElement>) {
        setStateId(Number.parseInt(e.target.value));
    }

    function handleToggleTrackingMode() {
        if (mode != ViewMode.Trackings)
            setMode(ViewMode.Trackings);
        else setMode(ViewMode.Items);
    }

    function handleToggleReceiptMode() {
        if (mode != ViewMode.Receipt)
            setMode(ViewMode.Receipt);
        else setMode(ViewMode.Items);
    }

    return (
        <section className="flex flex-col gap-5 w-1/2 bg-gray-50 p-3">
            {/* Order Info */}
            <div className="flex items-center gap-3">
                <div className="w-12 aspect-square grid place-items-center rounded-full text-gray-700 bg-slate-200"><Icon name="truck" size="xl" /></div>
                <h3 className="font-semibold">
                    Order #{order?.id}
                </h3>
            </div>
            <div className="grid grid-cols-2 gap-2"> 
                {infoList.map(info => (
                    <div key={info.title} className="flex flex-col gap-2 w-full h-20">
                        <h4 className="w-fit px-3 py-1 rounded-lg text-blue-500 bg-gray-100 border font-bold">{info.title}</h4>
                        <span className="pl-3">{info.content}</span>
                    </div>
                ))}
            </div>
            {/* Control Manager  */}
            <div className="flex flex-col h-full p-3 bg-gray-100 rounded-md">
                <h3 className=" flex items-center gap-3 p-3 font-semibold">
                     <Icon name="gamepad" size="xl" /> Control Manager
                </h3>
                <div className="h-full flex flex-col ">
                    <div className="h-12 px-3 py-1 grid grid-cols-3 items-center gap-2 bg-gray-50 border-b font-semibold">
                        <span className="justify-self-start">Tracking View</span>  
                        <div className="w-52"></div>
                        <button 
                            className={"justify-self-center flex gap-2 items-center w-fit px-3 py-2 rounded-md border  transition " + (mode == ViewMode.Trackings ? "bg-blue-500 text-gray-50 hover:bg-blue-400" : "text-blue-500 bg-gray-100 hover:bg-blue-100")}
                            onClick={handleToggleTrackingMode}
                        >
                            View
                            {
                                mode == ViewMode.Trackings ?
                                <Icon name="eye" size="lg" /> :
                                <Icon name="eye-slash" size="lg" />  
                            }
                        </button>
                    </div> 
                    <div className="h-12 px-3 py-1 grid grid-cols-3 items-center gap-2 bg-gray-50 border-b font-semibold">
                        <span className="justify-self-start">State</span> 
                        <select 
                            className="w-52 h-full outline-none rounded-md bg-gray-100"
                            onChange={order.receiptId ? () => {} : handleChangeState}
                            value={stateId} 
                        >
                            {trackingStateList.map(ts => (
                                <option key={ts.id} value={ts.id}>
                                    {ts.name}
                                </option>
                            ))}
                        </select>
                        {
                            !order.receiptId &&
                            <button 
                                className="justify-self-center w-fit px-3 py-2 rounded-md border text-blue-500 bg-gray-100 hover:bg-blue-100"
                                onClick={handleUpdateState}
                            >Update</button>
                        }
                    </div> 
                    <div className="h-12 px-3 py-1 grid grid-cols-3 items-center gap-2 bg-gray-50 border-b font-semibold">
                        <span className="justify-self-start">Receipt</span>  
                        {order.receiptId ?
                            <>
                                <div className="px-2 flex items-center w-52 h-full text-center border rounded-md font-normal">
                                    This order haven been created receipt   
                                </div>
                                <button 
                                    className="justify-self-center flex gap-2 items-center w-fit px-3 py-2 rounded-md border text-blue-500 bg-gray-100  hover:bg-blue-100"
                                    onClick={() => router.push(`../import-receipts/${order.receiptId}`)}
                                >
                                    View
                                    <Icon name="arrow-right" size="xl" /> 
                                </button>
                            </> :
                            <>
                                <div className="px-2 flex items-center w-52 h-full text-center border rounded-md font-normal">
                                    This order haven't been created receipt yet!    
                                </div>
                                <button 
                                    className={"justify-self-center flex gap-2 items-center w-fit px-3 py-2 rounded-md border  transition " + (mode == ViewMode.Receipt ? "bg-blue-500 text-gray-50 hover:bg-blue-400" : "text-blue-500 bg-gray-100 hover:bg-blue-100")}
                                    onClick={handleToggleReceiptMode}
                                >
                                    Create
                                    <Icon name="square-plus" size="xl" /> 
                                </button>
                            </>
                        }
                    </div> 
                </div>
            </div>
        </section>     
    )
}
