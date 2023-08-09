'use client';
import { getAllImportOrder } from "@/api/importOrder";
import { getAllSuppliers } from "@/api/supplier";
import { getAllTrackingStates } from "@/api/trackingState";
import { getAllWarehouses } from "@/api/warehouse";
import Button from "@/components/Button";
import SearchInput from "@/components/SearchInput";
import Header from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import Table from "@/layouts/Table"; 
import filterByFields, { IItem, toIndexSignature } from "@/utils/functions/filterByFields";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export interface IImportOrderData {
    id: number,
    supplierName: string,
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
    const [imports, setImports] = useState<IImportOrderData[]>([]);
    const [filterdImports, setFilteredImports] = useState<IItem[]>([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    async function fetchOrders() {
        try {
            showLoading(); 
            const {data} = await getAllImportOrder();
            const {data: suppliers} = await getAllSuppliers();
            const {data: warehouses} = await getAllWarehouses();
            const {data: trackingStates} = await getAllTrackingStates();
            const newData = data.map(importOrder => {
                const supplier = suppliers.find(p => p.id === importOrder.supplierId);
                const warehouse = warehouses.find(whs => whs.id === importOrder.warehouseId);
                const trackingState = trackingStates.find(ts => ts.id === importOrder.trackingStateId);
                return ({
                    ...importOrder,
                    supplierName: supplier?.name + "",
                    warehouseName: warehouse?.name + "",
                    trackingStateName: trackingState?.name + "",
                    lastUpdatedTime: new Date(importOrder.lastUpdatedTime).toLocaleString()
                })
            })
            setImports(newData);
            setFilteredImports(toIndexSignature(newData));
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
                <h1 className="font-semibold">Import Orders</h1>
            </Header>
            <Main>
                <div className="w-full h-full flex flex-col gap-3">
                    <header className="flex justify-between gap-2 h-10">
                        <SearchInput
                            placeholder="Type Import Order ID here..."
                            value={searchValue}
                            handleChange={e => {
                                const newSearchValue = e.target.value;
                                setSearchValue(newSearchValue);
                                const filterList = filterByFields(
                                        toIndexSignature(imports), 
                                        newSearchValue.trim(), 
                                        ["id", "supplierName"]
                                    );
                                setFilteredImports(filterList);
                            }}
                        /> 
                        <Button
                            variant="outlined"
                            icon="square-plus" 
                            href="imports/add"
                        >
                            Add
                        </Button>
                    </header>
                    <Table
                        columns={[
                            {id: 1, text: "Id", key: "id", linkRoot: "imports/"},
                            {id: 2, text: "Supplier Name", key: "supplierName"},
                            {id: 3, text: "Warehouse Name", key: "warehouseName"},
                            {id: 4, text: "State", key: "trackingStateName"},
                            {id: 6, text: "Last updated", key: "lastUpdatedTime"},
                        ]}
                        dataSet={filterdImports}
                    />
                </div>
            </Main>
        </section>
    )
}