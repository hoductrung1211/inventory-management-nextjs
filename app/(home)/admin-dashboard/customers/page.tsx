'use client';
import { ICustomerResponse, getAllCustomers } from "@/api/customer";
import Button from "@/components/Button";
import PageTitle from "@/components/PageTitle";
import SearchInput from "@/components/SearchInput";
import Header from "@/layouts/DashboardHeader";
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
    const [customers, setCustomers] = useState<ICustomerResponse[]>([]);
    const [filterdCustomers, setFilterdCustomers] = useState<IItem[]>([]);
    const [searchValue, setSearchValue] = useState("");
    
    useEffect(() => {
        fetchCustomers();
    }, []);

    async function fetchCustomers() {
        try {
            showLoading();
            const {data} = await getAllCustomers();
            setCustomers(data);
            setFilterdCustomers(toIndexSignature(data));
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
                <PageTitle text="Customer List" /> 
            </Header>
            <Main>
                <div className="w-full h-full flex flex-col gap-3">
                    <section className="flex justify-between gap-2 h-10">
                        <SearchInput
                            placeholder="Type customer ID here..."
                            value={searchValue}
                            handleChange={e => {
                                const newSearchValue = e.target.value;
                                setSearchValue(newSearchValue);
                                const filterList = filterByFields(
                                        toIndexSignature(customers), 
                                        newSearchValue.trim(), 
                                        ["id", "name"]
                                    );
                                setFilterdCustomers(filterList);
                            }}
                        />
                        <Button
                            variant="outlined"
                            icon="square-plus" 
                            href="customers/add"
                        >
                            Add
                        </Button>
                    </section>
                    <Table
                        columns={[
                            {id: 1, text: "Id", key: "id", linkRoot: "customers/"},
                            {id: 2, text: "Name", key: "name"},
                            {id: 3, text: "Phone number", key: "phoneNumber"}, 
                            {id: 4, text: "Email", key: "email"}, 
                            {id: 5, text: "Address", key: "address"}, 
                        ]}
                        dataSet={filterdCustomers}
                    />
                </div>
            </Main>
        </section>
    )
}