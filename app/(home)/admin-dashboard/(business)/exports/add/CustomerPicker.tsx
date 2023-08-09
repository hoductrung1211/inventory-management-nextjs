'use client';

import { ICustomerResponse, getAllCustomers } from "@/api/customer";
import Icon from "@/components/Icon"
import SearchInput from "@/components/SearchInput"
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import { ChangeEvent, useEffect, useState } from "react";

export default function CustomerPicker({
    customerId,
    setCustomerId
}: {
    customerId: number,
    setCustomerId: (newId: number) => void
}) {
    const [showLoading, hideLoading] = useLoadingAnimation();

    const [customers, setCustomers] = useState<ICustomerResponse[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const [filteredCustomers, setFiltedCustomers] = useState<ICustomerResponse[]>([]);
    const customer = customers.find(c => c.id === customerId);
    useEffect(() => {
        fetchAllCustomers();
    }, []);

    const fetchAllCustomers =async () => {
        showLoading();
        try {
            const {data} = await getAllCustomers();
            setCustomers(data);
            setFiltedCustomers(data);

            if (data[0]) setCustomerId(data[0].id);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    function handleFilterCustomers(e: ChangeEvent<HTMLInputElement>) {
        const newValue = e.target.value;
        setSearchValue(newValue);

        setFiltedCustomers(customers.filter(cus => {
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
                Pick customer
            </h3>
            <section className=" flex flex-col h-full gap-3 ">
                <section className="flex justify-between gap-2">
                    <SearchInput
                        handleChange={handleFilterCustomers}
                        placeholder="Type Customer's ID or Number"
                        value={searchValue}
                    />
                    <div className="w-48 flex px-3 gap-3 items-center  font-semibold border rounded-md">
                        <Icon name="caret-right" size="xl" />
                        {customer && ( customer.id + " - " + customer.name)}
                    </div>
                    
                </section>
                <TableCustomer
                    dataset={filteredCustomers}
                    onClick={(id: number) => setCustomerId(id)}
                />
            </section>
        </main>
    )
}

function TableCustomer({
    dataset,
    onClick,
}: {
    dataset: ICustomerResponse[],
    onClick: (id: number) => void,
}) {
    return (
        <section className=" flex flex-col h-full"> 
            <header className="grid grid-cols-7 items-center py-1 px-2 h-11 border-b text-center font-semibold bg-gray-50 rounded-t-md">
                <div className="col-span-1">ID</div>
                <div className="col-span-4">Customer</div>
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