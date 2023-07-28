import { Color } from "@/utils/constants/colors";

export default function Button({
    text,
    color = Color.BLACK,
    bgColor,
    actionHandler,
    icon,
}: {
    text: string,
    color?: Color,
    bgColor: Color,
    actionHandler: () => void,
    icon: string,
}) {

    return (
        <button
            className={`min-w-[80px] px-3 py-2 bg-${bgColor} text-${color} font-bold rounded-md hover:bg-opacity-80 transition`}
            onClick={actionHandler}
        >
            {text}
        </button>
    )
}