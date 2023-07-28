'use client';
import { ISupplierResponse, getAllSuppliers } from "@/api/supplier";
import SearchInput from "@/components/SearchInput";
import Header, { Button } from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import Table from "@/layouts/Table";
import { Color } from "@/utils/constants/colors";
import filterByFields, { IItem, toIndexSignature } from "@/utils/functions/filterByFields";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
    const router = useRouter();
    const [showLoading, hideLoading] = useLoadingAnimation();
    const [suppliers, setSuppliers] = useState<ISupplierResponse[]>([]);
    const [filterdSuppliers, setFilterdSuppliers] = useState<IItem[]>([]);
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        fetchSuppliers();
    }, []);

    async function fetchSuppliers() {
        try {
            showLoading();
            const {data} = await getAllSuppliers();
            setSuppliers(data);
            setFilterdSuppliers(toIndexSignature(data));
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
                    text="Add Supplier"
                    color={Color.WHITE}
                    bgColor={Color.GREEN} 
                    actionHandler={() => router.push("suppliers/add")}
                />
            </Header>
            <Main>
                <div className="w-full h-full flex flex-col gap-3">
                    <section className="flex gap-2 h-10">
                        <SearchInput
                            placeholder="Type supplier ID here..."
                            value={searchValue}
                            handleChange={e => {
                                const newSearchValue = e.target.value;
                                setSearchValue(newSearchValue);
                                const filterList = filterByFields(
                                        toIndexSignature(suppliers), 
                                        newSearchValue.trim(), 
                                        ["id", "name"]
                                    );
                                setFilterdSuppliers(filterList);
                            }}
                        />
                    </section>
                    <Table
                        columns={[
                            {id: 1, text: "Id", key: "id", linkRoot: "suppliers/"},
                            {id: 2, text: "Name", key: "name"},
                            {id: 3, text: "Phone number", key: "phoneNumber"}, 
                            {id: 4, text: "Email", key: "email"}, 
                            {id: 5, text: "Address", key: "address"}, 
                            {id: 6, text: "Description", key: "detailDescription"}, 
                        ]}
                        dataSet={filterdSuppliers}
                    />
                </div>
            </Main>
        </section>
    )
}