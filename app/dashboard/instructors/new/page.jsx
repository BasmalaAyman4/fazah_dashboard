import { DashboardHeader } from "@/components/dashboard-header";
import { InstructorForm } from "@/components/instructor-form";

export default function NewInstructorPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader
        heading="Add New Instructor"
        text="Create a new instructor profile."
      />
      <div className="flex-1 p-4 md:p-8 pt-6">
        <div className="max-w-2xl">
          <InstructorForm />
        </div>
      </div>
    </div>
  );
}
