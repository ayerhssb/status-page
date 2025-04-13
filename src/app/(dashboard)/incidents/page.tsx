"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { AlertCircle, Plus } from "lucide-react";
import { IncidentStatusBadge } from "@/components/incidents/incident-status-badge";
import { IncidentImpactBadge } from "@/components/incidents/incident-impact-badge";

// ✅ Import expected prop types from components
import type { IncidentStatus } from "@/components/incidents/incident-status-badge";
import type { IncidentImpact } from "@/components/incidents/incident-impact-badge";

// ✅ Define Incident type
type Incident = {
  id: string;
  title: string;
  status: IncidentStatus;
  impact: IncidentImpact;
  createdAt: string;
  updatedAt: string;
  services: string[];
};

export default async function IncidentsPage() {
  const incidents: Incident[] = [
    { 
      id: '1', 
      title: 'API Performance Issues', 
      status: 'investigating',
      impact: 'minor',
      createdAt: '2025-04-13T10:30:00Z',
      updatedAt: '2025-04-13T10:45:00Z',
      services: ['API']
    },
    { 
      id: '2', 
      title: 'Database Connectivity', 
      status: 'identified',
      impact: 'major',
      createdAt: '2025-04-12T14:15:00Z',
      updatedAt: '2025-04-12T15:30:00Z',
      services: ['Database', 'Authentication']
    },
    { 
      id: '3', 
      title: 'Website Slow Response', 
      status: 'resolved',
      impact: 'minor',
      createdAt: '2025-04-10T09:20:00Z',
      updatedAt: '2025-04-10T11:45:00Z',
      services: ['Website']
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Incidents</h1>
        <Link href="/dashboard/incidents/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Incident
          </Button>
        </Link>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Incidents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {incidents.length > 0 ? (
              incidents.map((incident) => (
                <div 
                  key={incident.id} 
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 border-b last:border-0 hover:bg-gray-50 gap-2"
                >
                  <Link href={`/dashboard/incidents/${incident.id}`} className="flex-1">
                    <div>
                      <div className="font-medium">{incident.title}</div>
                      <div className="text-sm text-gray-500">
                        Affected services: {incident.services.join(', ')}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Created: {new Date(incident.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </Link>
                  <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
                    <IncidentStatusBadge status={incident.status} />
                    <IncidentImpactBadge impact={incident.impact} />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No incidents reported. Create an incident to get started.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
