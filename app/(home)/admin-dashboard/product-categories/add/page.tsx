'use client';
import { createCategory } from "@/api/category";
import BackwardButton from "@/components/BackwardButton";
import Title from "@/components/DashboardTitle";
import { IDropdownData } from "@/components/DropDown";
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
    const notify = useNotification();
    const [fields, setFields] = useState([
        {label: "Name", value: "", icon: "signature", isRequired: true, errorText: "", type: "text"},
        {label: "Description", value: "", icon: "quote-left", isRequired: false, errorText: "", type: "text"},
        {label: "Image URL", value: "", icon: "image", isRequired: false, errorText: "", type: "text"},
    ]);
    const [showLoading, hideLoading] = useLoadingAnimation();

    useEffect(() => {
    }, []);

    const requestCreateCategory = async () => {
        const checked = checkConstraint();
        if (!checked) {
            notify("Create a category failed", "error");
            return;
        }
        try {
            // await (fields[0].value, fields[1].value, fields[2].value);
            router.push("./");
            notify("Create a category successfully", "success");
        }
        catch (error) {
            console.log(error);
            notify("Create a category failed", "error");
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
                        actionHandler={requestCreateCategory}
                    />
                </div>
            </Header>
            <Main>
                <div className="w-[480px] h-full flex flex-col gap-8 p-5 mx-auto border-2 rounded-md shadow-md">
                    <Title
                        text="Create a category"
                        icon="plus"
                        color={Color.GREEN}
                    />
                    <div className="relative h-60">
                        <Image
                            className="object-contain"
                            src="/images/warehouse2.webp"
                            alt="Building image"
                            fill
                        />
                    </div>
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