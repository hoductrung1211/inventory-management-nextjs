'use client';
import { IBranchResponse, getAllBranches } from "@/api/branch";
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
            let warehouseData : IWarehouseResponse[];
            let branchData: IBranchResponse[];
            
            const warehouseResponse = await getAllWarehouses();
            const branchResponse = await getAllBranches();

            warehouseData = warehouseResponse.data;
            branchData = branchResponse.data;

            const newWarehouses = warehouseData.map((wh) => {
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
                <Button 
                    text="Add Warehouse"
                    color={Color.WHITE}
                    bgColor={Color.GREEN} 
                    actionHandler={() => {router.push("warehouses/add")}}
                />
            </Header>
            <Main>
                <div className="w-full h-full flex flex-col gap-3">
                    <section className="flex gap-2 h-10">
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