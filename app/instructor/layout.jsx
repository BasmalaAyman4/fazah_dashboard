import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/auth";
import { Sidebar } from "@/components/sidebar";

export default async function InstructorLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "instructor") {
    redirect("/login");
  }

  return (
    <div className="h-screen w-screen">
      <Sidebar userRole="instructor" />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
