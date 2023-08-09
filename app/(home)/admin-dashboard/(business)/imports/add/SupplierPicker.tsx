'use client';

import { ISupplierResponse, getAllSuppliers } from "@/api/supplier";
import Icon from "@/components/Icon"
import SearchInput from "@/components/SearchInput"
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import { ChangeEvent, useEffect, useState } from "react";

export default function SupplierPicker({
    supplierId,
    setSupplierId,
}: {
    supplierId: number,
    setSupplierId: (newId: number) => void
}) {
    const [showLoading, hideLoading] = useLoadingAnimation();

    const [supplier, setSuppliers] = useState<ISupplierResponse[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const [filteredSuppliers, setFiltedSuppliers] = useState<ISupplierResponse[]>([]);
    const customer = supplier.find(c => c.id === supplierId);
    useEffect(() => {
        fetchAllSuppliers();
    }, []);

    const fetchAllSuppliers = async () => {
        showLoading();
        try {
            const {data} = await getAllSuppliers();
            setSuppliers(data);
            setFiltedSuppliers(data);

            if (data[0]) setSupplierId(data[0].id);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    function handleFilterSuppliers(e: ChangeEvent<HTMLInputElement>) {
        const newValue = e.target.value;
        setSearchValue(newValue);

        setFiltedSuppliers(supplier.filter(cus => {
            const filterVal = searchValue.toLocaleLowerCase();
            const nameCheck = cus.name.toLowerCase().includes(filterVal);
            const idCheck = cus.id.toString().includes(filterVal);
            const phoneCheck = cus.phoneNumber.includes(filterVal);

            return nameCheck || idCheck || phoneCheck;
        }));
    }

    return (
        <main className="flex flex-col gap-8 ">
            <h3 className="font-semibold text-center text-lg">
                Pick supplier
            </h3>
            <section className=" flex flex-col h-full gap-3 ">
                <section className="flex justify-between gap-2">
                    <SearchInput
                        handleChange={handleFilterSuppliers}
                        placeholder="Type Customer's ID or Number"
                        value={searchValue}
                    />
                    <div className="flex px-3 gap-3 items-center  font-semibold border rounded-md">
                        <Icon name="caret-right" size="xl" />
                        {customer && ( customer.id + " - " + customer.name)}
                    </div>
                    
                </section>
                <TableSupplier
                    dataset={filteredSuppliers}
                    onClick={(id: number) => setSupplierId(id)}
                />
            </section>
        </main>
    )
}

function TableSupplier({
    dataset,
    onClick,
}: {
    dataset: ISupplierResponse[],
    onClick: (id: number) => void,
}) {
    return (
        <section className=" flex flex-col h-full"> 
            <header className="grid grid-cols-7 items-center py-1 px-2 h-11 border-b text-center font-semibold bg-gray-50 rounded-t-md">
                <div className="col-span-1">ID</div>
                <div className="col-span-4">Supplier</div>
                <div className="col-span-2">Phone</div>
            </header>
            <main className="h-[430px] overflow-auto">
            {
                dataset.map(customer => (
                    <div 
                        key={customer.id} 
                        className="grid grid-cols-7 items-center text-center  py-1 px-2 h-11 border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => onClick(customer.id)}
                    >
                        <div className="col-span-1">{customer.id}</div>
                        <div className="col-span-4 ">{customer.name}</div>
                        <div className="col-span-2">{customer.phoneNumber}</div>
                    </div>
                ))
            }
            </main>
        </section>
    )
}