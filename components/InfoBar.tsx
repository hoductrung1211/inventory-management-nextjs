import Icon from "./Icon";

export default function InfoBar({
    label,
    value,
    icon
}: {
    label: string,
    value?: string | number,
    icon: string,
}) {
    let className = "flex px-3 place-items-center min-h-[40px] bg-gray-100 rounded-md hover:bg-gray-200";
    return (
        <div className={className}>
            <span className="w-9 shrink-0"><Icon name={icon} size="xl" /></span>
            <span className="w-36 font-bold shrink-0">{label}</span>
            <span className="w-full py-2">{value}</span>
        </div>  
    )
}