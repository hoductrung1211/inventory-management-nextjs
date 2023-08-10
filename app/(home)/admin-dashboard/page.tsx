'use client';
import { getName } from "@/api/auth";  
import { getExportReceiptDetailOverview, getImportReceiptDetailOverview } from "@/api/overview";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Header from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain"; 
import { adminUrls } from "@/utils/constants/urls";
import datetimeFormat from "@/utils/functions/datetimeFormat";
import useActiveNav from "@/utils/hooks/useActiveNav";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Page() {
    const [_, setActiveNav] = useActiveNav();

    useEffect(() => {
        setActiveNav("Home");
    }, []);

    return (
        <section className="w-full flex flex-col">
            <Header>
                <h1 className="font-semibold">Home</h1>
            </Header>
            <Main>
                <main className="w-full h-full flex flex-col p-2">
                    <GreetSection />
                    <div className="flex flex-col gap-5 h-full"> 
                        <DashboardTop

                        />
                        <DashboardBottom />
                    </div>
                </main>
            </Main>
        </section>  
    )
}

function GreetSection() {
    const [showLoading, hideLoading] = useLoadingAnimation();
    const [fullName, setFullName] = useState<string>();

    useEffect(() => {
        getFullName();
    }, []);

    const getFullName = async () => {
        showLoading();
        try {
            const {data} = await getName();
            setFullName(data);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    return (
        <section className="pb-4">
            <div className="flex items-start justify-between">
                <div className="flex flex-col gap-2">
                    <p className="text-xl font-bold">Hello, <span className="text-blue-500">{fullName}</span></p>
                    <p className="text-gray-500">Track team process here. You almost reach the goal!</p>
                </div>
                <div className="flex items-center gap-3">
                    {datetimeFormat(new Date())}
                    <div className="w-10 aspect-square grid place-items-center rounded-full text-gray-700 bg-slate-100">
                        <Icon name="calendar" size="lg" />
                    </div>
                </div>
            </div>
        </section>
    )
}

function DashboardTop() {
    const [satistics, setSatistics] = useState([
        {title: "Import Receipt", value: "", bgColor: "teal", icon: "receipt", href: adminUrls.ImportReceipts },
        {title: "Export Receipt", value: "", bgColor: "cyan", icon: "file-invoice-dollar", href: adminUrls.ExportReceipts },
        {title: "Total Cost", value: "", bgColor: "pink", icon: "money-bill", href: adminUrls.ImportReceipts },
    ])

    useEffect(() => {
        fetchOverview();
    }, []);

    const fetchOverview = async () => {
        try {
            const {data: imReceipt} = await getImportReceiptDetailOverview();
            const {data: exReceipt} = await getExportReceiptDetailOverview();

            setSatistics([
                {title: "Import Receipt", value: "VND " + imReceipt.totalCost.toLocaleString(), bgColor: "teal", icon: "receipt", href: adminUrls.ImportReceipts },
                {title: "Export Receipt", value: "VND " + exReceipt.totalCost.toLocaleString(), bgColor: "cyan", icon: "file-invoice-dollar", href: adminUrls.ExportReceipts },
                {title: "Total Cost", value: "VND " + (imReceipt.totalCost + exReceipt.totalCost).toLocaleString(), bgColor: "pink", icon: "money-bill", href: adminUrls.ImportReceipts },
            ]);
        }   
        catch (error) {
            console.log(error);
        }
    }

    return (
        <section className="grid grid-cols-3 h-48 gap-3">
            {
                satistics.map(s => (
                    <SatisticItem 
                        title={s.title}
                        value={s.value}
                        icon={s.icon}
                        bgColor={s.bgColor}
                        href={s.href}
                    /> 
                ))
            } 
        </section>
    )
}

function SatisticItem({
    icon,
    title,
    value, 
    bgColor,
    href
}: {
    icon: string,
    title: string,
    value: string, 
    bgColor: "cyan" | "teal" | "pink",
    href: string,
}) {
    let itemClass = "p-4 flex justify-between items-center gap-10 rounded-md text-white";
    let iconClass = "mx-5 flex-shrink-0 w-16 h-16 flex justify-center items-center rounded-full border ";

    if (bgColor == "cyan") {
        itemClass += " bg-cyan-600 ";
        iconClass += " bg-cyan-700 ";
    } else if ( bgColor == "teal") {
        itemClass += " bg-teal-600 ";
        iconClass += " bg-teal-700 ";
    } else if ( bgColor == "pink") {
        itemClass += " bg-orange-600 ";
        iconClass += " bg-orange-700 ";
    }

    return (
        <div className={itemClass}>
            <div className={iconClass + "bg"}>
                <Icon name={icon} size="2xl" />
            </div>
            <div className="w-full h-full flex flex-col justify-between ">
                <h3 className="text-lg">{title}</h3>
                <p className="text-xl font-bold text-center">{value}</p>
                <Button
                    icon="arrow-right"
                    href={href}
                >
                    View
                </Button>
            </div>
        </div>
    )
}

function DashboardBottom() {
    return (
        <section className="flex flex-col h-full border">
            <header className="flex-shrink-0 flex gap-2 h-14 p-2 border-b bg-white">
                <ButtonNav
                    title="Import Orders"
                    icon="dolly"
                    active={true}
                />
                <ButtonNav
                    title="Export Orders"
                    icon="truck-fast"
                />
                <ButtonNav
                    title="Products"
                    icon="box-open"
                /> 
                <ButtonNav
                    title="Suppliers"
                    icon="handshake-angle"
                />
                <ButtonNav
                    title="Customers"
                    icon="cart-shopping"
                />
            </header>
            <main className="flex gap-2 p-2 h-full bg-gray-50">
                <section className="relative flex-shrink-0 aspect-square bg-white rounded-md overflow-hidden">
                    <Image
                        className="object-cover"
                        src="/images/import.webp"
                        alt="dashboard image"
                        fill
                    />
                </section>
                <section className="flex flex-col gap-4 w-full h-full p-3 border bg-white rounded-md">
                    <div className="flex items-center justify-between">
                        <h3 className="flex items-center gap-2  font-semibold  text-blue-500">
                            <span className="grid place-items-center w-12 aspect-square rounded-full bg-sky-100 border">
                                <Icon name="dolly" size="xl" />
                            </span>
                            Import Orders
                        </h3>

                        <Button 
                            variant="outlined"
                            icon="arrow-right"
                            href={adminUrls.Imports}
                        >
                            View
                        </Button>
                    </div> 
                    <div className="flex flex-col gap-2 h-full ">
                        <p className=" italic ">
                            Import order in programming refers to the sequence in which 
                            modules or libraries are brought into a script. 
                            It's crucial for readability and avoiding conflicts. 
                            Typically, start with standard library imports, then third-party libraries, 
                            followed by internal app imports, and finally local imports 
                            for specific project components. This order ensures smooth code 
                            organization and reduces errors.
                        </p> 
                    </div>
                    <div className="flex gap-2 h-full">
                        <div className="w-1/2 p-4 flex justify-between items-center gap-10 rounded-md  bg-gray-100">
                            <div className="mx-2 flex-shrink-0 w-16 h-16 flex justify-center items-center rounded-full border bg-gray-50">
                                <Icon name="flag-checkered" size="2xl" />
                            </div>
                            <div className="w-full h-full flex items-center justify-between pr-10">
                                <h3 className="text-lg font-semibold">Count</h3>
                                <p className="text-xl font-bold text-center">24</p> 
                            </div>
                        </div>
                        <div className="w-1/2 p-4 flex justify-between items-center gap-10 rounded-md  bg-gray-100">
                            <div className="mx-2 flex-shrink-0 w-16 h-16 flex justify-center items-center rounded-full border bg-gray-50">
                                <Icon name="hashtag" size="2xl" />
                            </div>
                            <div className="w-full h-full flex items-center justify-between pr-10">
                                <h3 className="text-lg font-semibold">Unfinished Count</h3>
                                <p className="text-xl font-bold text-center">4</p> 
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </section>
    )
}

function ButtonNav({
    title,
    icon,
    active = false,
}: {
    title: string,
    icon: string,
    active?: boolean,
}) {


    return (
        <button className={"flex gap-2 items-center h-full p-2 border rounded-md font-semibold " + (active ? "bg-sky-500 text-white" : "bg-gray-200 hover:bg-gray-100")}>
            <Icon name={icon} /> 
            {title}
        </button>
    )
}