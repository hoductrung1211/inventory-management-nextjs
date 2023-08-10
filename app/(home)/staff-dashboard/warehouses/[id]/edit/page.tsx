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
import InfoBar from "@/components/InfoBar";
import EditText from "@/components/EditText";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import { getWarehouseById, updateWarehouse } from "@/api/warehouse";
import { IBranchResponse, getAllBranches } from "@/api/branch";
import DropDown, { IDropdownData } from "@/components/DropDown";

export default function Page({
    params
}: {
    params: {id: string}
}) {
    const router = useRouter();
    const notify = useNotification();
    const warehouseId = Number.parseInt(params.id);
    const [branchDataset, setBranchDataset] = useState<IDropdownData[]>([]);
    const [branchId, setBranchId] = useState(-1);
    const [showLoading, hideLoading] = useLoadingAnimation();
    const [fields, setFields] = useState([
        {label: "Name", value: "", icon: "signature", isRequired: true, errorText: ""},
        {label: "Address", value: "", icon: "map-location-dot", isRequired: true, errorText: ""},
    ]);

    useEffect(() => {
        fetchWarehouse();
        fetchBranches();
    }, []);

    async function fetchWarehouse () {
        try {
            showLoading();
            const {data} = await getWarehouseById(warehouseId);
            setFields([
                {...fields[0], value: data.name},
                {...fields[1], value: data.address},
            ]);
            setBranchId(data.branchId);
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
            await updateWarehouse(
                warehouseId, 
                fields[0].value, 
                fields[1].value, 
                branchId
            );
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
                            className="object-fill"
                            src="/images/warehouse-edit.jpg"
                            alt="Branch images"
                            fill
                        />
                    </section>
                    <section className="w-1/2 border-2 flex flex-col p-5 rounded-md">
                        <Title
                            text="Edit warehouse information"
                            icon="pencil"
                        />
                        <form className="mt-10 mx-auto w-[480px] flex flex-col gap-4">
                            <InfoBar label="Id" icon="hashtag" value={warehouseId} />
                            <DropDown
                                label="Branch"
                                dataset={branchDataset}
                                icon="building"
                                value={branchId}
                                handleChange={(e) => setBranchId(Number.parseInt(e.target.value))}
                            />
                            {fields.map((field, idx) => 
                            <EditText
                                icon={field.icon}
                                label={field.label}
                                value={field.value}
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