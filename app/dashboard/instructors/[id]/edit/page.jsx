import { DashboardHeader } from "@/components/dashboard-header";
import { InstructorForm } from "@/components/instructor-form";

export default async function EditInstructorPage({ params }) {
  const { id } = await params;
  return (
    <div className="flex flex-col px-24 py-12">
      <DashboardHeader
        heading="Edit Instructor"
        text="Update instructor information."
      />
      <div className="flex-1 p-4 md:p-8 pt-6">
        <div className="max-w-2xl">
          <InstructorForm instructorId={id} />
        </div>
      </div>
    </div>
  );
}
