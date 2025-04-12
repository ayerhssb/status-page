// src/components/incidents/incident-impact-badge.tsx
import { Badge } from "@/components/ui/badge";
import { IncidentImpact } from "@prisma/client";

interface IncidentImpactBadgeProps {
  impact: IncidentImpact;
}

const impactConfig = {
  MINOR: {
    label: "Minor",
    variant: "outline" as const,
  },
  MAJOR: {
    label: "Major",
    variant: "warning" as const,
  },
  CRITICAL: {
    label: "Critical",
    variant: "destructive" as const,
  },
};

export function IncidentImpactBadge({ impact }: IncidentImpactBadgeProps) {
  const config = impactConfig[impact];
  
  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
}