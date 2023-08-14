'use client';
import { IBranchResponse, getAllBranches } from "@/api/branch";
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
    const [showLoading, hideLoading] = useLoadingAnimation();
    const [branches, setBranches] = useState<IBranchResponse[]>([]);
    const router = useRouter();
    const [filterBranches, setFilterBranches] = useState<IItem[]>([]);
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        fetchBranches();
    }, []);

    async function fetchBranches() {
        try {
            showLoading();
            const {data} = await getAllBranches();
            setBranches(data);
            setFilterBranches(toIndexSignature(data));
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
                <PageTitle text="Branch List" /> 
            </Header>
            <Main>
                <div className="w-full h-full flex flex-col gap-3">
                    <section className="flex justify-between gap-2 h-10">
                        <SearchInput
                            placeholder="Type branch ID here..."
                            value={searchValue}
                            handleChange={e => {
                                const newSearchValue = e.target.value;
                                setSearchValue(newSearchValue);
                                const filterList = filterByFields(
                                        toIndexSignature(branches), 
                                        newSearchValue.trim(), 
                                        ["id", "name"]
                                    );
                                setFilterBranches(filterList);
                            }}
                        />
                        <Button
                            variant="outlined"
                            icon="square-plus" 
                            href="branches/add"
                        >
                            Add
                        </Button>
                    </section>
                    <Table
                        columns={[
                            {id: 1, text: "Id", key: "id", linkRoot: "branches/"},
                            {id: 2, text: "Branch Name", key: "name"},
                            {id: 3, text: "Address", key: "address"}, 
                        ]}
                        dataSet={filterBranches}
                    />
                </div>
            </Main>
        </section>
    )
}