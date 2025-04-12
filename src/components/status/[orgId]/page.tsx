// src/app/status/[orgId]/page.tsx
import { IncidentImpactBadge } from "@/components/incidents/incident-impact-badge";
import { IncidentStatusBadge } from "@/components/incidents/incident-status-badge";
import { MaintenanceStatusBadge } from "@/components/maintenance/maintenance-status-badge";
import RealtimeStatusListener from "@/components/status/realtime-status-listener";
import ServiceStatusBadge from "@/components/services/service-status-badge"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/prisma";
import { format, isAfter, isBefore } from "date-fns";
import { AlertCircle, Calendar, Clock } from "lucide-react";
import { notFound } from "next/navigation";

interface StatusPageProps {
  params: {
    orgId: string;
  };
}

export default async function StatusPage({ params }: StatusPageProps) {
  const organization = await prisma.organization.findUnique({
    where: {
      id: params.orgId,
    },
  });

  if (!organization) {
    return notFound();
  }

  const services = await prisma.service.findMany({
    where: {
      organizationId: params.orgId,
    },
    orderBy: {
      name: "asc",
    },
  });

  const activeIncidents = await prisma.incident.findMany({
    where: {
      organizationId: params.orgId,
      status: {
        not: "RESOLVED",
      },
    },
    include: {
      service: true,
      updates: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const now = new Date();
  const upcomingMaintenance = await prisma.scheduledMaintenance.findMany({
    where: {
      organizationId: params.orgId,
      endTime: {
        gt: now,
      },
    },
    include: {
      service: true,
    },
    orderBy: {
      startTime: "asc",
    },
  });

  // Check if all systems are operational
  const allOperational = services.every(
    (service) => service.status === "OPERATIONAL"
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center">
            {organization.name} Status
          </h1>
        </div>

        {/* System Status Overview */}
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <CardTitle
              className={`text-2xl flex items-center ${
                allOperational ? "text-green-500" : "text-red-500"
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full mr-2 ${
                  allOperational ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              {allOperational
                ? "All Systems Operational"
                : "System Issues Detected"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between border-b py-2"
                >
                  <span>{service.name}</span>
                  <ServiceStatusBadge status={service.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Incidents */}
        {activeIncidents.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
              Active Incidents
            </h2>
            <div className="space-y-4">
              {activeIncidents.map((incident) => (
                <Card key={incident.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{incident.title}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <IncidentStatusBadge status={incident.status} />
                          <IncidentImpactBadge impact={incident.impact} />
                          <span className="text-sm text-muted-foreground">
                            {incident.service.name}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {format(new Date(incident.createdAt), "MMM d, h:mm a")}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {incident.updates.length > 0 && (
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                        <div className="flex items-center text-sm mb-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {format(
                            new Date(incident.updates[0].createdAt),
                            "h:mm a"
                          )}
                          <IncidentStatusBadge
                            status={incident.updates[0].status}
                            className="ml-2"
                          />
                        </div>
                        <p className="text-sm">{incident.updates[0].message}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Maintenance */}
        {upcomingMaintenance.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-blue-500" />
              Scheduled Maintenance
            </h2>
            <div className="space-y-4">
              {upcomingMaintenance.map((maintenance) => {
                const isActive = isBefore(new Date(maintenance.startTime), now) && 
                                isAfter(new Date(maintenance.endTime), now);
                
                return (
                  <Card key={maintenance.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{maintenance.title}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <MaintenanceStatusBadge status={maintenance.status} />
                            <span className="text-sm text-muted-foreground">
                              {maintenance.service.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center mb-2">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        {format(new Date(maintenance.startTime), "MMM d, h:mm a")} 
                        {" - "}
                        {format(new Date(maintenance.endTime), "MMM d, h:mm a")}
                      </div>
                      <p className="text-sm">{maintenance.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        <Separator className="my-8" />
        
        <div className="text-center text-sm text-muted-foreground">
          <p>Last updated {format(new Date(), "MMMM d, yyyy 'at' h:mm a")}</p>
          <p className="mt-2">Powered by Status Page</p>
        </div>
        
        {/* Add real-time listener */}
        <RealtimeStatusListener organizationId={params.orgId} />
      </div>
    </div>
  );
}