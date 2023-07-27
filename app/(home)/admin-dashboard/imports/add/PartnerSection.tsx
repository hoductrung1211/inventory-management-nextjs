'use client';

import { IPartnerResponse, getAllPartners } from "@/api/partner";
import EditText from "@/components/EditText";
import Icon from "@/components/Icon";
import Table from "@/layouts/Table";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import { ChangeEvent, useEffect, useState } from "react";

export default function PartnerSection({
    partnerMode,
    setPartnerMode,
    children
}: {
    partnerMode: boolean,
    setPartnerMode: (newMode: boolean) => void,
    children: React.ReactNode
}) {
    const activeBtn = " w-full bg-gray-200 border-2 border-slate-500";
    const btn = " w-full bg-gray-300  hover:bg-opacity-50 text-gray-500";

    function handleChangeMode() {
        setPartnerMode(!partnerMode);
    }

    return (
        <main className="flex flex-col h-full gap-5">
            <div className="flex-shrink-0 flex justify-center h-10  font-bold">
                <button 
                    className={ "rounded-l-md " + (partnerMode ? btn : activeBtn)}
                    onClick={handleChangeMode}
                >
                    Select Partner
                </button>
                <button 
                    className={"rounded-r-md " + (partnerMode ? activeBtn : btn)}
                    onClick={handleChangeMode}
                >
                    Create Information
                </button>
            </div>
            {children}
        </main>
    )
}

export function SelectPartner({
    partnerId,
    handleChangePartner
}: {
    partnerId?: number,
    handleChangePartner: (id: number) => void
}) {
    const [showLoading, hideLoading] = useLoadingAnimation();
    const [searchValue, setSearchValue] = useState("");
    const [partners, setPartners] = useState<IPartnerResponse[]>();
    const partner = partners?.find(p => p.id === partnerId);

    const filterdPartners = partners?.filter(p => {
        const check = 
            p.id.toString().toLowerCase().includes(searchValue.toLowerCase()) ||
            p.name.toLowerCase().includes(searchValue.toLowerCase());

        return check;
    })

    useEffect(() => {
        fetchPartners();
    }, []);

    async function fetchPartners() {
        try {
            showLoading();
            const {data} = await getAllPartners();
            setPartners(data);
            if (data?.[0] && partnerId == undefined) 
                handleChangePartner(data?.[0].id);
        }
        catch(error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    function handleClickParnter(id: number) {
        const newPartner = partners?.find(p => p.id === id);

        if (newPartner)
            handleChangePartner(newPartner.id);
    }
    

    return (
        <section className="flex flex-col gap-3 h-full px-3 py-5 rounded-md bg-gray-50 bg-opacity-70">
            <SearchInput
                value={searchValue}
                handleChange={(e) => {setSearchValue(e.target.value)}}
                placeholder="Type Partner ID here"
            />
            <div className="flex-shrink-0 grid grid-cols-3 place-items-center h-10 border-2 border-slate-500 font-bold bg-white">
                {
                    partner &&
                    <>
                        <div className="col-span-1">{partner.id}</div>
                        <div className="col-span-2">{partner.name}</div>
                    </>
                }
            </div>
            <section className="h-full bg-white">
                <Table
                    handleRowClick={handleClickParnter}
                    columns={[
                        {id: 1, text: "Id", key: "id"},
                        {id: 2, text: "Name", key: "name" },
                    ]}
                    dataSet={filterdPartners ?? []}
                />
            </section>
        </section>
    )
}

function SearchInput({
    placeholder,
    value,
    handleChange
}: {
    placeholder: string,
    value: string,
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void,
}) {
    return (
        <div className="flex-shrink-0 flex h-10 py-1 pl-2 border-2 rounded-md bg-white overflow-hidden">
            <input 
                className="w-full h-full" 
                type="text"
                placeholder={placeholder}
                value={value} 
                onChange={handleChange}
            />
            <button
                className="px-2"
                onClick={() => {}}
            >
                <Icon
                    name="magnifying-glass"
                    size="lg"
                />
            </button>
        </div>
    )
}

export interface Field {
    label: string, 
    value: string, 
    icon: string, 
    isRequired: boolean, 
    errorText: string, 
    type: string
}

export function CreatePartner({
    fields,
    setFields,
}: {
    fields: Field[],
    setFields: (newFields: Field[]) => void
}) {
    
    return (
        <section className="h-full px-3 py-5 rounded-md bg-gray-50 bg-opacity-70">
            <form className="flex flex-col gap-4">
                {fields.map((field, idx) => 
                    <EditText
                        icon={field.icon}
                        label={field.label}
                        value={field.value.toString()}
                        type={field.type}
                        handleChange={(e) => {
                            setFields([
                                ...fields.slice(0, idx),
                                {
                                    ...field,
                                    value: e.target.value,
                                },
                                ...fields.slice(idx + 1)
                            ]); 
                        }}
                        errorText={field.errorText}
                        key={field.label + field.errorText}
                    />
                )}
            </form>
        </section>
    )
}