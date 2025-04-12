// src/app/dashboard/[organizationId]/incidents/[incidentId]/page.tsx
import { IncidentForm } from "@/components/incidents/incident-form";
import { IncidentUpdateList } from "@/components/incidents/incident-update-list";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";

interface IncidentPageProps {
  params: {
    organizationId: string;
    incidentId: string;
  };
}

export default async function IncidentPage({ params }: IncidentPageProps) {
  const { userId, orgId } = auth();

  if (!userId || orgId !== params.organizationId) {
    redirect("/");
  }

  const incident = await prisma.incident.findUnique({
    where: {
      id: params.incidentId,
      organizationId: params.organizationId,
    },
    include: {
      service: true,
      updates: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!incident) {
    notFound();
  }

  const services = await prisma.service.findMany({
    where: {
      organizationId: params.organizationId,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold">Edit Incident</h1>
        <p className="text-sm text-muted-foreground">
          Update incident details and status.
        </p>
      </div>

      <IncidentForm
        initialData={incident}
        services={services}
        organizationId={params.organizationId}
      />

      <Separator />

      <div>
        <h2 className="text-lg font-medium mb-4">Incident Updates</h2>
        <IncidentUpdateList
          incidentId={params.incidentId}
          organizationId={params.organizationId}
          updates={incident.updates}
        />
      </div>
    </div>
  );
}