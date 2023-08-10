'use client';
import { getAllCustomers } from "@/api/customer";
import { getAllExportOrder } from "@/api/exportOrder";
import { getAllTrackingStates } from "@/api/trackingState";
import { getAllWarehouses } from "@/api/warehouse";
import Button from "@/components/Button";
import SearchInput from "@/components/SearchInput";
import Header  from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import Table from "@/layouts/Table";
import filterByFields, { IItem, toIndexSignature } from "@/utils/functions/filterByFields";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export interface IExportOrderData {
    id: number,
    customerName: string,
    warehouseName: string,
    warehouseId: number,
    trackingStateName: string,
    receiptId?: number,
    trackingStateId: number,
    lastUpdatedTime: string,
}

export default function Page() {
    const router = useRouter();
    const [showLoading, hideLoading] = useLoadingAnimation();

    const [searchValue, setSearchValue] = useState("");
    const [exports, setExports] = useState<IExportOrderData[]>([]);
    const [filterdExports, setFilteredExports] = useState<IItem[]>([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    async function fetchOrders() {
        try {
            showLoading(); 
            const {data} = await getAllExportOrder();
            const {data: customers} = await getAllCustomers();
            const {data: warehouses} = await getAllWarehouses();
            const {data: trackingStates} = await getAllTrackingStates();
            const newData = data.map(order => {
                const customer = customers.find(p => p.id === order.customerId);
                const warehouse = warehouses.find(whs => whs.id === order.warehouseId);
                const trackingState = trackingStates.find(ts => ts.id === order.trackingStateId);
                return ({
                    ...order,
                    customerName: customer?.name + "",
                    warehouseName: warehouse?.name + "",
                    trackingStateName: trackingState?.name + "",
                    lastUpdatedTime: new Date(order.lastUpdatedTime).toLocaleString()
                });
            });
            setExports(newData);
            setFilteredExports(toIndexSignature(newData));
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
                <h1 className="font-semibold">Export Orders</h1>
            </Header>
            <Main>
                <div className="w-full h-full flex flex-col gap-3">
                    <section className="flex justify-between gap-2 h-10">
                        <SearchInput
                            placeholder="Type Export Order ID here..."
                            value={searchValue}
                            handleChange={e => {
                                const newSearchValue = e.target.value;
                                setSearchValue(newSearchValue);
                                const filterList = filterByFields(
                                        toIndexSignature(exports), 
                                        newSearchValue.trim(), 
                                        ["id", "customerName"]
                                    );
                                setFilteredExports(filterList);
                            }}
                        /> 
                    </section>
                    <Table
                        columns={[
                            {id: 1, text: "Id", key: "id", linkRoot: "exports/"},
                            {id: 2, text: "Customer Name", key: "customerName"},
                            {id: 3, text: "Warehouse Name", key: "warehouseName"},
                            {id: 4, text: "State", key: "trackingStateName"},
                            {id: 6, text: "Last updated", key: "lastUpdatedTime"},
                        ]}
                        dataSet={filterdExports}
                    />
                </div>
            </Main>
        </section>
    )
}