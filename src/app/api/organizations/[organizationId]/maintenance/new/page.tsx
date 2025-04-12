// src/app/dashboard/[organizationId]/maintenance/new/page.tsx
import { MaintenanceForm } from "@/components/maintenance/maintenance-form";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/prisma";

interface NewMaintenancePageProps {
  params: {
    organizationId: string;
  };
}

export default async function NewMaintenancePage({
  params,
}: NewMaintenancePageProps) {
  const services = await prisma.service.findMany({
    where: {
      organizationId: params.organizationId,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Schedule Maintenance</h2>
        <p className="text-sm text-muted-foreground">
          Create a new scheduled maintenance to notify users about upcoming service disruptions
        </p>
      </div>
      <Separator />
      <MaintenanceForm
        services={services}
        organizationId={params.organizationId}
      />
    </div>
  );
}