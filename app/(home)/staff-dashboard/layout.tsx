'use client';
import { useRouter } from "next/navigation";
import NavGroup, { FuncNav } from "@/components/NavGroup"
import Sidebar from "@/layouts/Sidebar"
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import { HomeUrls } from "@/utils/constants/urls"; 
import { staffNavs } from "@/utils/constants/navs";

export default function Layout({
    children
}: {
    children: React.ReactNode
}) {
    const router = useRouter();
    const [showLoading, hideLoading] = useLoadingAnimation();

    function logout() {
        showLoading();
        localStorage.removeItem('token');
        router.push(HomeUrls.StaffLogin);
        hideLoading();
    }
    return (
        <div className="flex">
            <Sidebar>
                <div className="h-full flex flex-col justify-between">
                    <NavGroup
                        title="Main menu"
                        navList={staffNavs}
                    />
                    <NavGroup
                        title="User"
                    >
                        <FuncNav 
                            icon="gear"
                            func={logout}
                            text="Settings"
                        />
                        <FuncNav 
                            color="text-red-600"
                            icon="right-from-bracket"
                            func={logout}
                            text="Log out"
                        />
                    </NavGroup>
                </div>
            </Sidebar>
            {children}
        </div>
    )
}