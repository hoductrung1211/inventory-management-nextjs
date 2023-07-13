'use client';
import { getAllBranches } from "@/api/branch";
import SearchInput from "@/components/SearchInput";
import Header, { Button } from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import Table from "@/layouts/Table";
import { Color } from "@/utils/constants/colors";
import useActiveNav from "@/utils/hooks/useActiveNav"
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
    const [_, setActiveNav] = useActiveNav();
    const [showLoading, hideLoading] = useLoadingAnimation();
    const [branches, setBranches] = useState([]);
    const router = useRouter();

    useEffect(() => {
        setActiveNav("Branches");
        fetchBranches();
    }, []);

    async function fetchBranches() {
        try {
            showLoading();
            const {data} = await getAllBranches();
            setBranches(data);
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
                        />
                    </section>
                    <Table
                        columns={[
                            {id: 1, text: "Id", key: "id", linkRoot: "branches/"},
                            {id: 2, text: "Branch Name", key: "name"},
                            {id: 3, text: "Address", key: "address"}, 
                        ]}
                        dataSet={branches}
                    />
                </div>
            </Main>
        </section>
    )
}