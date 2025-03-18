"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import  AnimatedBackground  from "@/components/animated-background";
import { AdminPanel } from "@/components/admin-panel";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      toast.error("You must be logged in to access this page");
      router.push("/admin-login");
      return;
    }
  }, [router]);

  return (
    <div>
      <AnimatedBackground
        primaryColor="rgba(67, 19, 87, 0.35)"
        secondaryColor="rgba(49, 47, 147, 0.35)"
        className="min-h-screen flex items-center justify-center p-4 md:p-8"
      >
        <AdminPanel />
      </AnimatedBackground>
    </div>
  );
}
