import { ClientForm } from "@/components/client-form";
import { DashboardHeader } from "@/components/dashboard-header";

export default async function EditClientPage({ params }) {
  const { id } = await params;
  return (
    <div className="flex flex-col px-24 py-12">
      <DashboardHeader
        heading="Edit Client"
        text="Update client information."
      />
      <div className="flex-1 p-4 md:p-8 pt-6">
        <div className="max-w-2xl">
          <ClientForm clientId={id} />
        </div>
      </div>
    </div>
  );
}
