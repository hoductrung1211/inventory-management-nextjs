'use client';
import { IPartnerResponse, getAllPartners } from "@/api/partner";
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
    const [partners, setPartners] = useState<IPartnerResponse[]>([]);
    const [filterdPartners, setFilterdPartners] = useState<IItem[]>([]);
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        fetchPartners();
    }, []);

    async function fetchPartners() {
        try {
            showLoading();
            const {data} = await getAllPartners();
            setPartners(data);
            setFilterdPartners(toIndexSignature(data));
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
                    text="Add Partner"
                    color={Color.WHITE}
                    bgColor={Color.GREEN} 
                    actionHandler={() => router.push("partners/add")}
                />
            </Header>
            <Main>
                <div className="w-full h-full flex flex-col gap-3">
                    <section className="flex gap-2 h-10">
                        <SearchInput
                            placeholder="Type partner ID here..."
                            value={searchValue}
                            handleChange={e => {
                                const newSearchValue = e.target.value;
                                setSearchValue(newSearchValue);
                                const filterList = filterByFields(
                                        toIndexSignature(partners), 
                                        newSearchValue.trim(), 
                                        ["id", "name"]
                                    );
                                setFilterdPartners(filterList);
                            }}
                        />
                    </section>
                    <Table
                        columns={[
                            {id: 1, text: "Id", key: "id", linkRoot: "product-categories/"},
                            {id: 2, text: "Name", key: "name"},
                            {id: 3, text: "Phone number", key: "phoneNumber"}, 
                            {id: 4, text: "Phone number", key: "phoneNumber"}, 
                            {id: 5, text: "Address", key: "email"}, 
                            {id: 6, text: "Description", key: "detailDescription"}, 
                        ]}
                        dataSet={filterdPartners}
                    />
                </div>
            </Main>
        </section>
    )
}