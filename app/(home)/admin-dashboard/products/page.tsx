'use client';
import {  GetAllCategories } from "@/api/category";
import { getAllProducts } from "@/api/product";
import Button from "@/components/Button";
import PageTitle from "@/components/PageTitle";
import SearchInput from "@/components/SearchInput";
import Header  from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import Table from "@/layouts/Table";
import filterByFields, { IItem, toIndexSignature } from "@/utils/functions/filterByFields";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export interface IProductData {
    catName: string; 
    id: number; 
    name: string; 
    sku: string; 
    categoryId: number; 
    dimensions: string; 
    weight: string; 
    tempPrice: number; 
    imageUrl: string;
}

export default function Page() {
    const router = useRouter();
    const [showLoading, hideLoading] = useLoadingAnimation();
    const [products, setProducts] = useState<IProductData[]>([]);
    const [filterProducts, setFilterProducts] = useState<IItem[]>([]);
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        try {
            showLoading();  
            const {data: prodData} = await getAllProducts();
            const {data: catData} = await GetAllCategories();
            
            const newProducts : IProductData[] = prodData.map((prod) => {
                const cat = catData.find(cat => cat.id == prod.categoryId);
                return ({
                    ...prod,
                    catName: cat?.name ?? "",
                });
            });
            setFilterProducts(toIndexSignature(newProducts));
            setProducts(newProducts);
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
                <PageTitle text="Product List" /> 
            </Header>
            <Main>
                <div className="w-full h-full flex flex-col gap-3">
                    <section className="flex justify-between gap-2 h-10">
                        <SearchInput
                            placeholder="Type product ID here..."
                            handleChange={(e) => {
                                const newSearchValue = e.target.value;
                                setSearchValue(newSearchValue);
                                const filterList = filterByFields(
                                        toIndexSignature(products), 
                                        newSearchValue.trim(), 
                                        ["id", "sku"]
                                    );
                                setFilterProducts(filterList);
                            }}
                            value={searchValue}
                        />
                        <Button
                            variant="outlined"
                            icon="square-plus" 
                            href="products/add"
                        >
                            Add
                        </Button>
                    </section>
                    <Table
                        columns={[
                            {id: 1, text: "Id", key: "id", linkRoot: "products/"},
                            {id: 2, text: "Product Name", key: "name"},
                            {id: 3, text: "SKU", key: "sku"}, 
                            {id: 4, text: "Category Name", key: "catName"}, 
                            {id: 5, text: "Dimensions", key: "dimensions"}, 
                            {id: 6, text: "Weight", key: "weight"}, 
                            {id: 7, text: "tempPrice", key: "tempPrice"}, 
                        ]}
                        dataSet={filterProducts}
                    />
                </div>
            </Main>
        </section>
    )
}