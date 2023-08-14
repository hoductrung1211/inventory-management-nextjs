'use client';
import BackwardButton from "@/components/BackwardButton";
import Header, { Button } from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import { Color } from "@/utils/constants/colors";
import useNotification from "@/utils/hooks/useNotification";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Title from "@/components/DashboardTitle";
import EditText from "@/components/EditText";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import { IBranchResponse, getAllBranches } from "@/api/branch";
import DropDown, { IDropdownData } from "@/components/DropDown";
import { ICreateEmployee, getEmployeeById, updateEmployee } from "@/api/employee";
import datetimeFormat from "@/utils/functions/datetimeFormat";

export default function Page({
    params
}: {
    params: {id: string}
}) {
    const router = useRouter();
    const notify = useNotification();
    const [showLoading, hideLoading] = useLoadingAnimation();

    const [fields, setFields] = useState([
        {label: "First Name", value: "", icon: "signature", isRequired: true, errorText: "", type: "text"},
        {label: "Last Name", value: "", icon: "signature", isRequired: true, errorText: "", type: "text"},
        {label: "Email", value: "", icon: "envelope", isRequired: true, errorText: "", type: "email"},
        {label: "Address", value: "", icon: "map-location-dot", isRequired: false, errorText: "", type: "text"},
        {label: "Date of birth", value: "", icon: "calendar", isRequired: false, errorText: "", type: "date"},
        {label: "Salary", value: "", icon: "money-check-dollar", isRequired: true, errorText: "", type: "number"},
        {label: "Image URL", value: "", icon: "image", isRequired: false, errorText: "", type: "text"},
        {label: "Manager ID", value: "", icon: "id-card", isRequired: false, errorText: "", type: "number"},
    ]);
    const employeeId = Number.parseInt(params.id);
    const [branchDataset, setBranchDataset] = useState<IDropdownData[]>([]);
    const [branchId, setBranchId] = useState(-1);
    const [gender, setGender] = useState(false);

    useEffect(() => {
        fetchEmployee();
        fetchBranches();
    }, []);

    async function fetchEmployee() {
        try {
            showLoading();
            const {data} = await getEmployeeById(employeeId);
            setFields([
                {...fields[0], value: data.firstName},
                {...fields[1], value: data.lastName},
                {...fields[2], value: data.email},
                {...fields[3], value: data.address ?? ""},
                {...fields[4], value: data.dateOfBirth?.slice(0, 10) ?? ""},
                {...fields[5], value: data.salary + ""},
                {...fields[6], value: data.imageUrl ?? ""},
                {...fields[7], value: data.managerId ? data.managerId + "" : ""},
            ]);
            setBranchId(data.branchId);
            setGender(data.gender);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    async function fetchBranches() {
        try {
            showLoading();
            const {data: branches} = await getAllBranches();
            const branchDS = branches.map((branch: IBranchResponse) => ({
                text: branch.name,
                value: branch.id,
            }));
            setBranchDataset(branchDS);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    async function requestUpdate() {
        const checked = checkConstraint();
        if (!checked) {
            notify("Edit failed!", "error");
            return;
        }
        try {
            showLoading();
            const data : ICreateEmployee = {
                branchId, 
                firstName: fields[0].value.trim(), 
                lastName: fields[1].value.trim(), 
                email: fields[2].value.trim(),
                address: fields[3].value.trim(),
                gender: gender
            }

            if (fields[4].value.trim()) data.dateOfBirth = fields[4].value.trim();

            const salary = Number.parseFloat(fields[5].value.trim());
            if (!Number.isNaN(salary)) data.salary = salary;
            
            if (fields[6].value.trim()) data.imageUrl = fields[6].value.trim();

            const managerId = Number.parseInt(fields[7].value.trim());
            if (!Number.isNaN(managerId)) data.managerId = managerId;

            const res = await updateEmployee(employeeId, data);
            console.log(res);
            router.push("./");
            notify("Edit successfully!", "success");
        }
        catch (error) {
            notify("Edit failed!", "error");
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    function checkConstraint() {
        let isError = false;
        let errors: string[] = [];

        fields.forEach(field => {
            const checkErrorValue = field.isRequired && !field.value;

            if (checkErrorValue) {
                errors.push("Cannot blank this field");
                isError = true;
            }
            else errors.push("");
        })

        setFields(fields.map((field, idx) => ({
            ...field,
            errorText: errors[idx],
        })));
        return !isError;
    }

    return (
        <section className="w-full flex flex-col">
            <Header>
                <div className="flex gap-4">
                    <BackwardButton />
                    <Button
                        text="Save changes"
                        color={Color.WHITE}
                        bgColor={Color.BLUE} 
                        actionHandler={requestUpdate}
                    /> 
                </div>
            </Header>
            <Main>
                <div className="w-full h-full flex justify-between gap-5">
                    <section className="relative w-1/2 flex place-content-center">
                        <Image 
                            className="object-contain"
                            src="/images/employee.jpg"
                            alt="Branch images"
                            fill
                        />
                    </section>
                    <section className="w-1/2 border-2 flex flex-col p-5 rounded-md">
                        <Title
                            text={"Edit warehouse information ID: " + employeeId}
                            icon="pencil"
                        />
                        <form className="mt-10 mx-auto w-[480px] flex flex-col gap-4">
                            <DropDown
                                label="Branch"
                                dataset={branchDataset}
                                icon="building"
                                value={branchId}
                                handleChange={(e) => setBranchId(Number.parseInt(e.target.value))}
                            />
                            <DropDown
                                label="Gender"
                                icon="venus-mars"
                                dataset={[
                                    {text: "Male", value: "true"},
                                    {text: "Female", value: "false"},
                                ]}
                                value={gender + ""}
                                handleChange={(e) => setGender(e.target.value == "false" ? false : true)}
                            /> 
                            {fields.map((field, idx) => 
                            <EditText
                                icon={field.icon}
                                label={field.label}
                                value={field.value}
                                type={field.type}
                                handleChange={(e) => {
                                    setFields([
                                        ...fields.slice(0, idx),
                                        {
                                            ...field,
                                            value: e.target.value,
                                        },
                                        ...fields.slice(idx + 1)
                                    ]); 
                                }}
                                errorText={field.errorText}
                                key={field.label + field.errorText}
                            />
                        )}
                        </form>
                    </section>
                </div>
            </Main>
        </section>
    )
}