// src/app/dashboard/[organizationId]/incidents/new/page.tsx
import { IncidentForm } from "@/components/incidents/incident-form";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface NewIncidentPageProps {
  params: {
    organizationId: string;
  };
}

export default async function NewIncidentPage({
  params,
}: NewIncidentPageProps) {
  const { userId, orgId } = auth();

  if (!userId || orgId !== params.organizationId) {
    redirect("/");
  }

  const services = await prisma.service.findMany({
    where: {
      organizationId: params.organizationId,
    },
    orderBy: {
      name: "asc",
    },
  });

  if (services.length === 0) {
    redirect(`/dashboard/${params.organizationId}/services/new`);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold">Create New Incident</h1>
        <p className="text-sm text-muted-foreground">
          Report a new incident affecting one of your services.
        </p>
      </div>

      <IncidentForm
        services={services}
        organizationId={params.organizationId}
      />
    </div>
  );
}