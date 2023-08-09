'use client';

import Link from "next/link";
import Icon from "./Icon";

export default function Button({
    children,
    variant = "text",
    href,
    onClick,
    icon
}: {
    children?: React.ReactNode,
    variant?: "text" | "contained" | "outlined",
    href?: string,
    onClick?: () => void,
    icon?: string,
}) {
    const baseClassName = "flex justify-center items-center gap-2 min-w-[80px] px-3 py-2 font-semibold rounded-md transition "
    let className = baseClassName; 
    if (variant == "contained") 
        className += "bg-blue-500 text-white hover:bg-opacity-90";
    else {
        className += " text-blue-500 hover:bg-gray-50 ";
        if (variant == "outlined")
            className += " border border-blue-400 ";
    }

    let contentComponent = 
        <>
            {children}
            {icon && <Icon name={icon} size="lg"/>}
        </>

    if (href)
        contentComponent = 
            <Link
                className="flex justify-center items-center gap-2"     
                href={href}
            >
                {contentComponent}
            </Link>

    return (
        <button 
            className={className}
            onClick={() => {onClick && onClick()}}
        >
            {contentComponent}
        </button>
    )
}