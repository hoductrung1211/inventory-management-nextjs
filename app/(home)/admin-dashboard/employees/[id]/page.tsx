'use client';
import { getAllBranches } from "@/api/branch";
import BackwardButton from "@/components/BackwardButton"; 
import Header from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import { Color } from "@/utils/constants/colors";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"; 
import Table from "@/layouts/Table"; 
import usePopup from "@/utils/hooks/usePopup";
import Popup from "@/components/Popup";
import useNotification from "@/utils/hooks/useNotification";
import { deleteEmployee, getEmployeeActivities, getEmployeeById } from "@/api/employee";
import datetimeFormat from "@/utils/functions/datetimeFormat";
import InfoContainer, { InfoItem } from "@/components/InfoContainer";
import Title from "@/components/Title";
import ControlContainer, { ControlItem } from "@/components/ControlContainer";
import Button from "@/components/Button";
import PageTitle from "@/components/PageTitle";

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

interface Activity {
    order: string,
    content: string,
    dateTime: string,
}

export default function Page({
    params
}: {
    params: {id: string}
}) {
    const [showLoading, hideLoading] = useLoadingAnimation();
    const employeeId = Number.parseInt(params.id); 
    const [activities, setActivities] = useState<Activity[]>([]);

    useEffect(() => { 
        fetchActivities();
    }, []);

    async function fetchActivities() {
        showLoading();
        try {
            const {data} = await getEmployeeActivities(employeeId);
            setActivities(data.map(item => ({
                order: item.type + " - " + item.orderId,
                content: item.content,
                dateTime: datetimeFormat(item.dateTime),
            })));
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    return (
        <section className="w-full flex flex-col">
            <Header>
                <div className="flex items-center gap-4">
                    <BackwardButton /> 
                    <PageTitle text="Employee Details" />
                </div>
            </Header>
            <Main>
                <div className="w-full h-full flex gap-3">
                    <InfoSection employeeId={employeeId} />
                    <ActivitySection activities={activities} />
                </div>
            </Main>
        </section>
    )
}

function InfoSection({
    employeeId
}: {
    employeeId: number
}) {
    const notify = useNotification();
    const [showLoading, hideLoading] = useLoadingAnimation();
    const router = useRouter();
    const popup = usePopup();
    const [infoList, setInfoList] = useState<{title: string, content: string}[]>([]);
    
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
            
            const newInfoList = [
                {title: "ID", content: data.id.toString()},
                {title: "Full name", content: fullName},
                {title: "Address", content: data.address ?? ""},
                {title: "Gender", content: data.gender ? "Male" : "Female"},
                {title: "Email", content: data.email + ""},
                {title: "Salary", content: "VND " + data.salary?.toLocaleString() },
                {title: "Branch", content: branch},
            ]
            
            if (data.managerId != null) {
                const {data : manager}  = await getEmployeeById(data.managerId);
                const managerName = manager.lastName + " " + manager.firstName;
                newInfoList.push({
                    title: "Manager",
                    content: managerName
                });
            }

            if (data.dateOfBirth != null) {
                newInfoList.push({
                    title: "Manager",
                    content: datetimeFormat(data.dateOfBirth)
                });
            }

            setInfoList(newInfoList)
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
                variant="contained"
                onClick={() => {
                    popup.hide();
                    deleteThisEmployee();
                }}
            >
                Delete
            </Button>
            <Button   
                onClick={() => {popup.hide()}}
            >Cancel</Button>
        </Popup>

    return (
        <section className="w-1/2 p-3 flex flex-col gap-5  border ">
            <Title icon="user-tie">Employee</Title>
            
            <InfoContainer>
            {infoList.map(info => (
                <InfoItem info={info} />
            ))}                            
            </InfoContainer>
            
            <ControlContainer>
                <ControlItem text="Edit Information">
                    <div className="w-full flex py-1 px-2 justify-end">
                        <Button
                            variant="outlined"
                            icon="arrow-right"
                            href={`${employeeId}/edit`}
                        >Go</Button>
                    </div>
                </ControlItem>
                <ControlItem text="Delete">
                    <div className="w-full flex py-1 px-2 justify-end">
                        <Button
                            variant="outlined"
                            icon="trash"
                            onClick={() => {
                                popup.show(deleteEmployeePopup);
                            }}
                        >Delete</Button>
                    </div>
                </ControlItem>
            </ControlContainer>
        </section>
    )
}

function ActivitySection({
    activities
}: {
    activities: Activity[]
}) {
    return (
        <section className="w-3/5 p-3 flex flex-col border rounded-r-sm gap-6">
            <Table
                columns={[
                    {id: 1, text: "Order", key: "order" },
                    {id: 2, text: "Content", key: "content"},
                    {id: 3, text: "Datetime", key: "dateTime"}, 
                ]}
                dataSet={activities}
            />
        </section>
    )
}