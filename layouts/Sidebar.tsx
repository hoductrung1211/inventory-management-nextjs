import Logo from "@/components/Logo";

export default function Sidebar({
    children,
}: {
    children: React.ReactNode,
}) {
    return (
        <aside className="w-56 shrink-0 h-screen flex flex-col bg-slate-800 border-r-2">
            <header className="w-full h-16 px-5 flex items-center gap-1 font-bold">
                <Logo />
            </header>
            <nav className="py-5 h-full text-xs font-semibold text-slate-50">
                {children}
            </nav>
        </aside>
    )
}

