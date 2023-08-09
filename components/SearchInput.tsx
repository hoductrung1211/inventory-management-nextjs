import { ChangeEvent } from "react";
import Icon from "./Icon";

export default function SearchInput({
    placeholder,
    value,
    handleChange
}: {
    placeholder: string,
    value: string,
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void,
}) {
    return (
        <div className="h-full py-1 pl-2 border rounded-md overflow-hidden">
            <input 
                className="h-full " 
                type="text"
                placeholder={placeholder}
                value={value} 
                onChange={handleChange}
            />
            <button
                className="px-2"
                onClick={() => {}}
            >
                <Icon
                    name="magnifying-glass"
                    size="lg"
                />
            </button>
        </div>
    )
}