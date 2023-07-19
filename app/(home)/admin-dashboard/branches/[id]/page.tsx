'use client';
import { IBranchResponse, deleteBranch, getBranchById } from "@/api/branch";
import { IWarehouseResponse, getAllWarehouses, getWarehouseById } from "@/api/warehouse";
import BackwardButton from "@/components/BackwardButton";
import Title from "@/components/DashboardTitle";
import InfoBar from "@/components/InfoBar";
import Popup from "@/components/Popup";
import Header, { Button } from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import Table from "@/layouts/Table";
import { Color } from "@/utils/constants/colors";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import usePopup from "@/utils/hooks/usePopup";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page({
    params
}: {
    params: {id: string}
}) {
    const [showLoading, hideLoading] = useLoadingAnimation();
    const [branch, setBranch] = useState<IBranchResponse>({
        id: 1,
        name: "",
        address: ""
    });
    const [warehouses, setWarehouses] = useState<IWarehouseResponse[]>([]);
    const branchId = Number.parseInt(params.id);
    const router = useRouter();
    const popup = usePopup();
    const notify = useNotification();

    useEffect(() => {
        fetchBranch();
    }, []);

    async function fetchBranch() {
        try {
            showLoading();
            const {data} = await getBranchById(branchId);
            setBranch(data);
            const warehouseRes = await getAllWarehouses(data?.id);
            setWarehouses(warehouseRes.data);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    async function deleteThisBranch() {
        try {
            showLoading();
            await deleteBranch(branchId);
            router.push("./")
            notify("Delete branch successfully!", "success");
        }
        catch (error) {
            console.log(error);
            notify("Delete branch failed!", "error");
        }
        finally {
            hideLoading();
        }
    }

    const deleteBranchPopup = 
        <Popup text="This branch will be deleted, you're sure?">
            <Button
                text="Delete"
                color={Color.WHITE}
                bgColor={Color.RED} 
                actionHandler={() => {
                    popup.hide();
                    deleteThisBranch();
                }}
            />
            <Button
                text="Cancel"
                color={Color.BLACK}
                bgColor={Color.WHITE} 
                actionHandler={() => {popup.hide()}}
            />
        </Popup>;

    return (
        <section className="w-full flex flex-col">
            <Header>
                <div className="flex gap-4">
                    <BackwardButton />
                    <Button
                        text="Edit"
                        color={Color.WHITE}
                        bgColor={Color.ORANGE} 
                        actionHandler={() => router.push(`${branchId}/edit`)}
                    />
                    <Button
                        text="Delete"
                        color={Color.WHITE}
                        bgColor={Color.RED} 
                        actionHandler={() => {
                            popup.show(deleteBranchPopup);
                        }}
                    />
                </div>
            </Header>
            <Main>
                <div className="w-full h-full flex gap-3">
                    <InfoSection branch={branch} />
                    <WarehousesSection warehouses={warehouses} />
                </div>
            </Main>
        </section>
    )
}

function InfoSection({
    branch
}: {
    branch: IBranchResponse
}) {
    const inforBars: {label: string, key: "id" | "name" | "address", icon: string}[] = [
        {label: "Id", key: "id", icon: "hashtag"},
        {label: "Name", key: "name", icon: "signature"},
        {label: "Address", key: "address", icon: "map-location-dot"},
    ];

    return (
        <section className="w-2/5 p-3 pt-6 h-full flex flex-col border-2 rounded-l-sm gap-6">
            <Title
                text="Detailed Information"
                icon="circle-info"
                color={Color.BLUE}
            />
            <div className="relative w-full h-44">
                <Image
                    className="object-contain"
                    src="/images/branch.jpg"
                    alt="Log in image"
                    fill
                /> 
            </div>
            <div className="flex flex-col gap-3"> 
                {inforBars.map(infoBar =>
                    <InfoBar
                        label={infoBar.label}
                        value={branch?.[infoBar.key] ?? ""}
                        icon={infoBar.icon}
                    />
                )}
            </div>
        </section>
    )
}

function WarehousesSection({
    warehouses
}: {
    warehouses: IWarehouseResponse[]
}) {
    return (
        <section className="w-3/5 p-3 pt-6 h-full flex flex-col border-2 rounded-r-sm gap-6">
            <Title text="Warehouses belong to this branch" icon="warehouse" color={Color.GREEN} />
            <Table
                columns={[
                    {id: 1, text: "Id", key: "id", linkRoot: "/admin-dashboard/warehouses/"},
                    {id: 2, text: "Warehouses Name", key: "name"},
                    {id: 3, text: "Address", key: "address"}, 
                ]}
                dataSet={warehouses}
            />
        </section>
    )
}