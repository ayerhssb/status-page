// src/app/(dashboard)/services/new/page.tsx
import { currentOrganization } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ServiceForm from "@/components/services/service-form";

export default async function NewServicePage() {
  const organization = await currentOrganization();
  
  if (!organization) {
    redirect("/dashboard");
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Add New Service</h2>
      <div className="max-w-2xl">
        <ServiceForm organizationId={organization.id} />
      </div>
    </div>
  );
}