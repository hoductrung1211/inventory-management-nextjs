'use client';
import { GetAllCategories, ICategoryResponse, createCategory } from "@/api/category";
import { createProduct } from "@/api/product";
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
    const notify = useNotification();
    const [fields, setFields] = useState([
        {label: "Name", value: "", icon: "signature", isRequired: true, errorText: "", type: "text"},
        {label: "SKU", value: "", icon: "lightbulb", isRequired: true, errorText: "", type: "text"},
        {label: "Dimensions", value: "", icon: "arrows-left-right", isRequired: false, errorText: "", type: "text"},
        {label: "Weight", value: "", icon: "weight-hanging", isRequired: false, errorText: "", type: "text"},
        {label: "Price", value: "", icon: "tag", isRequired: true, errorText: "", type: "text"},
        {label: "Image URL", value: "", icon: "image", isRequired: false, errorText: "", type: "text"},
    ]);
    const [catId, setCatId] = useState(0);
    const [catDataset, setCatDataset] = useState<IDropdownData[]>([]);

    const [showLoading, hideLoading] = useLoadingAnimation();

    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchCategories() {
        try {
            showLoading();
            const { data: cats } = await GetAllCategories();

            setCatDataset(cats.map((cat: ICategoryResponse) => ({
                text: cat.name,
                value: cat.id,
            })));

            setCatId(cats[0].id ?? -1); 

        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    const requestCreateProduct = async () => {
        const checked = checkConstraint();
        if (!checked) {
            notify("Create a category failed", "error");
            return;
        }
        try {
            await createProduct(fields[0].value, fields[1].value, catId + "", fields[2].value, fields[3].value, fields[4].value, fields[5].value);
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
                        actionHandler={requestCreateProduct}
                    />
                </div>
            </Header>
            <Main>
                <div className="w-[480px] h-full flex flex-col gap-8 p-5 mx-auto border-2 rounded-md shadow-md">
                    <Title
                        text="Create a product"
                        icon="plus"
                        color={Color.GREEN}
                    />
                    <div className="relative h-40">
                        <Image
                            className="object-contain"
                            src="/images/product.jpg"
                            alt="Building image"
                            fill
                        />
                    </div>
                    <form className="flex flex-col gap-4">
                        <DropDown
                            label="Branch"
                            icon="building"
                            dataset={catDataset}
                            handleChange={(e) => setCatId(Number.parseInt(e.target.value))}
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