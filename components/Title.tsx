import Icon from "./Icon";

export default function Title({
    icon,
    children
}: {
    icon: string,
    children: React.ReactNode
}) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-12 aspect-square grid place-items-center rounded-full text-gray-700 bg-slate-200">
                <Icon name={icon} size="xl" />
            </div>
            <h3 className="font-semibold">
            {children}
            </h3>
        </div>
    )
}