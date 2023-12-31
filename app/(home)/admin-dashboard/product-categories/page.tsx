'use client';
import { GetAllCategories, ICategoryResponse } from "@/api/category";
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

export default function Page() {
    const router = useRouter();
    const [showLoading, hideLoading] = useLoadingAnimation();
    const [categories, setCategories] = useState<ICategoryResponse[]>([]);
    const [filterdCategories, setFilterdCategories] = useState<IItem[]>([]);
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchCategories() {
        try {
            showLoading();
            const {data} = await GetAllCategories();
            setCategories(data);
            setFilterdCategories(toIndexSignature(data));
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
                <PageTitle text="Product Category List" /> 
            </Header>
            <Main>
                <div className="w-full h-full flex flex-col gap-3">
                    <section className="flex justify-between gap-2 h-10">
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
                                setFilterdCategories(filterList);
                            }}
                        />
                        <Button
                            variant="outlined"
                            icon="square-plus" 
                            href="product-categories/add"
                        >
                            Add
                        </Button>
                    </section>
                    <Table
                        columns={[
                            {id: 1, text: "Id", key: "id", linkRoot: "product-categories/"},
                            {id: 2, text: "Category Name", key: "name"},
                            {id: 3, text: "Description", key: "description"}, 
                        ]}
                        dataSet={filterdCategories}
                    />
                </div>
            </Main>
        </section>
    )
}