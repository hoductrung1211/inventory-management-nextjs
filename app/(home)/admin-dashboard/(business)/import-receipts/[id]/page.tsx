'use client';
import BackwardButton from "@/components/BackwardButton";
import Header from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import TableDetailView from "./TableDetailView";
import ReceiptInfo from "./ReceiptInfo";
 
export default function Page({
    params
}: {
    params: {id: string}
}) {
    const receiptId = Number.parseInt(params.id); 
  
    return (
        <section className="w-full flex flex-col">
            <Header>
                <div className="flex items-center gap-4">
                    <BackwardButton />
                    <h1 className="font-semibold">Import Receipt Details</h1>
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