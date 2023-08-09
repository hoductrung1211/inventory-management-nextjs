'use client';

import BackwardButton from "@/components/BackwardButton";
import Title from "@/components/Title";
import ToggleButton from "@/components/ToggleButton";
import Header from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain"; 
import { ChangeEvent, HTMLInputTypeAttribute, useEffect, useState } from "react";
import SupplierPicker from "./SupplierPicker";
import SupplierInfoForm from "./SupplierInfoForm";
import { IWarehouseResponse, getAllWarehouses } from "@/api/warehouse";
import TableProduct from "./TableProduct";
import Button from "@/components/Button";
import useNotification from "@/utils/hooks/useNotification";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import { useRouter } from "next/navigation";
import { createSupplier } from "@/api/supplier";
import { createImportOrder } from "@/api/importOrder";

export interface IInput {
    label: string,
    value: string,
    name: string,
    required: boolean,
    type: HTMLInputTypeAttribute
}

export interface IDetail {
    productId: number,
    product: string,
    quantity: number,
    price: number
}

export default function Page() {
    const notify = useNotification();
    const router = useRouter();
    const [showLoading, hideLoading] = useLoadingAnimation();

    const [mode, setMode] = useState(false);
    const [supplierId, setSupplierId] = useState(0);
    const [inputs, setInputs] = useState<IInput[]>([
        {label: "Name", value: "", name: "name", required: true, type: "text", },
        {label: "Phone number", value: "", name: "phone", required: true, type: "tel", },
        {label: "Email", value: "", name: "email", required: true, type: "email", },
        {label: "Address", value: "", name: "address", required: true, type: "text", },
        {label: "Detail", value: "", name: "detail", required: false, type: "text", },
    ]);

    const [warehouseId, setWarehouseId] = useState(0);
    const [details, setDetails] = useState<IDetail[]>([]);

    function handleChangeInput(e: ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;

        setInputs(inputs.map(i => {
            if (i.name === e.target.name)
                return {
                    ...i,
                    value: value
                };
            return i;
        }));
    }

    function handleAddDetail(newDetail: IDetail) {
        setDetails([
            ...details,
            newDetail
        ])
    }

    function handleDeleteDetail(id: number) {
        setDetails(details.filter(d => d.productId != id));
    }

    async function handleCreateOrder() {
        showLoading();
        try {
            let supplierIdData= supplierId;
            if (mode == false) {
                const {data} = await createSupplier({
                    name: inputs[0].value,
                    phoneNumber: inputs[1].value,
                    email: inputs[2].value,
                    address: inputs[3].value,
                    detailDescription: inputs[4].value,
                });

                supplierIdData = data.id;
            }

            await createImportOrder({
                supplierId: supplierIdData,
                warehouseId: warehouseId,
                importOrderDetails: details.map(d => ({
                    productId: d.productId,
                    quantity: d.quantity,
                    price: d.price
                }))
            });
            notify("Create Order successfully!", "success");
            router.push("./");
        }
        catch (error) {
            console.log(error);
            notify("Create Order failed!", "error");
        }
        finally {
            hideLoading();
        }
    }

    function checkConstraint(): boolean {
        if (mode == false) {
            const input = inputs.find(i => i.required && !i.value.trim());

            if (input) {
                notify("Cannot blank field " + input.label, "error");
                return false;
            }
        }

        if (!details.length) {
            notify("Cannot crate order with no items. Please try again!", "error");
            return false;
        }

        const detail = details.find(d => !d.price || !d.price);
        if (detail) {
            notify("Price & Price cannot be 0. Please try again! ", "error");
            return false;
        }

        return true;
    }

    return (
        <section className="w-full flex flex-col">
            <Header>
            <div className="flex items-center gap-4">
                    <BackwardButton />
                    <Button
                        variant="outlined"
                        icon="square-check"
                        onClick={() => {
                            if (!checkConstraint())
                                return;

                            handleCreateOrder();
                        }}
                    >
                        Create
                    </Button>

                    <h1 className="font-semibold">Create Export Order</h1>
                </div>
            </Header>
            <Main>
                <div className="w-full h-full flex gap-3">
                    <SupplierSection
                        mode={mode}
                        setMode={setMode} 
                        SupplierInfoForm = 
                            {<SupplierInfoForm
                                inputs={inputs}
                                onChange={handleChangeInput}
                            />}
                        SupplierPicker=
                            {<SupplierPicker 
                                supplierId={supplierId}
                                setSupplierId={setSupplierId}
                            />}
                    />
                    <ProductSection
                        warehouseId={warehouseId}
                        setWarehouseId={setWarehouseId}
                    >
                        <TableProduct
                            details={details}
                            setDetails={setDetails}
                            onAddDetail={handleAddDetail}
                            onDeleteDetail={handleDeleteDetail}
                        />
                    </ProductSection>
                </div>
            </Main>
        </section>
    )
}

function SupplierSection({
    mode,
    setMode, 
    SupplierInfoForm,
    SupplierPicker,
}: {
    mode: boolean,
    setMode: (newMode: boolean) => void, 
    SupplierInfoForm: React.ReactNode,
    SupplierPicker: React.ReactNode,
}) { 
    return (
        <section className="flex-shrink-0 flex flex-col gap-5 w-[520px] p-3 border">
            <div className="flex justify-between items-center">
                <Title icon="cart-shopping">Supplier</Title>
                <ToggleButton 
                    active={mode} 
                    icon="user"
                    onClick={() => setMode(!mode)}
                >Select supplier</ToggleButton>
            </div>
            <div className="h-full ">
                {
                    mode 
                    ?   SupplierPicker
                    :  SupplierInfoForm
                }
            </div>
        </section>
    )
}

function ProductSection({
    warehouseId,
    setWarehouseId,
    children
}: {
    warehouseId: number,
    setWarehouseId: (id: number) => void,
    children: React.ReactNode
}) {
    const [warehouses, setWarehouses] = useState<IWarehouseResponse[]>([]);
    useEffect(() => {
        fetchWarehouses();
    }, []);

    const fetchWarehouses = async () => {
        try {
            const {data} = await getAllWarehouses();
            setWarehouses(data);
            setWarehouseId(data?.[0].id);
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <section className="flex flex-col gap-5 w-full p-3 border">
            <div className="flex justify-between items-center">
                <Title icon="warehouse">Warehouse</Title> 
                <select 
                    className="w-48 px-3 py-3 bg-gray-100 rounded-md outline-none"
                    onChange={(e) => setWarehouseId(Number.parseInt(e.target.value))}
                    value={warehouseId}
                >
                {
                    warehouses.map(whs => (
                        <option 
                            key={whs.id} 
                            value={whs.id}
                        >
                            {whs.name}
                        </option>
                    ))
                }
                </select>
            </div>
            {children}
        </section>
    )
}