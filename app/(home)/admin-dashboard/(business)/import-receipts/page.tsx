'use client';
import { getAllBranches } from "@/api/branch";
import { getAllEmployees } from "@/api/employee";
import { getAllImportReceipt } from "@/api/importReceipt";
import { getAllWarehouses } from "@/api/warehouse";
import SearchInput from "@/components/SearchInput";
import Header, { Button } from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import Table from "@/layouts/Table";
import datetimeFormat from "@/utils/functions/datetimeFormat";
import filterByFields, { IItem, toIndexSignature } from "@/utils/functions/filterByFields";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export interface IReceipt {
    id: number,
    orderId: number,
    warehouse: string,
    employee: string,
    datetime: string,
}

export default function Page() {
    const router = useRouter();
    const [showLoading, hideLoading] = useLoadingAnimation();

    const [searchValue, setSearchValue] = useState("");
    const [receipts, setReceipts] = useState<IReceipt[]>([]);
    const [filterdReceipts, setFilteredReceipts] = useState<IItem[]>([]);

    useEffect(() => {
        fetchReceipts();
    }, []);

    async function fetchReceipts() {
        try {
            showLoading(); 
            const {data: receiptsResponse} = await getAllImportReceipt();
            const {data : warehouses} = await getAllWarehouses();
            const {data: employees} = await getAllEmployees();

            const newReceipts: IReceipt[] = receiptsResponse.map(r => {
                const warehouse = warehouses.find(whs => whs.id === r.warehouseId);
                const employee = employees.find(ee => ee.id === r.employeeId);

                return {
                    id: r.id,
                    orderId: r.orderId,
                    employee: employee?.lastName + " " + employee?.firstName,
                    datetime: datetimeFormat(r.dateTime),
                    warehouse: warehouse?.name + "",     
                } 
            });

            setReceipts(newReceipts);
            setFilteredReceipts(toIndexSignature(newReceipts));
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
                <div></div>
            </Header>
            <Main>
                <div className="w-full h-full flex flex-col gap-3">
                    <section className="flex gap-2 h-10">
                        <SearchInput
                            placeholder="Type Receipt ID here..."
                            value={searchValue}
                            handleChange={e => {
                                const newSearchValue = e.target.value;
                                setSearchValue(newSearchValue);
                                const filterList = filterByFields(
                                        toIndexSignature(receipts), 
                                        newSearchValue.trim(), 
                                        ["id"]
                                    );
                                setFilteredReceipts(filterList);
                            }}
                        />
                    </section>
                    <Table
                        columns={[
                            {id: 1, text: "ID", key: "id", linkRoot: "import-receipts/"},
                            {id: 2, text: "Order ID", key: "orderId"},
                            {id: 5, text: "Warehouse", key: "warehouse"},
                            {id: 6, text: "Employee", key: "employee"},
                            {id: 7, text: "Date Time", key: "datetime"},
                        ]}
                        dataSet={filterdReceipts}
                    />
                </div>
            </Main>
        </section>
    )
}