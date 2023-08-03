'use client';

import { createImportOrderDetail } from "@/api/importOrderDetail";
import { Button } from "@/layouts/DashboardHeader";
import { Color } from "@/utils/constants/colors";
import useNotification from "@/utils/hooks/useNotification";
import { ChangeEvent, useEffect, useState } from "react";

export default function AddControlSection({
    dropdown,
    handleAddDetail
}: {
    dropdown: {text: string, value: number}[],
    handleAddDetail: (productId: number, quantity: number, price: number) => void
}) { 
    const notify = useNotification();
    
    const [productId, setProductId] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState(0);

    useEffect(() => {
        setProductId(dropdown[0]?.value ?? 0);
    }, [dropdown]);

    function handleClick() {
        if (!checkConstraints())
            return;
        handleAddDetail(productId, quantity, price);
        setPrice(0);
        setQuantity(0);
    }

    function checkConstraints() {
        if (quantity < 1) {
            notify("Cannot add detail with quantity equals 0", "danger");
            return false;
        }
        if (price < 1) {
            notify("Cannot add detail with price equals 0", "danger");
            return false;
        }
        return true;
    }

    return (
        <>
            <select 
                className="w-full h-10 pl-2 outline-none border-2 rounded-md"
                value={productId}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    const newProdId = Number.parseInt(e.target.value)
                    const isNaN = Number.isNaN(newProdId);
                    if (isNaN) return;
                    setProductId(newProdId);
                }}
            >
            {
                dropdown.map(prod => 
                    <option key={prod.value} value={prod.value}>{prod.text}</option>    
                )
            }
            </select>
            <input 
                className="w-full h-10 pl-2 outline-none border-2 rounded-md"
                type="number"
                min="1"
                max="1000000"
                placeholder="Quantity"
                value={quantity}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setQuantity(Number.parseInt(e.target.value))
                }}
            />
            <input 
                className="w-full h-10 pl-2 outline-none border-2 rounded-md"
                type="number"
                min="1"
                placeholder="Price"
                value={price}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setPrice(Number.parseInt(e.target.value))
                }}
            />
            <div className='h-10 pl-2 border-2 rounded-md grid place-items-center'>
                {(price * quantity) ? (price * quantity).toLocaleString() : 0}
            </div>
            <div className='flex justify-center items-center gap-2'>
                <Button
                    bgColor={Color.BLUE}
                    color={Color.WHITE}
                    text="Add"
                    actionHandler={handleClick}
                />
            </div>
        </>
    )
}