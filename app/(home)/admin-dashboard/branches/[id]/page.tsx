'use client';
import { deleteBranch, getBranchById } from "@/api/branch";
import { IWarehouseResponse, getAllWarehouses } from "@/api/warehouse";
import BackwardButton from "@/components/BackwardButton";
import Button from "@/components/Button";
import ControlContainer, { ControlItem } from "@/components/ControlContainer";
import InfoContainer, { InfoItem } from "@/components/InfoContainer";
import PageTitle from "@/components/PageTitle";
import Popup from "@/components/Popup";
import Title from "@/components/Title";
import Header from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import Table from "@/layouts/Table";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import usePopup from "@/utils/hooks/usePopup";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page({
    params
}: {
    params: {id: string}
}) {  
    const branchId = Number.parseInt(params.id);

    return (
        <section className="w-full flex flex-col">
            <Header>
                <div className="flex items-center gap-4">
                    <BackwardButton /> 
                    <PageTitle text="Branch Details" />
                </div>
            </Header>
            <Main>
                <div className="w-full h-full flex gap-3">
                    <InfoSection branchId={branchId} />
                    <WarehousesSection branchId={branchId} />
                </div>
            </Main>
        </section>
    )
}

function InfoSection({
    branchId
}: {
    branchId: number
}) { 
    const notify = useNotification();
    const [showLoading, hideLoading] = useLoadingAnimation();
    const router = useRouter();
    const popup = usePopup();
    const [infoList, setInfoList] = useState<{title: string, content: string}[]>([]);
    
    useEffect(() => {
        fetchBranch();
    }, []);

    async function fetchBranch() {
        try {
            showLoading();
            const {data} = await getBranchById(branchId);

            setInfoList([
                {title: "ID", content: data.id.toString()},
                {title: "Name", content: data.name},
                {title: "Address", content: data.address},
            ])
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
                variant="contained"
                onClick={() => {
                    popup.hide();
                    deleteThisBranch();
                }}
            >
                Delete
            </Button>
            <Button   
                onClick={() => {popup.hide()}}
            >Cancel</Button>
        </Popup>;
    return (
        <section className="w-1/2 p-3 flex flex-col gap-5  border ">
            <Title icon="building">Branch</Title>
            
            <InfoContainer>
            {infoList.map(info => (
                <InfoItem info={info} />
            ))}                            
            </InfoContainer>
            
            <ControlContainer>
                <ControlItem text="Edit Information">
                    <div className="w-full flex py-1 px-2 justify-end">
                        <Button
                            variant="outlined"
                            icon="arrow-right"
                            href={`${branchId}/edit`}
                        >Go</Button>
                    </div>
                </ControlItem>
                <ControlItem text="Delete">
                    <div className="w-full flex py-1 px-2 justify-end">
                        <Button
                            variant="outlined"
                            icon="trash"
                            onClick={() => {
                                popup.show(deleteBranchPopup);
                            }}
                        >Delete</Button>
                    </div>
                </ControlItem>
            </ControlContainer>
        </section>
    )
}

function WarehousesSection({
    branchId
}: {
    branchId: number
}) {
    const [warehouses, setWarehouses] = useState<IWarehouseResponse[]>([]);
    
    useEffect(() => {
        fetchWarehoses();
    }, []);

    const fetchWarehoses =  async () => {
        try {
            const {data} = await getAllWarehouses(branchId);
            setWarehouses(data);
        }
        catch (error) {
            console.log(error);
        }
    }


    return (
        <section className="w-3/5 p-3 h-full flex flex-col border rounded-r-sm gap-6">
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