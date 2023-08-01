'use client'
import BackwardButton from "@/components/BackwardButton";
import Header, { Button } from "@/layouts/DashboardHeader"
import Main from "@/layouts/DashboardMain"
import { Color } from "@/utils/constants/colors"
import { useEffect, useState } from "react";
import useNotification from "@/utils/hooks/useNotification";
import SupplierSection, { CreateSupplier, Field, SelectSupplier } from "@/layouts/SupplierSection";
import ProductsSection, { IOrderDetail } from "@/layouts/ProductsSection";
import DropDown, { IDropdownData } from "@/components/DropDown";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import { getAllWarehouses, getWarehouseById } from "@/api/warehouse";
import validate from "@/utils/functions/validateFields";
import { createImportOrder, getImportOrderById, updateImportOrder } from "@/api/importOrder";
import { useRouter } from "next/navigation";
import { createSupplier, getSupplierById } from "@/api/supplier";
import IconButton from "@/components/IconButton";
import { IImportOrderData } from "../../page";
import Title from "@/components/DashboardTitle";
import InfoBar from "@/components/InfoBar";
import { getTrackingStateById } from "@/api/trackingState";


export default function Page({
    params
}: {
    params: {id: string}
}) {
    const [showLoading, hideLoading] = useLoadingAnimation();
    const notify = useNotification();
    const router = useRouter();
    // Order
    const orderId = Number.parseInt(params.id);
    const [order, setOrder] = useState<IImportOrderData>({
        id: 0,
        supplierName: "",
        warehouseName: "",
        trackingStateName: "",
        lastUpdatedTime: "",
    });
    // Warehouse
    const [warehouseDropdowns, setWarehouseDrops] = useState<IDropdownData[]>([]);
    const [warehouseId, setWarehouseId] = useState<number>(); 
    // Supplier
    const [supplierMode, setSupplierMode] = useState(false); // true (create) / false (select)
    const [supplierId, setSupplierId] = useState<number>(0);
    const [newSupplierFields, setNewSupplierFields] = useState<Field[]>([
        {label: "Name", value: "", icon: "signature", isRequired: true, errorText: "", type: "text"},
        {label: "Phone number", value: "", icon: "phone", isRequired: true, errorText: "", type: "text"},
        {label: "Email", value: "", icon: "at", isRequired: true, errorText: "", type: "email"},
        {label: "Address", value: "", icon: "map-location-dot", isRequired: false, errorText: "", type: "text"},
        {label: "Description", value: "", icon: "quote-left", isRequired: false, errorText: "", type: "text"},
    ]);

    useEffect(() => {
        fetchOrder();
        fetchWarehouses();
    }, []);
    async function fetchOrder() {
        try {
            showLoading();
            const {data} = await getImportOrderById(orderId);
            const {data: supplier} = await getSupplierById(data.supplierId);
            const {data: warehouse} = await getWarehouseById(data.warehouseId);
            const {data: trackingState} = await getTrackingStateById(data.trackingStateId);
            setOrder({
                ...data,
                supplierName: `${supplier.name}`,
                warehouseName: `${warehouse.name}`,
                trackingStateName: `${trackingState.name}`,
                lastUpdatedTime: new Date(data.lastUpdatedTime).toLocaleString()
            });

            setWarehouseId(data.warehouseId);
            setSupplierId(data.supplierId);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }  

    async function fetchWarehouses() {
        try {
            showLoading();
            const {data} = await getAllWarehouses();
            setWarehouseDrops(data.map(item => ({
                text: item.name,
                value: item.id
            })));
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
                warehouseId: warehouseId ?? 0,
                supplierId: tempSupplierId, 
            }
            await updateImportOrder(orderId, data);
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

        return true;
    }
    return (
        <section className="w-full flex flex-col">
            <Header>
                <div className="flex gap-4">
                    <Button 
                        text="Save"
                        color={Color.WHITE}
                        bgColor={Color.GREEN}
                        actionHandler={handleAddOrder}
                    />
                    <Button 
                        text="Cancel"
                        color={Color.BLACK}
                        bgColor={Color.WHITE}
                        actionHandler={() => router.push("./")}
                    />
                </div>
            </Header>
            <Main>
                <div className="flex gap-3 h-full ">
                    <InfoSection order={order} />
                    <section className="w-full h-full flex flex-col gap-8 p-5 border-2 rounded-md shadow-md">
                        <div className="w-96 mx-auto">
                            <DropDown
                                icon="warehouse"
                                label="Warehouse"
                                dataset={warehouseDropdowns}
                                handleChange={(e) => setWarehouseId(Number.parseInt(e.target.value))}
                                value={warehouseId}
                            />  
                        </div>
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
                </div>
            </Main>
        </section>
    )
}

function InfoSection({
    order
}: {
    order: IImportOrderData
}) {
    const inforBars: { 
        label: string, 
        key: "id" | "supplierName" | "warehouseName" , 
        icon: string 
    }[] = [
        {label: "Id", key: "id", icon: "hashtag"},
        {label: "Supplier", key: "supplierName", icon: "handshake"},
        {label: "Warehouse", key: "warehouseName", icon: "warehouse"},
    ];

    return (
        <section className="flex-shrink-0 w-2/5 p-3 pt-6 h-full flex flex-col border-2 rounded-l-sm gap-6">
            <Title
                text="Edit Order Information"
                icon="pencil"
            />
            <div className="flex flex-col gap-3"> 
                {inforBars.map(infoBar =>
                    <InfoBar
                        key={infoBar.key}
                        label={infoBar.label}
                        value={order?.[infoBar.key] ?? ""}
                        icon={infoBar.icon}
                    />
                )}
            </div> 
        </section>
    )
}