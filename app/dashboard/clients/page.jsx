import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard-header";
import { Plus } from "lucide-react";
import { ClientsList } from "../../../components/clients-list";

export default function InstructorsPage() {
  return (
    <div className="space-y-4 px-24 py-12">
      <DashboardHeader
        title="العملاء"
        description="إدارة العملاء "
        action={{
          href: "/dashboard/clients/new",
          label: "إضافة عميل",
        }}
      />
      <ClientsList />
    </div>
  );
}
