"use client";

import { use } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { Specialist2Form } from "@/components/specialist2-form";
import { toast } from "sonner";

export default function EditSpecialist2Page({ params }) {
  const { id } = use(params);
  const specialistId = id;

  if (!specialistId) {
    toast.error("معرف المتخصص غير موجود");
    return null;
  }

  return (
    <div className="space-y-6 px-24 py-12">
      <DashboardHeader
        title="تعديل المتخصص"
        description="تحديث معلومات المتخصص"
      />
      <Specialist2Form specialistId={specialistId} />
    </div>
  );
}
