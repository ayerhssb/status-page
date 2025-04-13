"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { CheckCircle, AlertTriangle, AlertCircle, XCircle, Plus } from "lucide-react";

// 1. Define valid service status types
type ServiceStatus = 'operational' | 'degraded' | 'partial_outage' | 'major_outage';

// 2. Define the structure of a service
interface Service {
  id: string;
  name: string;
  status: ServiceStatus;
}

export default async function ServicesPage() {
  // Dummy data — typically this comes from a DB/API
  const services: Service[] = [
    { id: '1', name: 'Website', status: 'operational' },
    { id: '2', name: 'API', status: 'degraded' },
    { id: '3', name: 'Database', status: 'operational' },
    { id: '4', name: 'Authentication', status: 'operational' },
  ];

  const getStatusIcon = (status: ServiceStatus) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'partial_outage':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'major_outage':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: ServiceStatus) => {
    switch (status) {
      case 'operational':
        return "Operational";
      case 'degraded':
        return "Degraded Performance";
      case 'partial_outage':
        return "Partial Outage";
      case 'major_outage':
        return "Major Outage";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Services</h1>
        <Link href="/dashboard/services/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services.length > 0 ? (
              services.map((service) => (
                <div
                  key={service.id}
                  className="flex justify-between items-center p-3 border-b last:border-0 hover:bg-gray-50"
                >
                  <Link href={`/dashboard/services/${service.id}`} className="flex-1">
                    <div className="font-medium">{service.name}</div>
                  </Link>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(service.status)}
                    <span>{getStatusText(service.status)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No services found. Create your first service.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
