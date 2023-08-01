import { Color } from "@/utils/constants/colors";
import Icon from "../components/Icon";

export default function Header({
    children,
}: {
    children: React.ReactNode, // More general & reusable
}) {
    return (
        <header className="flex justify-between w-full px-4 h-14 items-center">
            { children }
            <section className="flex items-center gap-2 text-base"> 
                <Action icon="bell" size="lg" />
                <Action icon="circle-question" size="lg" />
                <Action icon="user-circle" size="2xl" />
            </section>
        </header>
    )
}

function Action({
    icon,
    size
}: {
    icon: string,
    size?: 'lg' | 'xl' | '2xl' | '3xl'
}) {
    return (
        <div className="w-11 grid place-items-center aspect-square hover:bg-gray-100 rounded-full cursor-pointer ">
            <Icon name={icon} size={size} />
        </div>
    )
}

export function Button({
    text,
    color = Color.BLACK,
    bgColor,
    actionHandler,
    icon
}: {
    text: string,
    color?: Color,
    bgColor: Color,
    actionHandler: () => void,
    icon?: string,
}) {

    return (
        <button
            className={`flex gap-2 items-center justify-center min-w-[80px] px-3 py-2 bg-${bgColor} text-${color} font-bold hover:border-gray-200 border-2 border-transparent rounded-md hover:bg-opacity-80 transition`}
            onClick={actionHandler}
        >
            { icon && <Icon name={icon} /> }
            {text}
        </button>
    )
}