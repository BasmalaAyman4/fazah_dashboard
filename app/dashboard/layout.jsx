"use client";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen w-screen flex-row-reverse">
      <DashboardSidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
