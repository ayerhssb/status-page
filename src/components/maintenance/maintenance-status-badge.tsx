import { Badge } from "@/components/ui/badge";
import { MaintenanceStatus } from "@prisma/client";

interface MaintenanceStatusBadgeProps {
  status: MaintenanceStatus;
}

const statusConfig: Record<MaintenanceStatus, { label: string; variant: "secondary" | "warning" | "outline" | "destructive" }> = {
  SCHEDULED: {
    label: "Scheduled",
    variant: "secondary",
  },
  IN_PROGRESS: {
    label: "In Progress",
    variant: "warning",
  },
  COMPLETED: {
    label: "Completed",
    variant: "outline",
  },
  CANCELLED: {
    label: "Cancelled",
    variant: "destructive",
  },
};

export function MaintenanceStatusBadge({ status }: MaintenanceStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
}
