import Link from "next/link";
import Icon from "./Icon";
import { ILinkNavType } from "@/utils/constants/navs";
import useActiveNav from "@/utils/hooks/useActiveNav";

export default function NavGroup({
    title,
    navList,
    children // Good handling here! Can be used variety ways
}: {
    title: string,
    navList?:  ILinkNavType[],
    children?: React.ReactNode,
}) { 
    const [activeNav, setActiveNav] = useActiveNav();

    function handleChangeNav(text: string) {
        setActiveNav(text);
    }

    return (
        <ul className="flex flex-col px-2.5 text-xs gap-1">
            <h6 className="font-bold text-gray-400 text-[11px]">{title}</h6>
            {navList?.map(nav => (
                <li 
                    key={nav.text}
                    className="">
                    <LinkNav 
                        nav={nav} 
                        isActive={activeNav === nav.text}
                        handleChangeNav={handleChangeNav}
                    />
                </li>
            ))}
            {children}
        </ul>
    )
}

function LinkNav({
    nav,
    isActive,
    handleChangeNav,
}: {
    nav: {icon: string, url: string, text: string},
    isActive: boolean,
    handleChangeNav: (text: string) => void
}) { 
    let navClassName = "w-full px-2.5 h-10 flex items-center gap-2 rounded-md ";
    isActive ? navClassName += ' bg-gray-600 text-white font-semibold' : navClassName += ' text-gray-800 hover:bg-gray-200 ';

    return (
        <Link 
            href={nav?.url || '/'}
            onClick={() => handleChangeNav(nav.text)}
        >
            <div className={navClassName}>
                <div className="w-6 grid place-items-center">
                    <Icon name={nav.icon} size="lg" />
                </div>
                <span>{nav.text}</span>
            </div>
        </Link>
    )
}

export function FuncNav({
    icon,
    func,
    text,
    color,
}: {
    icon: string, 
    func: () => void, 
    text: string,
    color?: string,
}) {
    let navClassName = " w-full px-2.5 h-10 flex items-center gap-2 rounded-md hover:bg-gray-200 cursor-pointer " + color;

    return (
        <div className={navClassName} onClick={func}>
            <div className="w-6 grid place-items-center">
                <Icon name={icon} size="lg" />
            </div>
            <span>{text}</span>
        </div>
    )
}