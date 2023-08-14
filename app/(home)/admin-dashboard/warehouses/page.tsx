'use client';
import { getAllBranches } from "@/api/branch";
import { getAllWarehouses } from "@/api/warehouse";
import Button from "@/components/Button";
import PageTitle from "@/components/PageTitle";
import SearchInput from "@/components/SearchInput";
import Header from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import Table from "@/layouts/Table"; 
import filterByFields, { IItem, toIndexSignature } from "@/utils/functions/filterByFields";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface IWarehouseData {
    id: number; 
    name: string; 
    address: string; 
    branchName: string | undefined;
}

export default function Page() {
    const [showLoading, hideLoading] = useLoadingAnimation();
    const [warehouses, setWarehouses] = useState<IWarehouseData[]>([]);
    const [filterdWarehouses, setFilteredWarehouses] = useState<IItem[]>([]);
    const router = useRouter();
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        fetchWarehouses();
    }, []);

    async function fetchWarehouses() {
        try {
            showLoading(); 
            const {data: warehouseData} = await getAllWarehouses();
            const {data: branchData} = await getAllBranches();

            const newWarehouses : IWarehouseData[] = warehouseData.map((wh) => {
                const branch = branchData.find(br => br.id == wh.branchId);
                return {
                    id: wh.id,
                    name: wh.name,
                    address: wh.address,
                    branchName: branch?.name,
                }
            });

            setWarehouses(newWarehouses);
            setFilteredWarehouses(toIndexSignature(newWarehouses));
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
                <PageTitle text="Warehouse List" /> 
            </Header>
            <Main>
                <div className="w-full h-full flex flex-col gap-3">
                    <section className="flex justify-between gap-2 h-10">
                        <SearchInput
                            placeholder="Type warehouse ID here..."
                            value={searchValue}
                            handleChange={e => {
                                const newSearchValue = e.target.value;
                                setSearchValue(newSearchValue);
                                const filterList = filterByFields(
                                        toIndexSignature(warehouses), 
                                        newSearchValue.trim(), 
                                        ["id", "name"]
                                    );
                                setFilteredWarehouses(filterList);
                            }}
                        />
                        <Button
                            variant="outlined"
                            icon="square-plus" 
                            href="warehouses/add"
                        >
                            Add
                        </Button>
                    </section>
                    <Table
                        columns={[
                            {id: 1, text: "Id", key: "id", linkRoot: "warehouses/"},
                            {id: 2, text: "Warehouse Name", key: "name"},
                            {id: 3, text: "Address", key: "address"}, 
                            {id: 4, text: "Branch Name", key: "branchName"}, 
                        ]}
                        dataSet={filterdWarehouses}
                    />
                </div>
            </Main>
        </section>
    )
}