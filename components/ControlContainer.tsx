import Icon from "./Icon";

export default function ControlContainer({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <section className="flex flex-col h-full p-3 bg-gray-50 rounded-md">
            <h3 className=" flex items-center gap-3 p-2 pb-4 font-semibold">
                <Icon name="gamepad" size="xl" /> Control Manager
            </h3>
            {children}
        </section>
    )
}

export function ControlItem({
    text,
    children,
}: {
    text: string,
    children: React.ReactNode
}) {
    return (
        <div className="h-12 bg-white flex border border-transparent hover:border-gray-200  ">
            <p className="w-1/3 px-2 flex items-center capitalize font-semibold ">{text}</p>
            {children}
        </div>
    )
}