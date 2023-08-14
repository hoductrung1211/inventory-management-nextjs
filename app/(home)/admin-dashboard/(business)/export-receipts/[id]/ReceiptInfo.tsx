'use client';

import { getCustomerById } from "@/api/customer";
import { getEmployeeById } from "@/api/employee";
import { deleteExportReceipt, getExportReceipt } from "@/api/exportReceipt";
import { getWarehouseById } from "@/api/warehouse";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Popup from "@/components/Popup";
import datetimeFormat from "@/utils/functions/datetimeFormat";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import usePopup from "@/utils/hooks/usePopup";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface IReceiptData {
    orderId: number,
    warehouse: string,
    employee: string,
    customer: string,
    dateTime: Date,
}

export default function ReceiptInfo({
    receiptId
}: {
    receiptId: number
}) {
    const router = useRouter();
    const [showLoading, hideLoading] = useLoadingAnimation();
    const notify = useNotification();
    const popup = usePopup();

    const [receipt, setReceipt] = useState<IReceiptData>();

    const fields = [
        {title: "Order ID", content: receipt?.orderId},
        {title: "Warehouse", content: receipt?.warehouse},
        {title: "Employee", content: receipt?.employee},
        {title: "Customer", content: receipt?.customer},
        {title: "DateTime", content: datetimeFormat(receipt?.dateTime ?? new Date())},
    ]

    useEffect(() => {
        fetchReceipt();
    }, []);

    const fetchReceipt = async () => {
        showLoading();
        try {
            const {data} = await getExportReceipt(receiptId);
            const {data: employee} = await getEmployeeById(data.employeeId);
            const {data: warehouse} = await getWarehouseById(data.warehouseId);
            const {data: customer} = await getCustomerById(data.customerId);

            setReceipt({
                orderId: data.orderId,
                employee: employee.lastName + " " + employee.firstName,
                dateTime: data.dateTime,
                warehouse: warehouse.name,
                customer: customer.name,
            });
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    function handleDeleteReceipt() {
        showLoading();
     
        deleteExportReceipt(receiptId)
        .then(res => {
            router.push("./")
            notify("Delete Export Receipt successfully!", "success");
        })
        .catch (error => {
            console.log(error);
            notify("Delete Export Receipt failed!", "error");
        }) 
        .finally(() => {
            hideLoading();
        });
    }

    const deletePopup = 
        <Popup text="This Export Receipt will be deleted, you're sure?">
            <Button 
                variant="contained"
                onClick={() => {
                    popup.hide();
                    handleDeleteReceipt();
                }}
            >
                Delete
            </Button>
            <Button   
                onClick={() => {popup.hide()}}
            >Cancel</Button>
        </Popup>

    return (
        <section className="flex flex-col p-3 gap-5 w-1/2 border shadow-sm">
            <div className="flex items-center gap-3">
                <div className="w-12 aspect-square grid place-items-center rounded-full text-gray-700 bg-slate-200"><Icon name="receipt" size="xl" /></div>
                <h3 className="font-semibold">
                    Receipt #{receiptId}
                </h3>
            </div>
            
            <main className="flex flex-col gap-5 bg-gray-50 p-5 rounded-md">
            {fields.map(field => (
                <div className="flex justify-between border-b border-dashed">
                    {field.title}
                    <span className="font-semibold">{field.content}</span>
                </div>
            ))}
            </main>

            <div className="flex flex-col h-full p-3 bg-gray-100 rounded-md">
                <h3 className=" flex items-center gap-3 p-3 font-semibold">
                     <Icon name="gamepad" size="xl" /> Control Manager
                </h3>
                <div className="h-full flex flex-col ">
                    <div className="h-12 px-3 py-1 grid grid-cols-3 items-center gap-2 bg-gray-50 border-b font-semibold">
                        <span className="justify-self-start">Delete This Receipt</span>  
                        <div></div>
                        <button 
                            className={"justify-self-center flex gap-2 items-center w-fit px-3 py-2 rounded-md border  transition text-blue-500 bg-gray-100 hover:bg-blue-100"}
                            onClick={() => popup.show(deletePopup)}
                        >
                            Delete
                            <Icon name="trash" size="xl" /> 
                        </button>
                    </div> 
                </div>
            </div>
        </section>
    )
}