'use client';
import Header from "@/app/(log-in)/HomeHeader";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  if (localStorage.getItem("token"))
    router.push("/admin-dashboard");
    
  return (
    <>
      <Header />
      <main></main>
    </>
  )
}