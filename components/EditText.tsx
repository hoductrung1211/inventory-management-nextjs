import { ChangeEvent, useRef, useState } from "react";
import Icon from "./Icon";

export default function EditText({
    label,
    icon,
    handleChange,
    value,
    type = "text",
    errorText = "",
}: {
    label: string,
    icon: string,
    type?: string,
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void,
    value: string,
    errorText: string,
}) {
    let className = "h-10 px-3 flex place-items-center border-2 rounded-md  ";
    let classNameError = className + " border-red-400";
    const [isError, setIsError] = useState(errorText ? true : false);

    return (
        <div className="flex flex-col bg-white">
            <label className={isError ? classNameError : className}>
                <span className="w-12"><Icon name={icon} size="xl" /></span>
                <span className="w-40 font-bold">{label}</span>
                <input
                    className="w-full pl-2 bg-transparent border-l-2"
                    name={label}
                    type={type}
                    onChange={(e) => {
                        handleChange(e);
                        setIsError(false);
                    }}
                    value={value}
                />
            </label>
            {isError && <p className="pl-5 text-red-500 font-semibold">{errorText}</p>}
        </div>

    )
}