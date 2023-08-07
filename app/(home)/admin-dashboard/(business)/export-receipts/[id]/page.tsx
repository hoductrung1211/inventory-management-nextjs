'use client';
import { getWarehouseById } from "@/api/warehouse";
import BackwardButton from "@/components/BackwardButton";
import Title from "@/components/DashboardTitle";
import Header from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import { useEffect, useState } from "react"; 
import { getAllProducts } from "@/api/product";
import { IReceipt } from "../page";
import { getEmployeeById } from "@/api/employee";
import datetimeFormat from "@/utils/functions/datetimeFormat";
import { getImportReceiptDetail } from "@/api/importReceiptDetail";
import { getExportReceipt } from "@/api/exportReceipt";
import { getExportReceiptDetail } from "@/api/exportReceiptDetail";
import TableDetailView from "./TableDetailView";
import ReceiptInfo from "./ReceiptInfo";
 
export default function Page({
    params
}: {
    params: {id: string}
}) {
    const [showLoading, hideLoading] = useLoadingAnimation();
    const receiptId = Number.parseInt(params.id); 
     
  
    return (
        <section className="w-full flex flex-col">
            <Header>
                <div className="flex gap-4">
                    <BackwardButton />
                </div>
            </Header>
            <Main>
                <div className="w-full h-full flex gap-3">
                    <ReceiptInfo receiptId={receiptId} />
                    <TableDetailView orderId={receiptId} />
                </div>
            </Main>
        </section>
    )
} 