'use client';
import { getImportOrderById, updateImportOrderState } from "@/api/importOrder";
import { getWarehouseById } from "@/api/warehouse";
import BackwardButton from "@/components/BackwardButton";
import Title from "@/components/DashboardTitle";
import InfoBar from "@/components/InfoBar";
import Header, { Button } from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import Table from "@/layouts/Table";
import { Color } from "@/utils/constants/colors";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IImportOrderData } from "../page";
import { getSupplierById } from "@/api/supplier";
import { getAllTrackingStates, getTrackingStateById } from "@/api/trackingState";
import { getAllProducts } from "@/api/product";
import { getImportOrdersDetailById } from "@/api/importOrderDetail";
import Icon from "@/components/Icon";
import { getTrackingsByOrderId } from "@/api/importTracking";
import { getAllEmployees } from "@/api/employee";
import { createImportReceipt } from "@/api/importReceipt";

export interface IImportOrderDetailData {
    productId: number,
    product: string,
    quantity: string,
    price: string
}

interface ITrackingData {
    dateTime: string,
    employee: string, 
    content: string,
}

export default function Page({
    params
}: {
    params: {id: string}
}) {
    const [showLoading, hideLoading] = useLoadingAnimation();
    const router = useRouter();
    const notify = useNotification();

    const orderId = Number.parseInt(params.id);
    const [order, setOrder] = useState<IImportOrderData>({
        id: 0,
        supplierName: "",
        warehouseName: "",
        warehouseId: 0,
        trackingStateName: "",
        trackingStateId: 0,
        lastUpdatedTime: "",
    });
    const [details, setDetails] = useState<IImportOrderDetailData[]>([]);
    const [trackings, setTrackings] = useState<ITrackingData[]>([]);
    const [state, setState] = useState(0); // 0: View, 1: Editing Receipt

    useEffect(() => {
        fetchOrder();
        fetchDetails();
        fetchTrackings();
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
                lastUpdatedTime: new Date(data.lastUpdatedTime).toLocaleString(),
            });
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }  

    const fetchDetails = async () => {
        try {
            showLoading();
            const {data} = await getImportOrdersDetailById(orderId);
            const {data: products} = await getAllProducts(); 
            setDetails(data.map(item => {
                const product = products.find(prod => prod.id === item.productId);
                return {
                    product: `${product?.name}`,
                    price: item.price.toLocaleString(),
                    quantity: item.quantity.toLocaleString(),
                    productId: item.productId
                }
            }));
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    const fetchTrackings = async () => {
        try {
            showLoading();
            const {data} = await getTrackingsByOrderId(orderId);
            const {data: employees} = await getAllEmployees();
            setTrackings(data.map(item => {
                const ee = employees.find(e => e.id === item.employeeId);
                return {
                    employee: `${ee?.lastName} ${ee?.firstName}`,
                    dateTime: new Date(item.dateTime).toLocaleString(),
                    content: item.content,
                }
            }));
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    const handleUpdateState = (id: number, stateName: string) => {
        showLoading();
        updateImportOrderState(order.id, {stateId: id})
        .then(res => {
            notify("Update state successfully!", "success");
            setOrder({
                ...order,
                trackingStateId: id,
                trackingStateName: stateName
            })
        })
        .catch(error => {
            console.log(error);
            notify("Update state failed!", "error");
        })
        .finally(() => {
            hideLoading();
        })
    }

    const handleCreateReceipt = (details: {
        "productId": number,
        "quantity": number,
        "price": number
    }[]) => {
        createImportReceipt({
            importOrderId: orderId,
            warehouseId: order.warehouseId,
            receiptDetails: details,
        })
        .then(res => {
            notify("Create Receipt successfully!", "success");
            setState(0);
        })
        .catch(error => {
            notify("Create Receipt failed!", "error");
        })
    }

    return (
        <section className="w-full flex flex-col">
            <Header>
                <div className="flex gap-4">
                    <BackwardButton />
                    <Button
                        text="Edit Information"
                        color={Color.WHITE}
                        bgColor={Color.BLUE} 
                        actionHandler={() => {router.push(`${orderId}/edit`)}}
                    /> 
                    <Button
                        text="Edit Products"
                        color={Color.WHITE}
                        bgColor={Color.BLUE} 
                        actionHandler={() => {router.push(`${orderId}/edit-products`)}}
                    /> 
                </div>
            </Header>
            <Main>
                <div className="w-full h-full flex gap-3">
                    <InfoSection 
                        order={order} 
                        handleUpdateState={handleUpdateState}
                        turnOnEditingReceipt={() => setState(1)}
                    />
                    {
                        state ? 
                        <ReceiptSection 
                            turnOffEditingReceipt={() => setState(0)}
                            orderDetails={details}
                            createReceipt={handleCreateReceipt}
                        /> :
                        <DetailSection 
                            orderDetails={details}
                            trackings={trackings}
                        /> 
                    } 
                </div>
            </Main>
        </section>
    )
}

function InfoSection({
    order,
    handleUpdateState,
    turnOnEditingReceipt
}: {
    order: IImportOrderData,
    handleUpdateState: (id: number, stateName: string) => void,
    turnOnEditingReceipt: () => void,
}) {
    const router = useRouter();

    const inforBars: { 
        label: string, 
        key: "id" | "supplierName" | "warehouseName" | "trackingStateName" | "lastUpdatedTime", 
        icon: string 
    }[] = [
        {label: "Id", key: "id", icon: "hashtag"},
        {label: "Supplier", key: "supplierName", icon: "handshake"},
        {label: "Warehouse", key: "warehouseName", icon: "warehouse"},
        {label: "State", key: "trackingStateName", icon: "circle-notch"},
        {label: "Last updated", key: "lastUpdatedTime", icon: "clock"},
    ];
    const [states, setStates] = useState<{text: string, value: number}[]>([]);
    const [stateId, setStateId] = useState(0);

    useEffect(() => {
        fetchStates();
    }, []);

    useEffect(() => {
        setStateId(order.trackingStateId);
    }, [order]);

    const fetchStates = async () => {
        const {data} = await getAllTrackingStates();
        setStates(data.map(item => ({
            text: item.name,
            value: item.id
        })));
    }
 

    return (
        <section className="flex-shrink-0 w-2/5 p-3 pt-6 h-full flex flex-col border-2 rounded-l-sm gap-6">
            <Title
                text="Detailed Information"
                icon="circle-info"
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
            { 
                <div className="flex flex-col gap-3 h-full p-3 bg-gray-50 rounded-md border-t-2">
                    <div className="flex gap-5 items-center h-11">
                        <p className="flex-shrink-0 w-16 font-semibold ">State: </p>
                        {
                            order.receiptId ?
                            <>{order.trackingStateName}</> :
                            <>
                                <select 
                                    className="w-full h-full text-center outline-none rounded-md"
                                    onChange={e => setStateId(Number.parseInt(e.target.value))}
                                    value={stateId}
                                >
                                {states.map(state => 
                                    <option key={state.value} value={state.value}>{state.text}</option>    
                                )}
                                </select>

                                <Button
                                    bgColor={Color.GREEN}
                                    color={Color.WHITE}
                                    text="Update"
                                    actionHandler={() => {
                                        const name = states.find(state => state.value == stateId)?.text;
                                        handleUpdateState(stateId, name ?? "");
                                    }}
                                />
                            </>
                        }
                    </div>
                    <div className="flex gap-5 items-center h-11  rounded-md">
                        <p className="flex-shrink-0 font-semibold w-16 ">Receipt: </p>
                        <p className="flex items-center justify-between w-full text-center">
                            {
                                order.receiptId ?
                                <>
                                    Created
                                    <Button
                                        bgColor={Color.GREEN}
                                        color={Color.WHITE}
                                        text="View"
                                        actionHandler={() => {
                                             router.push("../import-receipts/" + order.receiptId)
                                        }}
                                    />
                                </> :
                                <>
                                    Not yet
                                    <Button
                                        bgColor={Color.GREEN}
                                        color={Color.WHITE}
                                        text="Create"
                                        actionHandler={() => {
                                            turnOnEditingReceipt();
                                        }}
                                    />
                                </>
                            } 
                        </p>
                    </div>
                </div>
            }
        </section>
    )
}

function DetailSection({
    orderDetails,
    trackings
}: {
    orderDetails: IImportOrderDetailData[],
    trackings: ITrackingData[],
}) {
    const [viewMode, setViewMode] = useState(true);

    const button = 
        <button
            className="w-fit h-10 px-2 hover:bg-gray-100 rounded-md font-semibold"
            onClick={() => setViewMode(!viewMode)}
        >
            {viewMode ? 
            <><Icon name="toggle-off" size="2xl" /> Tracking View</> :
            <><Icon name="toggle-on" size="2xl" /> Tracking View</> }
        </button>  

    return (
        <section className="w-3/5 p-3 pt-6 h-full flex flex-col gap-3 border-2 rounded-r-sm ">
            {button}
            {
                viewMode ?
                <Table
                    columns={[
                        {id: 1, text: "Product", key: "product"},
                        {id: 2, text: "Quantity", key: "quantity"},
                        {id: 3, text: "Price", key: "price"},
                    ]}
                    dataSet={orderDetails}
                /> : 
                <Table
                    columns={[
                        {id: 2, text: "Employee", key: "employee"},
                        {id: 3, text: "Content", key: "content"},
                        {id: 1, text: "Update Time", key: "dateTime"},
                    ]}
                    dataSet={trackings}
                />
            }
        </section>
    )
}

function ReceiptSection({
    turnOffEditingReceipt,
    createReceipt,
    orderDetails
}: {
    createReceipt: (details: {
        "productId": number,
        "quantity": number,
        "price": number
    }[]) => void,
    turnOffEditingReceipt: () => void,
    orderDetails: IImportOrderDetailData[],
}) {
    const notify = useNotification();

    const [details, setDetails] = useState(orderDetails.map(detail => ({
        ...detail,
        isRemoved: false,
        quantity: Number.parseInt(detail.quantity),
        price: Number.parseInt(detail.price)
    })));

    function handleCreateReceipt() {
        checkConstraints();
        const dataDetails = details.map(detail => ({
            "productId": detail.productId,
            "quantity": detail.quantity,
            "price": detail.price,
        }));
        createReceipt(dataDetails);
    }

    function checkConstraints() {
        const restDetails = details.filter(d => !d.isRemoved);
        if (!restDetails.length) {
            notify("There must be at least 1 product to create a receipt!", "error");
            return false;
        }

        restDetails.forEach(d => {
            let detail = orderDetails.find(od => od.productId === d.productId);
            if (Number.parseInt(detail?.quantity ?? "0") < d.quantity) {
                notify(`Quantity of ${d.product} cannot be greater than quantity of Order Product`)
                return false;
            }
        });

        return true;
    }

    return (
        <section className="w-3/5 p-2 h-full flex flex-col gap-3 border-2 rounded-r-sm ">
            <div className="flex flex-col h-full">
                <div className="grid grid-cols-4 h-12 bg-slate-700 place-items-center font-semibold text-white rounded-t-md">
                    <p>Product</p>
                    <p>Quantity</p>
                    <p>Price</p>
                    <p>Is Removed</p>
                </div>
                {
                    details.map(detail => 
                        <div 
                            key={detail.productId}
                            className={"grid grid-cols-4 gap-2 py-2 place-items-center border-b " + (detail.isRemoved && " bg-red-200") }
                        >
                            <p className="font-semibold">{detail.product}</p>
                            <input 
                                className="w-40 h-8 px-1 text-end border rounded-md"    
                                type="number"
                                value={detail.quantity}
                                max={detail.quantity + ""}
                                min="1"
                                onChange={e => {
                                    setDetails(details.map(d => {
                                        const res = d.productId === detail.productId;
                                        if (res)
                                            return ({
                                                ...d,
                                                quantity: Number.parseInt(e.target.value),
                                            });
                                        return d;
                                    }));
                                }}
                            />
                            <input 
                                className="w-40 h-8 px-1 text-end border rounded-md"    
                                type="number"
                                value={detail.price}
                                max={detail.price + ""}
                                min="1"
                                onChange={e => {
                                    setDetails(details.map(d => {
                                        const res = d.productId === detail.productId;
                                        if (res)
                                            return ({
                                                ...d,
                                                price: Number.parseInt(e.target.value),
                                            });
                                        return d;
                                    }));
                                }}
                            />
                            <input 
                                className="w-5 aspect-square cursor-pointer"
                                type="checkbox"
                                checked={detail.isRemoved}
                                onChange={() => {
                                    setDetails(details.map(d => {
                                        const res = d.productId === detail.productId;
                                        if (res)
                                            return ({
                                                ...d,
                                                isRemoved: !detail.isRemoved,
                                            });
                                        return d;
                                    }));
                                }}
                             />
                        </div>   
                    )
                }
            </div>
            <div className="flex justify-end gap-3 py-1 h-14 ">
                <Button
                    bgColor={Color.GREEN}
                    color={Color.WHITE}
                    text="Create"
                    icon="plus"
                    actionHandler={handleCreateReceipt}
                />
                <Button
                    bgColor={Color.WHITE}
                    color={Color.BLACK}
                    text="Cancel"
                    actionHandler={turnOffEditingReceipt}
                />
            </div>
        </section>
    )
}