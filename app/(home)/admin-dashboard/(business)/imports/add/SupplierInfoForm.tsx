'use client';

import Icon from "@/components/Icon"; 
import { ChangeEvent, HTMLInputTypeAttribute } from "react";
import { IInput } from "./page";
 

export default function SupplierInfoForm({
    inputs,
    onChange
}: {
    inputs: IInput[],
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
}) {
    
    return (
        <main className="flex flex-col gap-8">
            <h3 className="font-semibold text-center text-lg">
                Create Supplier Information
            </h3>
            <form className="mx-auto pt-6 pb-10 w-[480px] flex flex-col items-center gap-6 bg-gray-50 rounded-lg">
            {inputs.map(input => (
                <Input 
                    key={input.name}
                    label={input.label}
                    name={input.name}
                    required={input.required}
                    type={input.type}
                    value={input.value}
                    onChange={onChange}
                />
            ))}
            </form>
        </main>
    )
}

function Input({
    label,
    name,
    required = false,
    value,
    type = "text",
    onChange
}: {
    label: string,
    name: string,
    required?: boolean,
    value?: string,
    type?: HTMLInputTypeAttribute,
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}) {
    return (
        <label className="w-80 flex flex-col gap-1 font-semibold">
            <p className="flex items-center gap-1">{label} <span className="text-red-400">{required && <Icon name="asterisk" size="xs" />}</span></p>
            <input
                className="h-9 px-3 font-normal border rounded-xl"
                name={name}
                type={type}
                onChange={onChange}
                value={value}
            />
        </label>
    )
} 