'use client';
import { createSupplier } from "@/api/supplier";
import BackwardButton from "@/components/BackwardButton";
import Title from "@/components/DashboardTitle";
import EditText from "@/components/EditText";
import Header, { Button } from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import { Color } from "@/utils/constants/colors";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
    const router = useRouter();
    const [showLoading, hideLoading] = useLoadingAnimation();
    const notify = useNotification();

    const [fields, setFields] = useState([
        {label: "Name", value: "", icon: "signature", isRequired: true, errorText: "", type: "text"},
        {label: "Phone number", value: "", icon: "phone", isRequired: true, errorText: "", type: "text"},
        {label: "Email", value: "", icon: "at", isRequired: true, errorText: "", type: "email"},
        {label: "Address", value: "", icon: "map-location-dot", isRequired: false, errorText: "", type: "text"},
        {label: "Description", value: "", icon: "quote-left", isRequired: false, errorText: "", type: "text"},
    ]);

    useEffect(() => {
    }, []);

    const requestCreateSupplier = async () => {
        const checked = checkConstraint();
        if (!checked) {
            notify("Create a supplier information failed", "error");
            return;
        }
        try {
            showLoading();
            await createSupplier({
                name: fields[0].value,
                phoneNumber: fields[1].value,
                email: fields[2].value,
                address: fields[3].value,
                detailDescription: fields[4].value,
            });
            router.push("./");
            notify("Create a supplier information successfully", "success");
        }
        catch (error) {
            console.log(error);
            notify("Create a supplier information failed", "error");
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
        });

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
                        actionHandler={requestCreateSupplier}
                    />
                </div>
            </Header>
            <Main>
                <div className="w-[480px] h-full flex flex-col gap-8 p-5 mx-auto border-2 rounded-md shadow-md">
                    <Title
                        text="Create a supplier info"
                        icon="plus"
                        color={Color.GREEN}
                    /> 
                    <form className="flex flex-col gap-4">
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