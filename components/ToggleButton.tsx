'use client';

import Icon from "./Icon";

export default function ToggleButton({
    onClick,
    children,
    icon,
    active = false,
}: {
    onClick?: () => void,
    children?: React.ReactNode,
    icon?: string,
    active?: boolean,
}) {
    const baseClassName = "flex justify-center items-center gap-2 min-w-[80px] px-3 py-2 font-semibold rounded-md border transition "
    let className = baseClassName; 
    
    if (active)
        className += " bg-blue-500 text-white";
    else className += " text-blue-500 border-blue-300"

    return (
        <button 
            className={className}
            onClick={() => {onClick && onClick()}}
        >
            {children}
            {icon && <Icon name={icon} size="lg"/>}
        </button>
    )
}