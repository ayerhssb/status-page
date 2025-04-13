// src/app/dashboard/[organizationId]/incidents/page.tsx
import { IncidentList } from "@/components/incidents/incident-list";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface IncidentsPageProps {
  params: {
    organizationId: string;
  };
}

export default async function IncidentsPage({ params }: IncidentsPageProps) {
  const { userId, orgId } = auth();

  if (!userId || orgId !== params.organizationId) {
    redirect("/");
  }

  const incidents = await prisma.incident.findMany({
    where: {
      organizationId: params.organizationId,
    },
    include: {
      service: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Incidents</h1>
          <p className="text-sm text-muted-foreground">
            Manage and monitor incidents across your services.
          </p>
        </div>
        <Link
          href={`/dashboard/${params.organizationId}/incidents/new`}
          passHref
        >
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Incident
          </Button>
        </Link>
      </div>

      <IncidentList
        incidents={incidents}
        organizationId={params.organizationId}
      />
    </div>
  );
}