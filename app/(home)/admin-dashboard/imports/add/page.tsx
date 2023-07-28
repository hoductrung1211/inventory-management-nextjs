'use client'
import BackwardButton from "@/components/BackwardButton";
import Header, { Button } from "@/layouts/DashboardHeader"
import Main from "@/layouts/DashboardMain"
import { Color } from "@/utils/constants/colors"
import { useEffect, useState } from "react";
import useNotification from "@/utils/hooks/useNotification";
import SupplierSection, { CreateSupplier, Field, SelectSupplier } from "./SupplierSection";
import ProductsSection from "./ProductsSection";
import DropDown, { IDropdownData } from "@/components/DropDown";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import { getAllWarehouses } from "@/api/warehouse";
import validate from "@/utils/functions/validateFields";
import { createImportOrder } from "@/api/importOrder";
import { useRouter } from "next/navigation";
import { createSupplier } from "@/api/supplier";
import IconButton from "@/components/IconButton";

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

    // Supplier
    const [supplierMode, setSupplierMode] = useState(false); // true (create) / false (select)
    const [supplierId, setSupplierId] = useState<number>();
    const [newSupplierFields, setNewSupplierFields] = useState<Field[]>([
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
            let tempSupplierId = supplierId;
            if (supplierMode) {
                const {data: supplier} = await createSupplier({
                    name: newSupplierFields[0].value + "",
                    email: newSupplierFields[1].value + "",
                    phoneNumber: newSupplierFields[2].value + "",
                    address: newSupplierFields[3].value + "",
                    detailDescription: newSupplierFields[4].value + ""
                });
                tempSupplierId = supplier.id;
            }
            // Cannot be undefined because have been checked
            const data = {
                supplierId: tempSupplierId ?? 0, 
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
        if (supplierMode) {
            const [isValid, errors] = validate(newSupplierFields);
            const newFields = newSupplierFields.map((field, idx) => ({
                ...field,
                errorText: errors[idx],
            }));
            setNewSupplierFields(newFields);
            if (!isValid) {
                notify("Cannot add order without supplier information! Please fill in the form", "error");
                return false;
            }
        }
        else if (!supplierId) {
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
                <div className="flex justify-around h-full ">
                    <section className="w-[480px] h-full flex flex-col gap-8 p-5 border-2 rounded-md shadow-md">
                        <SupplierSection
                            supplierMode={supplierMode}
                            setSupplierMode={setSupplierMode}
                        >
                        {
                            supplierMode ? 
                            <CreateSupplier 
                                fields={newSupplierFields}
                                setFields={setNewSupplierFields}
                            /> :
                            <SelectSupplier
                                handleChangeSupplier={(newId: number) => setSupplierId(newId)}
                                supplierId={supplierId}
                            />
                        }
                        </SupplierSection>
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
