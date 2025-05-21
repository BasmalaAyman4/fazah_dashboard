import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard-header";
import { InstructorsList } from "@/components/instructors-list";
import { Plus } from "lucide-react";

export default function InstructorsPage() {
  return (
    <div className="space-y-4 px-24 py-12">
      <DashboardHeader
        title="المدربين"
        description="إدارة المدربين والموظفين"
        action={{
          href: "/dashboard/instructors/new",
          label: "إضافة مدرب",
        }}
      />
      <InstructorsList />
    </div>
  );
}
