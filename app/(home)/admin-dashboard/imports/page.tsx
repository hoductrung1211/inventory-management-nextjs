'use client';
import { IBranchResponse, getAllBranches } from "@/api/branch";
import { IEmployeeResponse, getAllEmployees } from "@/api/employee";
import { IImportOrderResponse, getAllImportOrder } from "@/api/importOrder";
import { getAllPartners } from "@/api/partner";
import { getAllTrackingStates } from "@/api/trackingState";
import { IWarehouseResponse, getAllWarehouses } from "@/api/warehouse";
import SearchInput from "@/components/SearchInput";
import Header, { Button } from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import Table from "@/layouts/Table";
import { Color } from "@/utils/constants/colors";
import filterByFields, { IItem, toIndexSignature } from "@/utils/functions/filterByFields";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface IImportOrderData {
    id: number,
    partnerName: string,
    warehouseName: string,
    trackingStateName: string,
    lastUpdatedTime: Date,
}

export default function Page() {
    const router = useRouter();
    const [showLoading, hideLoading] = useLoadingAnimation();

    const [searchValue, setSearchValue] = useState("");
    const [imports, setImports] = useState<IImportOrderData[]>([]);
    const [filterdImports, setFilteredImports] = useState<IItem[]>([]);

    useEffect(() => {
        fetchEmployees();
    }, []);

    async function fetchEmployees() {
        try {
            showLoading(); 
            const {data} = await getAllImportOrder();
            const {data: partners} = await getAllPartners();
            const {data: warehouses} = await getAllWarehouses();
            const {data: trackingStates} = await getAllTrackingStates();

            const newData = data.map(importOrder => {
                const partner = partners.find(p => p.id === importOrder.partnerId);
                const warehouse = warehouses.find(whs => whs.id === importOrder.warehouseId);
                const trackingState = trackingStates.find(ts => ts.id === importOrder.trackingStateId);

                return ({
                    ...importOrder,
                    partnerName: partner?.name + "",
                    warehouseName: warehouse?.name + "",
                    trackingStateName: trackingState?.name + "",
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
                <Button 
                    text="Add Import Order"
                    color={Color.WHITE}
                    bgColor={Color.GREEN} 
                    actionHandler={() => {router.push("imports/add")}}
                />
            </Header>
            <Main>
                <div className="w-full h-full flex flex-col gap-3">
                    <section className="flex gap-2 h-10">
                        <SearchInput
                            placeholder="Type Import Order ID here..."
                            value={searchValue}
                            handleChange={e => {
                                const newSearchValue = e.target.value;
                                setSearchValue(newSearchValue);
                                const filterList = filterByFields(
                                        toIndexSignature(imports), 
                                        newSearchValue.trim(), 
                                        ["id", "partnerName"]
                                    );
                                setFilteredImports(filterList);
                            }}
                        />
                    </section>
                    <Table
                        columns={[
                            {id: 1, text: "Id", key: "id", linkRoot: "imports/"},
                            {id: 2, text: "Partner Name", key: "partnerName"},
                            {id: 3, text: "Warehouse Name", key: "warehouseName"},
                            {id: 6, text: "Last updated", key: "lastUpdatedTime", transFunc: (datetime: string) => new Date(datetime).toLocaleString()},
                        ]}
                        dataSet={filterdImports}
                    />
                </div>
            </Main>
        </section>
    )
}