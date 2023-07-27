'use client'
import BackwardButton from "@/components/BackwardButton";
import Header, { Button } from "@/layouts/DashboardHeader"
import Main from "@/layouts/DashboardMain"
import { Color } from "@/utils/constants/colors"
import { useEffect, useState } from "react";
import useNotification from "@/utils/hooks/useNotification";
import PartnerSection, { CreatePartner, Field, SelectPartner } from "./PartnerSection";
import ProductsSection from "./ProductsSection";
import DropDown, { IDropdownData } from "@/components/DropDown";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import { getAllWarehouses } from "@/api/warehouse";
import validate from "@/utils/functions/validateFields";
import { createImportOrder } from "@/api/importOrder";
import { useRouter } from "next/navigation";

export interface IOrderDetail {
    [key: string]: string | number,
    productId: number,
    productName: string,
    quantity: number,
    price: number
}

export default function Page() {
    const [showLoading, hideLoading] = useLoadingAnimation();
    const notify = useNotification();
    const router = useRouter();

    // Partner
    const [partnerMode, setPartnerMode] = useState(false); // true (create) / false (select)
    const [partnerId, setPartnerId] = useState<number>();
    const [newPartnerFields, setNewPartnerFields] = useState<Field[]>([
        {label: "Name", value: "", icon: "signature", isRequired: true, errorText: "", type: "text"},
        {label: "Phone number", value: "", icon: "phone", isRequired: true, errorText: "", type: "text"},
        {label: "Email", value: "", icon: "at", isRequired: true, errorText: "", type: "email"},
        {label: "Address", value: "", icon: "map-location-dot", isRequired: false, errorText: "", type: "text"},
        {label: "Description", value: "", icon: "quote-left", isRequired: false, errorText: "", type: "text"},
    ]);
    // Warehouse
    const [warehouseDropdowns, setWarehouseDrops] = useState<IDropdownData[]>([]);
    const [warehouseId, setWarehouseId] = useState<number>();
    // Products
    const [details, setDetails] = useState<IOrderDetail[]>([]);

    useEffect(() => {
        fetchWarehouses();
    }, []);

    async function fetchWarehouses() {
        try {
            showLoading();
            const {data} = await getAllWarehouses();
            setWarehouseDrops(data.map(item => ({
                text: item.name,
                value: item.id
            })));

            if (data?.[0]) {
                setWarehouseId(data[0].id);
            }
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    async function handleAddOrder() {
        const isValid = checkConstraints();
        if (!isValid)
            return;

        try {
            showLoading();
            // Cannot be undefined because have been checked
            const data = {
                partnerId: partnerId ?? 0, 
                warehouseId: warehouseId ?? 0,
                importOrderDetails: details
            }
            await createImportOrder(data);
            router.push("./");
            notify("Add an Import Order successfully!", "success");
        }
        catch (error) {
            
        }
        finally {
            hideLoading();
        }
    }

    function checkConstraints(): boolean {
        if (partnerMode) {
            const [isValid, errors] = validate(newPartnerFields);
            const newFields = newPartnerFields.map((field, idx) => ({
                ...field,
                errorText: errors[idx],
            }));
            setNewPartnerFields(newFields);
            if (!isValid) {
                notify("Cannot add order without supplier information! Please fill in the form", "error");
                return false;
            }
        }
        else if (!partnerId) {
            notify("Cannot add order without supplier selected! Please add supplier", "error");
            return false;
        }
        if (!warehouseId) {
            notify("Cannot add order without warehouse selected! Please add warehouse", "error");
            return false;
        }
        if (!details.length) {
            notify("Cannot add order without order details! Please add product!", "error");
            return false;
        }

        return true;
    }

    return (
        <section className="w-full flex flex-col">
            <Header>
                <div className="flex gap-4">
                    <BackwardButton />
                    <Button 
                        text="Save"
                        color={Color.WHITE}
                        bgColor={Color.GREEN}
                        actionHandler={handleAddOrder}
                    />
                </div>
            </Header>
            <Main>
                <div className="flex justify-around h-full">
                    <section className="w-[480px] h-full flex flex-col gap-8 p-5 border-2 rounded-md shadow-md">
                        <PartnerSection
                            partnerMode={partnerMode}
                            setPartnerMode={setPartnerMode}
                        >
                        {
                            partnerMode ? 
                            <CreatePartner 
                                fields={newPartnerFields}
                                setFields={setNewPartnerFields}
                            /> :
                            <SelectPartner
                                handleChangePartner={(newId: number) => setPartnerId(newId)}
                                partnerId={partnerId}
                            />
                        }
                        </PartnerSection>
                    </section>
                    <section className="w-[700px] h-full flex flex-col gap-5 p-5  border-2 rounded-md shadow-md">
                        <div className="w-96">
                            <DropDown
                                icon="warehouse"
                                label="Warehouse"
                                dataset={warehouseDropdowns}
                                handleChange={(e) => setWarehouseId(Number.parseInt(e.target.value))}
                                value={warehouseId}
                            />
                        </div>
                        <ProductsSection
                            details={details}
                            setDetails={setDetails}
                        />
                    </section>
                </div>
            </Main>
        </section>
    )
}
