'use client';
import { IImportOrderDetailResponse, updateImportOrderDetail } from '@/api/importOrderDetail';
import './edit-product.css'; 
import { ChangeEvent, useState } from 'react';
import { IProductResponse } from '@/api/product';
import { IDropdownData } from '@/components/DropDown';
import { Color } from '@/utils/constants/colors';
import { Button } from '@/layouts/DashboardHeader';
import useNotification from '@/utils/hooks/useNotification';
import useLoadingAnimation from '@/utils/hooks/useLoadingAnimation';

export interface IOrderDetail {
    [key: string]: string | number,
    productId: number,
    productName: string,
    quantity: number,
    price: number
}

export default function EditControlSection({
    detail,
    // dropdown,
    handleCancelEdit,
    handleUpdate,
    productName
}: {
    detail: IImportOrderDetailResponse,
    // dropdown: {text: string, value: number}[],
    handleCancelEdit: () => void,
    handleUpdate: (newQuantity: number, newPrice: number) => void,
    productName: string,
}) { 
    const [showLoading, hideLoading] = useLoadingAnimation();

    const [editedDetail, setEditedDetail] = useState<IImportOrderDetailResponse>(detail);
    const notify = useNotification();

    console.log(editedDetail);

    const checkConstraints = () => {
        if (Number.isNaN(editedDetail.price) || editedDetail.price < 0 ) {
            notify("Price field is invalid!", "error");
            return false;
        }
        if (Number.isNaN(editedDetail.quantity) || editedDetail.quantity < 0 ) {
            notify("Quantity field is invalid!", "error");
            return false;
        }
        return true;
    }

    return (
        <>
            <div className='h-10 pl-2 border-2 rounded-md grid place-items-center'>
                {productName}
            </div>
            <input 
                className="w-full h-10 pl-2 outline-none border-2 rounded-md"
                type="number"
                min="1"
                max="1000000"
                placeholder="Quantity"
                value={editedDetail.quantity}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setEditedDetail({
                        ...editedDetail,
                        quantity: Number.parseInt(e.target.value) 
                    })
                }}
            />
            <input 
                className="w-full h-10 pl-2 outline-none border-2 rounded-md"
                type="number"
                min="1"
                placeholder="Price"
                value={editedDetail.price}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setEditedDetail({
                        ...editedDetail,
                        price: Number.parseInt(e.target.value)
                    })
                }}
            />
            <div className='h-10 pl-2 border-2 rounded-md grid place-items-center'>
                {(editedDetail.price * editedDetail.quantity) ? 
                    (editedDetail.price * editedDetail.quantity).toLocaleString() :
                    0
                }
            </div>
            <div className='flex justify-center items-center gap-2'>
                <Button
                    bgColor={Color.GREEN}
                    color={Color.WHITE}
                    text="Update"
                    actionHandler={async () => {
                        const check = checkConstraints();
                        if (!check)
                            return;

                        const orderId = editedDetail.orderId;
                        const productId = editedDetail.productId;
                        const data = {
                            quantity: editedDetail.quantity,
                            price: editedDetail.price,
                        };
                        showLoading();
                        try {
                            await updateImportOrderDetail(orderId, productId, data);
                            notify("Update successfully", "success");
                            handleUpdate(data.quantity, data.price);
                        }
                        catch (error) {
                            console.log(error);
                            notify("Update failed! Please try again!", "error");
                        }
                        finally {
                            hideLoading();
                        }
                    }}
                />
                <Button
                    bgColor={Color.WHITE}
                    color={Color.BLACK}
                    text="Cancel"
                    actionHandler={handleCancelEdit}
                />
            </div>
        </>
    )
}