'use client';

import BackwardButton from "@/components/BackwardButton";
import Header, { Button } from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import { Color } from "@/utils/constants/colors";
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
                <div className="flex gap-4">
                    <BackwardButton />
                    <Button
                        text="Edit Information"
                        color={Color.WHITE}
                        bgColor={Color.BLUE} 
                        actionHandler={() => {router.push(`${orderId}/edit`)}}
                    /> 
                    <Button
                        text="Edit Products"
                        color={Color.WHITE}
                        bgColor={Color.BLUE} 
                        actionHandler={() => {router.push(`${orderId}/edit-products`)}}
                    /> 
                </div>
            </Header>
            <Main>
                <div className="w-full h-full flex gap-3">
                    <OrderInfo 
                        key={isUpdated + ""}
                        orderId={orderId}
                        mode={mode}
                        setMode={setMode}
                        handleRefreshInfo={handleRefreshInfo}
                    />
                    {
                        mode == ViewMode.Trackings 
                        ? 
                            <TableTrackingView
                                orderId={orderId}
                            />
                        :
                        mode == ViewMode.Receipt 
                        ?
                            <TableReceiptView
                                orderId={orderId}
                                handleRefreshInfo={handleRefreshInfo}
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

