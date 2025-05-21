"use client";

import { DashboardHeader } from "@/components/dashboard-header";
import { Specialist2Form } from "@/components/specialist2-form";

export default function NewSpecialist2Page() {
  return (
    <div className="space-y-6 px-24 py-12">
      <DashboardHeader
        title="إضافة متخصص جديد"
        description="إضافة متخصص جديد إلى النظام"
      />
      <Specialist2Form />
    </div>
  );
}
