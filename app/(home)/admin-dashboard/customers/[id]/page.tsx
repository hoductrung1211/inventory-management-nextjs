'use client';
import { deleteCustomer, getCustomerById, getCustomerReceipts } from "@/api/customer";
import { IExportReceiptResponse } from "@/api/exportReceipt";
import { getAllWarehouses, getWarehouseById } from "@/api/warehouse";
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

export interface ICustomer {
    id: number,
    name: string,
    phoneNumber: string,
    email: string,
    address: string,
}

export default function Page({
    params
}: {
    params: {id: string}
}) {
    
    const customerId = Number.parseInt(params.id);

    return (
        <section className="w-full flex flex-col">
            <Header>
                <div className="flex items-center gap-4">
                    <BackwardButton />
                    <PageTitle text="Customer Details" />
                </div>
            </Header>
            <Main>
                <div className="w-full h-full flex gap-3">
                    <InfoSection customerId={customerId} />
                    <ReceiptsSection customerId={customerId} />
                </div>
            </Main>
        </section>
    )
}

function InfoSection({
    customerId
}: {
    customerId: number
}) {
    const notify = useNotification();
    const [showLoading, hideLoading] = useLoadingAnimation();
    const router = useRouter();
    const popup = usePopup();
    const [infoList, setInfoList] = useState<{title: string, content: string}[]>([]);
    
    useEffect(() => {
        fetchCustomer();
    }, []);
  
    useEffect(() => {
        fetchCustomer();
    }, []);

    async function fetchCustomer() {
        try {
            showLoading();
            const {data} = await getCustomerById(customerId);
             
            setInfoList([
                {title: "ID", content: data.id.toString()},
                {title: "Name", content: data.name},
                {title: "Address", content: data.address},
                {title: "Phone number", content: data.phoneNumber},
                {title: "Email", content: data.email},
            ])
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    async function deleteThisCustomer() {
        try {
            showLoading();
            await deleteCustomer(customerId);
            router.push("./");
            notify("Delete customer successfully!", "success");
        }
        catch (error) {
            console.log(error);
            notify("Delete customer failed!", "error");
        }
        finally {
            hideLoading();
        }
    }

    const deleteCustomerPopup = 
        <Popup text="This customer will be deleted, you're sure?">
             <Button 
                variant="contained"
                onClick={() => {
                    popup.hide();
                    deleteThisCustomer();
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
            <Title icon="cart-shopping">Customer</Title>
            
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
                            href={`${customerId}/edit`}
                        >Go</Button>
                    </div>
                </ControlItem>
                <ControlItem text="Delete">
                    <div className="w-full flex py-1 px-2 justify-end">
                        <Button
                            variant="outlined"
                            icon="trash"
                            onClick={() => {
                                popup.show(deleteCustomerPopup);
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
    customerId 
}: {
    customerId: number
}) {
    const [receipts, setReceipts] = useState<IReceipt[]>([]);    

    useEffect(() => {
        fetchReceipts();
    }, []);

    const fetchReceipts =  async () => {
        try {
            const {data} = await getCustomerReceipts(customerId);
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
                    {id: 1, text: "Export Receipt ID", key: "id", linkRoot: "../export-receipts/"},
                    {id: 2, text: "Warehouse", key: "warehouse"},
                    {id: 4, text: "DateTime", key: "dateTime"},
                ]}
                dataSet={receipts}
            />
        </section>
    )
}