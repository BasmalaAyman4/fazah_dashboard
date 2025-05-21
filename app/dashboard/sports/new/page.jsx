import { DashboardHeader } from "@/components/dashboard-header";
import { SportForm } from "@/components/sport-form";

export default function NewSportPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader
        heading="إضافة فئة رياضة"
        text="إنشاء فئة رياضة جديدة."
      />
      <div className="flex-1 p-4 md:p-8 pt-6">
        <SportForm />
      </div>
    </div>
  );
}
