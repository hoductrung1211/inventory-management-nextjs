'use client'
import BackwardButton from "@/components/BackwardButton";
import Header, { Button } from "@/layouts/DashboardHeader"
import Main from "@/layouts/DashboardMain"
import { Color } from "@/utils/constants/colors"
import { useEffect, useState } from "react";
import useNotification from "@/utils/hooks/useNotification";
import CustomerSection, { CreateSupplier, Field, SelectCustomer } from "./SupplierSection";
import ProductsSection, { IOrderDetail } from "./ProductsSection";
import DropDown, { IDropdownData } from "@/components/DropDown";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import { getAllWarehouses } from "@/api/warehouse";
import validate from "@/utils/functions/validateFields";
import { useRouter } from "next/navigation";
import { createCustomer } from "@/api/customer";
import { createExportOrder } from "@/api/exportOrder";


export default function Page() {
    const [showLoading, hideLoading] = useLoadingAnimation();
    const notify = useNotification();
    const router = useRouter();

    // Customer
    const [customerMode, setCustomerMode] = useState(false); // true (create) / false (select)
    const [customerId, setCustomerId] = useState<number>();
    const [newCustomerFields, setNewCustomerFields] = useState<Field[]>([
        {label: "Name", value: "", icon: "signature", isRequired: true, errorText: "", type: "text"},
        {label: "Phone number", value: "", icon: "phone", isRequired: true, errorText: "", type: "text"},
        {label: "Email", value: "", icon: "at", isRequired: true, errorText: "", type: "email"},
        {label: "Address", value: "", icon: "map-location-dot", isRequired: false, errorText: "", type: "text"},
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
            let tempCutomerId = customerId;
            if (customerMode) {
                const {data: supplier} = await createCustomer({
                    name: newCustomerFields[0].value + "",
                    email: newCustomerFields[1].value + "",
                    phoneNumber: newCustomerFields[2].value + "",
                    address: newCustomerFields[3].value + "",
                });
                tempCutomerId = supplier.id;
            }
            // Cannot be undefined because have been checked
            const data = {
                customerId: tempCutomerId ?? 0, 
                warehouseId: warehouseId ?? 0,
                importOrderDetails: details
            }
            await createExportOrder(data);
            router.push("./");
            notify("Add an Export Order successfully!", "success");
        }
        catch (error) {
            
        }
        finally {
            hideLoading();
        }
    }

    function checkConstraints(): boolean {
        if (customerMode) {
            const [isValid, errors] = validate(newCustomerFields);
            const newFields = newCustomerFields.map((field, idx) => ({
                ...field,
                errorText: errors[idx],
            }));
            setNewCustomerFields(newFields);
            if (!isValid) {
                notify("Cannot add order without customer information! Please fill in the form", "error");
                return false;
            }
        }
        else if (!customerId) {
            notify("Cannot add order without customer selected! Please add customer", "error");
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
                    <section className="w-[540px] h-full flex flex-col gap-8 p-5 border-2 rounded-md shadow-md">
                        <CustomerSection
                            customerMode={customerMode}
                            setCustomerMode={setCustomerMode}
                        >
                        {
                            customerMode ? 
                            <CreateSupplier 
                                fields={newCustomerFields}
                                setFields={setNewCustomerFields}
                            /> :
                            <SelectCustomer
                                handleChangeCustomer={(newId: number) => setCustomerId(newId)}
                                customerId={customerId}
                            />
                        }
                        </CustomerSection>
                    </section>
                    <section className="w-[640px] h-full flex flex-col gap-5 p-5  border-2 rounded-md shadow-md">
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
