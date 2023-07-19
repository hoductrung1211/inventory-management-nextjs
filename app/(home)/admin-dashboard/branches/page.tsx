'use client';
import { IBranchResponse, getAllBranches } from "@/api/branch";
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
            setFilterBranches(data);
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
                    text="Add Branch"
                    color={Color.WHITE}
                    bgColor={Color.GREEN} 
                    actionHandler={() => {router.push("branches/add")}}
                />
            </Header>
            <Main>
                <div className="w-full h-full flex flex-col gap-3">
                    <section className="flex gap-2 h-10">
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