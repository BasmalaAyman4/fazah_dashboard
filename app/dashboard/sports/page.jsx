import { DashboardHeader } from "@/components/dashboard-header";
import { SportsList } from "@/components/sports-list";

export default function SportsPage() {
  return (
    <div className="space-y-4 px-24 py-12">
      <DashboardHeader
        title="الرياضات"
        description="إدارة الرياضات والفئات الفرعية"
        action={{
          href: "/dashboard/sports/new",
          label: "إضافة رياضة",
        }}
      />
      <SportsList />
    </div>
  );
}
