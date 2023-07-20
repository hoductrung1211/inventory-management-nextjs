'use client';
import { IBranchResponse, getAllBranches } from "@/api/branch";
import { ICreateEmployee, IEmployeeResponse, createEmployee } from "@/api/employee";
import BackwardButton from "@/components/BackwardButton";
import Title from "@/components/DashboardTitle";
import DropDown, { IDropdownData } from "@/components/DropDown";
import EditText from "@/components/EditText";
import Header, { Button } from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import { Color } from "@/utils/constants/colors";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
    const router = useRouter();
    const [showLoading, hideLoading] = useLoadingAnimation();
    const notify = useNotification();

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
    const [branchId, setBranchId] = useState(-1);
    const [branchDataset, setBranchDataset] = useState<IDropdownData[]>([]);
    const [gender, setGender] = useState(false);

    useEffect(() => {
        fetchBranches();
    }, []);

    async function fetchBranches () {
        try {
            showLoading();
            const {data: branches} = await getAllBranches();
            const newBranchDataset = branches.map((branch: IBranchResponse) => ({
                text: branch.name,
                value: branch.id,
            }));
            setBranchDataset(newBranchDataset);
            // If there is no branch, set default value to check required constraint
            setBranchId(newBranchDataset[0].value ?? -1); 
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    const requestCreateBranch = async () => {
        const checked = checkConstraint();
        if (!checked) {
            notify("Create a warehouse failed!", "error");
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
                gender: gender,
            }
            console.log("--- --- " + fields[4]);
            // if (fields[4].value.trim()) data.dateOfBirth = fields[4].value.trim();
            const salary = Number.parseFloat(fields[5].value.trim());
            if (!Number.isNaN(salary)) data.salary = salary;
            if (fields[6].value.trim()) data.imageUrl = fields[6].value.trim();
            const managerId = Number.parseInt(fields[7].value.trim());
            if (!Number.isNaN(managerId)) data.managerId = managerId;

            await createEmployee(data);
            router.push("./");
            notify("Create a warehouse successfully!", "success");
        }
        catch (error) {
            console.log(error);
            notify("Create a warehouse failed!", "error");
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
                        text="Save"
                        color={Color.WHITE}
                        bgColor={Color.GREEN} 
                        actionHandler={requestCreateBranch}
                    />
                </div>
            </Header>
            <Main>
                <div className="w-[480px] h-full flex flex-col gap-8 p-5 mx-auto border-2 rounded-md shadow-md">
                    <Title
                        text="Create a warehouse"
                        icon="plus"
                        color={Color.GREEN}
                    /> 
                    <form className="flex flex-col gap-4">
                        <DropDown
                            label="Branch"
                            icon="building"
                            dataset={branchDataset}
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
                                value={field.value.toString()}
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
                </div>
            </Main>
        </section>
    )
}