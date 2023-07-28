'use client';
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
    const popup = usePopup();
    const notify = useNotification();
    const [showLoading, hideLoading] = useLoadingAnimation();
    const router = useRouter();

    const supplierId = Number.parseInt(params.id);
    const [supplier, setSupplier] = useState<ISupplier>();

    useEffect(() => {
        fetchSupplier();
    }, []);

    async function fetchSupplier() {
        try {
            showLoading();
            const {data} = await getSupplierById(supplierId);
            setSupplier({
                id: data.id,
                name: data.name,
                phoneNumber: data.phoneNumber,
                email: data.email,
                address: data.address ?? "",
                detailDescription: data.detailDescription ?? "",
            });
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
                text="Delete"
                color={Color.WHITE}
                bgColor={Color.RED}
                actionHandler={() => {
                    popup.hide();
                    deleteThisSupplier();
                }}
            />
            <Button
                text="Cancel"
                color={Color.BLACK}
                bgColor={Color.WHITE}
                actionHandler={() => {
                    popup.hide();
                    // deleteThis
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
                        actionHandler={() => router.push(`${supplierId}/edit`)}
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
                    {supplier && 
                        <InfoSection
                            supplier={supplier}
                        />}
                    </div>
                    {/* <ProductSection products={products} /> */}
            </Main>
        </section>
    )
}

function InfoSection({
    supplier
}: {
    supplier: ISupplier
}) {
    const inforBars: 
        {
            label: string, 
            key: "id" | "name" | "phoneNumber" | "email" | "address" | "detailDescription", 
            icon: string
        }[] = [
            {label: "Id", key: "id", icon: "hashtag"}, 
            {label: "Name", key: "name", icon: "signature"}, 
            {label: "Phone number", key: "phoneNumber", icon: "phone"}, 
            {label: "Email", key: "email", icon: "at"}, 
            {label: "Address", key: "address", icon: "map-location-dot"}, 
            {label: "Detail description", key: "detailDescription", icon: "quote-left"}, 
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