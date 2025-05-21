import { DashboardHeader } from "@/components/dashboard-header";
import { ClientForm } from "../../../../components/client-form";

export default function NewClientPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader
        heading="Add New Client"
        text="Create a new client profile."
      />
      <div className="flex-1 p-4 md:p-8 pt-6">
        <div className="max-w-2xl">
          <ClientForm />
        </div>
      </div>
    </div>
  );
}
