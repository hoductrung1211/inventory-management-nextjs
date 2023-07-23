'use client';

import useActiveNav from "@/utils/hooks/useActiveNav";
import { useEffect } from "react";

export default function Template({
    children
}: {
    children: React.ReactNode
}) {
    const [_, setActiveNav] = useActiveNav();
    useEffect(() => {
        setActiveNav("Partners");
    }, []);
    
    return ( 
        <>
            {children}
        </>
    )
}