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
import { getProductById, updateProduct } from "@/api/product";
import { GetAllCategories, ICategoryResponse } from "@/api/category";
import DropDown, { IDropdownData } from "@/components/DropDown";

export default function Page({
    params
}: {
    params: {id: string}
}) {
    const router = useRouter();
    const notify = useNotification();
    const productId = Number.parseInt(params.id);
    const [showLoading, hideLoading] = useLoadingAnimation();
    const [fields, setFields] = useState([
        {label: "Name", value: "", icon: "signature", isRequired: true, errorText: "", type: "text"},
        {label: "SKU", value: "", icon: "lightbulb", isRequired: true, errorText: "", type: "text"},
        {label: "Dimensions", value: "", icon: "arrows-left-right", isRequired: false, errorText: "", type: "text"},
        {label: "Weight", value: "", icon: "weight-hanging", isRequired: false, errorText: "", type: "text"},
        {label: "Price", value: "", icon: "tag", isRequired: true, errorText: "", type: "number"},
        {label: "Image URL", value: "", icon: "image", isRequired: false, errorText: "", type: "text"},
    ]);
    const [catDataset, setCatDataset] = useState<IDropdownData[]>([]);
    const [catId, setCatId] = useState(0);

    useEffect(() => {
        fetchProduct(); 
        fetchCategories();
    }, []);

    async function fetchCategories() {
        try {
            showLoading();
            const { data } = await GetAllCategories();

            setCatDataset(data.map((cat: ICategoryResponse) => ({
                text: cat.name,
                value: cat.id,
            })));
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }
    async function fetchProduct() {
        try {
            showLoading();
            const {data} = await getProductById(productId);
            console.log(data);
            setFields([
                {...fields[0], value: data.name},
                {...fields[1], value: data.sku},
                {...fields[2], value: data.dimensions},
                {...fields[3], value: data.weight},
                {...fields[4], value: data.tempPrice + ""},
                {...fields[5], value: data.imageUrl},
            ]);

            setCatId(data.categoryId);
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
            await updateProduct(productId, fields[0].value, fields[1].value, catId, fields[2].value, fields[3].value, fields[4].value, fields[5].value);
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
                            src={ fields[5].value ? fields[5].value : ""}
                            alt="Branch images"
                            fill
                        />
                    </section>
                    <section className="w-1/2 border-2 flex flex-col p-5 rounded-md">
                        <Title
                            text="Edit product information"
                            icon="pencil"
                        />
                        <form className="mt-10 mx-auto w-[480px] flex flex-col gap-4">
                            <InfoBar label="Id" icon="hashtag" value={productId} />
                            <DropDown
                                label="Category"
                                icon="building"
                                dataset={catDataset}
                                handleChange={(e) => setCatId(Number.parseInt(e.target.value))}
                                value={catId}
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