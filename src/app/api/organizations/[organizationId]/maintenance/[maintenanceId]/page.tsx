// src/app/dashboard/[organizationId]/maintenance/[maintenanceId]/page.tsx
import { MaintenanceForm } from "@/components/maintenance/maintenance-form";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface EditMaintenancePageProps {
  params: {
    organizationId: string;
    maintenanceId: string;
  };
}

export default async function EditMaintenancePage({
  params,
}: EditMaintenancePageProps) {
  const maintenance = await prisma.scheduledMaintenance.findUnique({
    where: {
      id: params.maintenanceId,
      organizationId: params.organizationId,
    },
  });

  if (!maintenance) {
    return notFound();
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
    <div className="space-y-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Edit Scheduled Maintenance</h2>
        <p className="text-sm text-muted-foreground">
          Update details for your scheduled maintenance
        </p>
      </div>
      <Separator />
      <MaintenanceForm
        initialData={maintenance}
        services={services}
        organizationId={params.organizationId}
      />
    </div>
  );
}