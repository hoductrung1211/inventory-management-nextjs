'use client';
import { getAllBranches } from "@/api/branch";
import BackwardButton from "@/components/BackwardButton";
import Title from "@/components/DashboardTitle";
import Header, { Button } from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import { Color } from "@/utils/constants/colors";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import InfoBar from "@/components/InfoBar";
import Table from "@/layouts/Table"; 
import usePopup from "@/utils/hooks/usePopup";
import Popup from "@/components/Popup";
import useNotification from "@/utils/hooks/useNotification";
import { deleteEmployee, getEmployeeById } from "@/api/employee";

interface IEmployee {
    id: number,
    name: string,
    gender: string,
    dateOfBirth: string,
    email: string,
    address: string,
    salary: number,
    imageUrl: string,
    branch: string,
    managerId: number | undefined,
    manager: string | undefined,
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

    const employeeId = Number.parseInt(params.id);
    const [employee, setEmployee] = useState<IEmployee>({
        id: 0,
        name: "string",
        gender: "string",
        dateOfBirth: "string",
        email: "string",
        salary: 0,
        address: "",
        imageUrl: "string",
        branch: "string",
        managerId: 0,
        manager: "string",
    });

    useEffect(() => {
        fetchEmployee();
    }, []);

    async function fetchEmployee() {
        try {
            showLoading();
            const {data} = await getEmployeeById(employeeId);
            const {data : brData} = await getAllBranches();

            const fullName = data.lastName + " " + data.firstName;
            const {name: branch} = brData.find(br => br.id === data.branchId) ?? {name: ""};
            
            const newEmployee = {
                id: data.id,
                name: fullName,
                address: data.address ?? "",
                gender: data.gender ? "Male" : "Female",
                dateOfBirth: data.dateOfBirth?.slice(0, 10) ?? "",
                email: data.email + "",
                salary: data.salary ?? 0,
                imageUrl: data.imageUrl + "",
                branch: branch + "",
                managerId: data.managerId,
                manager: "",
            }
            
            if (data.managerId != null) {
                const {data : manager}  = await getEmployeeById(data.managerId);
                const managerName = manager.lastName + " " + manager.firstName;
                newEmployee.manager = managerName;
            }

            setEmployee(newEmployee);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    async function deleteThisEmployee() {
        try {
            showLoading();
            await deleteEmployee(employeeId);
            router.push("./")
            notify("Delete employee successfully!", "success");
        }
        catch (error) {
            console.log(error);
            notify("Delete employee failed!", "error");
        }
        finally {
            hideLoading();
        }
    }

    const deleteEmployeePopup = 
        <Popup text="This employee will be deleted, you're sure?">
            <Button
                text="Delete"
                color={Color.WHITE}
                bgColor={Color.RED} 
                actionHandler={() => {
                    popup.hide();
                    deleteThisEmployee();
                }}
            />
            <Button
                text="Cancel"
                color={Color.BLACK}
                bgColor={Color.WHITE} 
                actionHandler={() => {popup.hide()}}
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
                        actionHandler={() => router.push(`${employeeId}/edit`)}
                    />
                    <Button
                        text="Delete"
                        color={Color.WHITE}
                        bgColor={Color.RED} 
                        actionHandler={() => {
                            popup.show(deleteEmployeePopup);
                        }}
                    />
                </div>
            </Header>
            <Main>
                <div className="w-full h-full flex gap-3">
                    <InfoSection employee={employee} />
                    {/* <ProductSection products={products} /> */}
                </div>
            </Main>
        </section>
    )
}



function InfoSection({
    employee
}: {
    employee: IEmployee
}) {
    const inforBars: {label: string, key: "id" | "name" | "address" | "branch" | "gender" | "dateOfBirth" | "email" | "salary" | "managerId" | "manager", icon: string}[] = [
        {label: "Id", key: "id", icon: "hashtag"},
        {label: "Full name", key: "name", icon: "signature"},
        {label: "Gender", key: "gender", icon: "venus-mars"},
        {label: "Birthday", key: "dateOfBirth", icon: "calendar"},
        {label: "Address", key: "address", icon: "location-dot"},
        {label: "Email", key: "email", icon: "envelope"},
        {label: "Salary", key: "salary", icon: "money-check-dollar"},
        {label: "Branch", key: "branch", icon: "building"},
        {label: "Manager ID", key: "managerId", icon: "id-card"},
        {label: "Manager", key: "manager", icon: "black-tie"},
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
                        value={employee?.[infoBar.key] ?? ""}
                        icon={infoBar.icon}
                    />
                )}
            </div>
        </section>
    )
}

function ProductSection({
    products
}: {
    products: {
        id: number,
        name: string,
        quantity: number,
    }[]
}) {
    return (
        <section className="w-3/5 p-3 pt-6 h-full flex flex-col border-2 rounded-r-sm gap-6">
            <Title text="Products belong to this warehouse" icon="box-open" color={Color.GREEN} />
            <Table
                columns={[
                    {id: 1, text: "Id", key: "id", linkRoot: "/admin-dashboard/products/"},
                    {id: 2, text: "Product Name", key: "name"},
                    {id: 3, text: "Quantity", key: "quantity"}, 
                ]}
                dataSet={products}
            />
        </section>
    )
}