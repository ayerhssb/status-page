// src/components/services/service-status-badge.tsx
"use client";

import { ServiceStatus } from "@prisma/client";

interface ServiceStatusBadgeProps {
  status: ServiceStatus;
}

export default function ServiceStatusBadge({ status }: ServiceStatusBadgeProps) {
  const getStatusColor = () => {
    switch (status) {
      case "OPERATIONAL":
        return "bg-green-100 text-green-800";
      case "DEGRADED":
        return "bg-yellow-100 text-yellow-800";
      case "PARTIAL_OUTAGE":
        return "bg-orange-100 text-orange-800";
      case "MAJOR_OUTAGE":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "OPERATIONAL":
        return "Operational";
      case "DEGRADED":
        return "Degraded Performance";
      case "PARTIAL_OUTAGE":
        return "Partial Outage";
      case "MAJOR_OUTAGE":
        return "Major Outage";
      default:
        return status;
    }
  };

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor()}`}>
      {getStatusText()}
    </span>
  );
}