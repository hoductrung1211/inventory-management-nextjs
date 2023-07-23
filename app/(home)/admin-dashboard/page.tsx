'use client';
import Header from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import useActiveNav from "@/utils/hooks/useActiveNav";
import { useEffect } from "react";

export default function Page() {
    const [_, setActiveNav] = useActiveNav();
    useEffect(() => {
        setActiveNav("Home");
    }, []);
    return (
        <section className="w-full flex flex-col">
            <Header>
                
            </Header>
            <Main>
                
            </Main>
        </section>  
    )
}