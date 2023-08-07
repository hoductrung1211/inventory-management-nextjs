'use client';
import { deleteCustomer, getCustomerById } from "@/api/customer";
import { deleteSupplier, getSupplierById } from "@/api/supplier";
import BackwardButton from "@/components/BackwardButton";
import Title from "@/components/DashboardTitle";
import InfoBar from "@/components/InfoBar";
import Popup from "@/components/Popup";
import Header, { Button } from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import { Color } from "@/utils/constants/colors";
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
    const popup = usePopup();
    const notify = useNotification();
    const [showLoading, hideLoading] = useLoadingAnimation();
    const router = useRouter();

    const customerId = Number.parseInt(params.id);
    const [customer, setCustomer] = useState<ICustomer>();

    useEffect(() => {
        fetchCustomer();
    }, []);

    async function fetchCustomer() {
        try {
            showLoading();
            const {data} = await getCustomerById(customerId);
            setCustomer({
                id: data.id,
                name: data.name,
                phoneNumber: data.phoneNumber,
                email: data.email,
                address: data.address ?? "",
            });
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

    const deleteSupplierPopup = 
        <Popup text="This customer will be deleted, you're sure?">
            <Button
                text="Delete"
                color={Color.WHITE}
                bgColor={Color.RED}
                actionHandler={() => {
                    popup.hide();
                    deleteThisCustomer();
                }}
            />
            <Button
                text="Cancel"
                color={Color.BLACK}
                bgColor={Color.WHITE}
                actionHandler={() => {
                    popup.hide();
                }}
            />
        </Popup>

    return (
        <section className="w-full flex flex-col">
            <Header>
                <div className="flex gap-4">
                    <BackwardButton />
                    <Button
                        text="Edit"
                        color={Color.WHITE}
                        bgColor={Color.ORANGE} 
                        actionHandler={() => router.push(`${customerId}/edit`)}
                    />
                    <Button
                        text="Delete"
                        color={Color.WHITE}
                        bgColor={Color.RED} 
                        actionHandler={() => {
                            popup.show(deleteSupplierPopup);
                        }}
                    />
                </div>
            </Header>
            <Main>
                <div className="w-full h-full flex gap-3">
                    {customer && 
                        <InfoSection
                            supplier={customer}
                        />}
                    </div>
            </Main>
        </section>
    )
}

function InfoSection({
    supplier
}: {
    supplier: ICustomer
}) {
    const inforBars: 
        {
            label: string, 
            key: "id" | "name" | "phoneNumber" | "email" | "address" , 
            icon: string
        }[] = [
            {label: "Id", key: "id", icon: "hashtag"}, 
            {label: "Name", key: "name", icon: "signature"}, 
            {label: "Phone number", key: "phoneNumber", icon: "phone"}, 
            {label: "Email", key: "email", icon: "at"}, 
            {label: "Address", key: "address", icon: "map-location-dot"}, 
        ];

    return (
        <section className="w-2/5 p-3 pt-6 h-full flex flex-col border-2 rounded-l-sm gap-6">
            <Title
                text="Detailed Information"
                icon="circle-info"
                color={Color.BLUE}
            /> 
            <div className="flex flex-col gap-3"> 
                {inforBars.map(infoBar =>
                    <InfoBar
                        key={infoBar.label}
                        label={infoBar.label}
                        value={supplier?.[infoBar.key] ?? ""}
                        icon={infoBar.icon}
                    />
                )}
            </div>
        </section>
    )
}