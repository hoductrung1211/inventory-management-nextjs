'use client';
import { IBranchResponse, deleteBranch, getBranchById } from "@/api/branch";
import { IImportOrderResponse, getImportOrderById } from "@/api/importOrder";
import { IWarehouseResponse, getAllWarehouses, getWarehouseById } from "@/api/warehouse";
import BackwardButton from "@/components/BackwardButton";
import Title from "@/components/DashboardTitle";
import InfoBar from "@/components/InfoBar";
import Popup from "@/components/Popup";
import Header, { Button } from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import Table from "@/layouts/Table";
import { Color } from "@/utils/constants/colors";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import usePopup from "@/utils/hooks/usePopup";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IImportOrderData } from "../page";
import { getSupplierById } from "@/api/supplier";
import { getTrackingStateById } from "@/api/trackingState";
import { getAllProducts } from "@/api/product";
import { getImportOrdersDetailById } from "@/api/importOrderDetail";
import Icon from "@/components/Icon";
import { IImportOrderTrackingResponse, getTrackingsByOrderId } from "@/api/importOrderTracking";
import { getAllEmployees } from "@/api/employee";

export interface IImportOrderDetailData {
    product: string,
    quantity: number,
    price: number
}

interface ITrackingData {
    dateTime: string,
    employee: string, 
    content: string,
}

export default function Page({
    params
}: {
    params: {id: string}
}) {
    const router = useRouter();
    const [showLoading, hideLoading] = useLoadingAnimation();
    
    const orderId = Number.parseInt(params.id);
    const [order, setOrder] = useState<IImportOrderData>({
        id: 0,
        supplierName: "",
        warehouseName: "",
        trackingStateName: "",
        lastUpdatedTime: "",
    });
    const [details, setDetails] = useState<IImportOrderDetailData[]>([]);
    const [trackings, setTrackings] = useState<ITrackingData[]>([]);

    useEffect(() => {
        fetchOrder();
        fetchDetails();
        fetchTrackings();
    }, []);

    async function fetchOrder() {
        try {
            showLoading();
            const {data} = await getImportOrderById(orderId);
            const {data: supplier} = await getSupplierById(data.supplierId);
            const {data: warehouse} = await getWarehouseById(data.warehouseId);
            const {data: trackingState} = await getTrackingStateById(data.trackingStateId);
            setOrder({
                ...data,
                supplierName: `${supplier.name}`,
                warehouseName: `${warehouse.name}`,
                trackingStateName: `${trackingState.name}`,
                lastUpdatedTime: new Date(data.lastUpdatedTime).toLocaleString()
            });
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }  

    const fetchDetails = async () => {
        try {
            showLoading();
            const {data} = await getImportOrdersDetailById(orderId);
            const {data: products} = await getAllProducts(); 
            setDetails(data.map(item => {
                const product = products.find(prod => prod.id === item.productId);
                return {
                    product: `${product?.name}`,
                    price: item.price,
                    quantity: item.quantity,
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

    const fetchTrackings = async () => {
        try {
            showLoading();
            const {data} = await getTrackingsByOrderId(orderId);
            const {data: employees} = await getAllEmployees();
            setTrackings(data.map(item => {
                const ee = employees.find(e => e.id === item.employeeId);
                return {
                    employee: `${ee?.lastName} ${ee?.firstName}`,
                    dateTime: new Date(item.dateTime).toLocaleString(),
                    content: item.content,
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
    return (
        <section className="w-full flex flex-col">
            <Header>
                <div className="flex gap-4">
                    <BackwardButton />
                    <Button
                        text="Edit"
                        color={Color.WHITE}
                        bgColor={Color.ORANGE} 
                        actionHandler={() => router.push(`${orderId}/edit`)}
                    /> 
                </div>
            </Header>
            <Main>
                <div className="w-full h-full flex gap-3">
                    <InfoSection order={order} />
                    <DetailSection 
                        orderDetails={details}
                        trackings={trackings}
                    />
                </div>
            </Main>
        </section>
    )
}

function InfoSection({
    order
}: {
    order: IImportOrderData
}) {
    const inforBars: { 
        label: string, 
        key: "id" | "supplierName" | "warehouseName" | "trackingStateName" | "lastUpdatedTime", 
        icon: string 
    }[] = [
        {label: "Id", key: "id", icon: "hashtag"},
        {label: "Supplier", key: "supplierName", icon: "handshake"},
        {label: "Warehouse", key: "warehouseName", icon: "warehouse"},
        {label: "State", key: "trackingStateName", icon: "circle-notch"},
        {label: "Last updated", key: "lastUpdatedTime", icon: "clock"},
    ];

    return (
        <section className="w-2/5 p-3 pt-6 h-full flex flex-col border-2 rounded-l-sm gap-6">
            <Title
                text="Detailed Information"
                icon="circle-info"
            />
            <div className="flex flex-col gap-3"> 
                {inforBars.map(infoBar =>
                    <InfoBar
                        key={infoBar.key}
                        label={infoBar.label}
                        value={order?.[infoBar.key] ?? ""}
                        icon={infoBar.icon}
                    />
                )}
            </div>
            <div className="flex flex-col gap-2 h-full p-3 bg-gray-50 rounded-md border-t-2">
                <div className="h-11 bg-gray-200 rounded-md">

                </div>
            </div>
        </section>
    )
}

function DetailSection({
    orderDetails,
    trackings
}: {
    orderDetails: IImportOrderDetailData[],
    trackings: ITrackingData[],
}) {
    const [viewMode, setViewMode] = useState(true);

    const button = 
        <button
            className="w-fit h-10 px-2 hover:bg-gray-100 rounded-md font-semibold"
            onClick={() => setViewMode(!viewMode)}
        >
            {viewMode ? 
            <><Icon name="toggle-off" size="2xl" /> Tracking View</> :
            <><Icon name="toggle-on" size="2xl" /> Tracking View</> }
        </button>  

    return (
        <section className="w-3/5 p-3 pt-6 h-full flex flex-col gap-3 border-2 rounded-r-sm ">
            {button}
            {
                viewMode ?
                <Table
                    columns={[
                        {id: 1, text: "Product", key: "product"},
                        {id: 2, text: "Quantity", key: "quantity"},
                        {id: 3, text: "Price", key: "price"},
                    ]}
                    dataSet={orderDetails}
                /> : 
                <Table
                    columns={[
                        {id: 2, text: "Employee", key: "employee"},
                        {id: 3, text: "Content", key: "content"},
                        {id: 1, text: "Update Time", key: "dateTime"},
                    ]}
                    dataSet={trackings}
                />
            }
        </section>
    )
}