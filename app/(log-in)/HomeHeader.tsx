import Logo from "@/components/Logo";
import Link from "next/link";
import { HomeUrls } from "@/utils/constants/urls";

export default function Header() {
    return (
        <header className="fixed inset-x-0 top-0 h-14 bg-gray-100 text-black shadow-md z-20">
            <section className="container h-full flex justify-between items-center">
                <Link href={HomeUrls.Home}>
                    <Logo />
                </Link>
                <nav className="flex gap-6 items-center font-semibold">
                    <Link href={HomeUrls.AdminLogin}>Log in</Link>
                </nav>
            </section>
        </header>
    ) 
}