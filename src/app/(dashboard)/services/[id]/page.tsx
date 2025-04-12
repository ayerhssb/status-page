// src/app/(dashboard)/services/[id]/page.tsx
import { notFound, redirect } from "next/navigation";
import { auth, currentOrganization } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import ServiceForm from "@/components/services/service-form";
import DeleteServiceButton from "@/components/services/delete-service-button";

interface ServicePageProps {
  params: {
    id: string;
  };
}

export default async function ServicePage({ params: { id } }: ServicePageProps) {
  const { userId } = auth();
  const organization = await currentOrganization();
  
  if (!userId || !organization) {
    redirect("/sign-in");
  }

  const service = await prisma.service.findUnique({
    where: { id }
  });

  if (!service || service.organizationId !== organization.id) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Edit Service</h2>
        <DeleteServiceButton serviceId={service.id} serviceName={service.name} />
      </div>
      
      <div className="max-w-2xl">
        <ServiceForm
          organizationId={organization.id}
          service={service}
        />
      </div>
    </div>
  );
}