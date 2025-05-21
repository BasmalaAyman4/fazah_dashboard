"use client";

import { use } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { SportForm } from "@/components/sport-form";
import { toast } from "sonner";

export default function EditSportPage({ params }) {
  const resolvedParams = use(params);
  const sportId = resolvedParams.id;

  if (!sportId) {
    toast.error("معرف الرياضة غير موجود");
    return null;
  }

  return (
    <div className="space-y-6 px-24 py-12">
      <DashboardHeader
        title="تعديل الرياضة"
        description="تحديث تفاصيل الرياضة وفئاتها الفرعية."
      />
      <SportForm sportId={sportId} />
    </div>
  );
}
