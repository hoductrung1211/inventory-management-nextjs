'use client';
import { GetAllCategories } from "@/api/category";
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
    const [categories, setCategories] = useState([]);
    const [filterdCateogris, setFilterdCateogris] = useState<IItem[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const router = useRouter();

    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchCategories() {
        try {
            showLoading();
            const {data} = await GetAllCategories();

            setCategories(data);
            setFilterdCateogris(data);
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
                    text="Add Category"
                    color={Color.WHITE}
                    bgColor={Color.GREEN} 
                    actionHandler={() => router.push("product-categories/add")}
                />
            </Header>
            <Main>
                <div className="w-full h-full flex flex-col gap-3">
                    <section className="flex gap-2 h-10">
                        <SearchInput
                            placeholder="Type category ID here..."
                            value={searchValue}
                            handleChange={e => {
                                const newSearchValue = e.target.value;
                                setSearchValue(newSearchValue);
                                const filterList = filterByFields(
                                        toIndexSignature(categories), 
                                        newSearchValue.trim(), 
                                        ["id", "name"]
                                    );
                                setFilterdCateogris(filterList);
                            }}
                        />
                    </section>
                    <Table
                        columns={[
                            {id: 1, text: "Id", key: "id", linkRoot: "product-categories/"},
                            {id: 2, text: "Category Name", key: "name"},
                            {id: 3, text: "Description", key: "description"}, 
                        ]}
                        dataSet={filterdCateogris}
                    />
                </div>
            </Main>
        </section>
    )
}