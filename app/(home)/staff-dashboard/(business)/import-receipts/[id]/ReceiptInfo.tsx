'use client';

import { getEmployeeById } from "@/api/employee";
import { getImportReceipt } from "@/api/importReceipt";
import { getSupplierById } from "@/api/supplier";
import { getWarehouseById } from "@/api/warehouse";
import Icon from "@/components/Icon";
import datetimeFormat from "@/utils/functions/datetimeFormat";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import { useEffect, useState } from "react";

interface IReceiptData {
    orderId: number,
    warehouse: string,
    employee: string,
    supplier: string,
    dateTime: Date,
}

export default function ReceiptInfo({
    receiptId
}: {
    receiptId: number
}) {
    const [showLoading, hideLoading] = useLoadingAnimation();
    const [receipt, setReceipt] = useState<IReceiptData>();

    const fields = [
        {title: "Order ID", content: receipt?.orderId},
        {title: "Warehouse", content: receipt?.warehouse},
        {title: "Employee", content: receipt?.employee},
        {title: "Supplier", content: receipt?.supplier},
        {title: "DateTime", content: datetimeFormat(receipt?.dateTime ?? new Date())},
    ]

    useEffect(() => {
        fetchReceipt();
    }, []);

    const fetchReceipt = async () => {
        showLoading();
        try {
            const {data} = await getImportReceipt(receiptId);
            const {data: employee} = await getEmployeeById(data.employeeId);
            const {data: warehouse} = await getWarehouseById(data.warehouseId);
            const {data: supplier} = await getSupplierById(data.supplierId);

            setReceipt({
                orderId: data.orderId,
                employee: employee.lastName + " " + employee.firstName,
                dateTime: data.dateTime,
                warehouse: warehouse.name,
                supplier: supplier.name,
            });
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

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
        </section>
    )
}