import { Badge } from "@/components/ui/badge";
import { IncidentStatus } from "@prisma/client";

export type { IncidentStatus }; // 👈 EXPORT HERE

interface IncidentStatusBadgeProps {
  status: IncidentStatus;
}

const statusConfig = {
  INVESTIGATING: {
    label: "Investigating",
    variant: "destructive" as const,
  },
  IDENTIFIED: {
    label: "Identified",
    variant: "warning" as const,
  },
  MONITORING: {
    label: "Monitoring",
    variant: "secondary" as const,
  },
  RESOLVED: {
    label: "Resolved",
    variant: "outline" as const,
  },
};

export function IncidentStatusBadge({ status }: IncidentStatusBadgeProps) {
  const config = statusConfig[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
