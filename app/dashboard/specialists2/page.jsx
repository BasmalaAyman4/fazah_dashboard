"use client";

import { Specialists2List } from "@/components/specialists2-list";
import { DashboardHeader } from "@/components/dashboard-header";

export default function Specialists2Page() {
  return (
    <div className="space-y-6 px-24 py-12">
      <DashboardHeader
        title="Our Specialists 2"
        description="إدارة المتخصصين في النظام"
        action={{
          href: "/dashboard/specialists2/new",
          label: "إضافة متخصص جديد",
        }}
      />
      <Specialists2List />
    </div>
  );
}
