'use client';

import BackwardButton from "@/components/BackwardButton";
import Header from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import { useRouter } from "next/navigation";
import TableDetailView from "./TableDetailView";
import OrderInfo from "./OrderInfo";
import { useState } from "react";
import TableTrackingView from "./TableTrackingView";
import TableReceiptView from "./TableReceiptView";

export enum ViewMode {
    Items,
    Trackings,
    Receipt,
}

export default function Page({
    params
}: {
    params: {id: string}
}) {
    const router = useRouter();

    const orderId = Number.parseInt(params.id);
    const [mode, setMode] = useState(ViewMode.Items);

    const [isUpdated, setIsUpdated] = useState(false);

    function handleRefreshInfo() {
        setIsUpdated(!isUpdated);
    }

    return (
        <section className="w-full flex flex-col">
            <Header>
                <div className="flex items-center gap-4">
                    <BackwardButton /> 
                    <h1 className="font-semibold">Import Order Details</h1>
                </div>
            </Header>
            <Main>
                <div className="w-full h-full flex gap-3">
                    <OrderInfo 
                        key={isUpdated + "info"}
                        orderId={orderId}
                        mode={mode}
                        setMode={setMode}
                        handleRefreshInfo={handleRefreshInfo}
                    />
                    {
                        mode == ViewMode.Trackings 
                        ? 
                            <TableTrackingView
                                key={isUpdated + "TrackingView"}
                                orderId={orderId}
                            />
                        :
                        mode == ViewMode.Receipt 
                        ?
                            <TableReceiptView
                                orderId={orderId}
                                handleRefreshInfo={handleRefreshInfo}
                                backToViewMode={() => setMode(ViewMode.Items)}
                            />
                            :
                            <TableDetailView   
                                orderId={orderId}
                            />
                    }
                </div>
            </Main>
        </section>
    )
}

