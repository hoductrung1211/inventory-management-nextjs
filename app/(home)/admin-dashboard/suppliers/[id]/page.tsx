'use client';
import { deleteSupplier, getSupplierById, getSupplierReceipts } from "@/api/supplier";
import { getAllWarehouses } from "@/api/warehouse";
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
import datetimeFormat from "@/utils/functions/datetimeFormat";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import usePopup from "@/utils/hooks/usePopup";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export interface ISupplier {
    id: number,
    name: string,
    phoneNumber: string,
    email: string,
    address: string,
    detailDescription: string,
}

export default function Page({
    params
}: {
    params: {id: string}
}) { 
    const supplierId = Number.parseInt(params.id);

    return (
        <section className="w-full flex flex-col">
            <Header>
                <div className="flex items-center gap-4">
                    <BackwardButton />
                    <PageTitle text="Supplier Details" />
                </div>
            </Header>
            <Main>
                <div className="w-full h-full flex gap-3">
                    <InfoSection supplierId={supplierId} />
                    <ReceiptsSection supplierId={supplierId} />
                </div>
            </Main>
        </section>
    )
}

function InfoSection({
    supplierId 
}: {
    supplierId: number
}) {
    const notify = useNotification();
    const [showLoading, hideLoading] = useLoadingAnimation();
    const router = useRouter();
    const popup = usePopup();
    const [infoList, setInfoList] = useState<{title: string, content: string}[]>([]);
    
    useEffect(() => {
        fetchSupplier();
    }, []);

    async function fetchSupplier() {
        try {
            showLoading();
            const {data} = await getSupplierById(supplierId); 

            setInfoList([
                {title: "ID", content: data.id.toString()},
                {title: "Name", content: data.name},
                {title: "Phone number", content: data.phoneNumber},
                {title: "Email", content: data.email},
                {title: "Address", content: data.address ?? ""},
                {title: "Detail description", content: data.detailDescription ?? ""},
            ]);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    } 

    async function deleteThisSupplier() {
        try {
            showLoading();
            await deleteSupplier(supplierId);
            router.push("./");
            notify("Delete supplier successfully!", "success");
        }
        catch (error) {
            console.log(error);
            notify("Delete supplier failed!", "error");
        }
        finally {
            hideLoading();
        }
    }

    const deleteSupplierPopup = 
        <Popup text="This supplier will be deleted, you're sure?">
            <Button 
                variant="contained"
                onClick={() => {
                    popup.hide();
                    deleteThisSupplier();
                }}
            >
                Delete
            </Button>
            <Button   
                onClick={() => {popup.hide()}}
            >Cancel</Button>
        </Popup>

    return (
        <section className="w-1/2 p-3 flex flex-col gap-5  border ">
            <Title icon="handshake-angle">Supplier</Title>
            
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
                            href={`${supplierId}/edit`}
                        >Go</Button>
                    </div>
                </ControlItem>
                <ControlItem text="Delete">
                    <div className="w-full flex py-1 px-2 justify-end">
                        <Button
                            variant="outlined"
                            icon="trash"
                            onClick={() => {
                                popup.show(deleteSupplierPopup);
                            }}
                        >Delete</Button>
                    </div>
                </ControlItem>
            </ControlContainer>
        </section>
    )
}

interface IReceipt {
    id: number,
    warehouse: string,
    dateTime: string,
}

function ReceiptsSection({
    supplierId 
}: {
    supplierId: number
}) {
    const [receipts, setReceipts] = useState<IReceipt[]>([]);    

    useEffect(() => {
        fetchReceipts();
    }, []);

    const fetchReceipts =  async () => {
        try {
            const {data} = await getSupplierReceipts(supplierId);
            const {data: warehouses} = await getAllWarehouses();

            setReceipts(data.map(item => {
                const warehouse = warehouses.find(whs => whs.id == item.warehouseId);

                return {
                    id: item.id,
                    dateTime: datetimeFormat(item.dateTime),
                    warehouse: warehouse?.name + "",
                }
            }));
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <section className="w-3/5 p-3 h-full flex flex-col border rounded-r-sm gap-6">
            <Table
                columns={[
                    {id: 1, text: "Import Receipt ID", key: "id", linkRoot: "../import-receipts/"},
                    {id: 2, text: "Warehouse", key: "warehouse"},
                    {id: 4, text: "DateTime", key: "dateTime"},
                ]}
                dataSet={receipts}
            />
        </section>
    )
}
