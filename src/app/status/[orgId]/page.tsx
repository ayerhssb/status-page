// src/app/status/[orgId]/page.tsx
import { notFound } from "next/navigation";
import { clerkClient } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import ServiceStatusBadge from "@/components/services/service-status-badge";
import RealtimeStatusListener from "@/components/status/realtime-status-listener";

interface StatusPageProps {
    params: {
        orgId: string;
    };
}

export default async function StatusPage({ params: { orgId } }: StatusPageProps) {
    // Get organization details from Clerk
    let organization;
    try {
        organization = await clerkClient.organizations.getOrganization({ organizationId: orgId });
    } catch (error) {
        notFound();
    }

    // Get all services for this organization
    const services = await prisma.service.findMany({
        where: { organizationId: orgId },
        orderBy: { name: 'asc' }
    });

    // Get recent incidents
    const recentIncidents = await prisma.incident.findMany({
        where: {
            organizationId: orgId,
            createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
        },
        include: {
            services: {
                include: {
                    service: true
                }
            },
            updates: {
                orderBy: { createdAt: 'desc' }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    // Calculate overall system status
    const calculateOverallStatus = () => {
        if (services.length === 0) return "No services";

        if (services.some(s => s.currentStatus === "MAJOR_OUTAGE")) {
            return "Major System Outage";
        } else if (services.some(s => s.currentStatus === "PARTIAL_OUTAGE")) {
            return "Partial System Outage";
        } else if (services.some(s => s.currentStatus === "DEGRADED")) {
            return "System Experiencing Degraded Performance";
        } else {
            return "All Systems Operational";
        }
    };

    const getOverallStatusClass = () => {
        if (services.length === 0) return "bg-gray-100 border-gray-200";

        if (services.some(s => s.currentStatus === "MAJOR_OUTAGE")) {
            return "bg-red-50 border-red-200";
        } else if (services.some(s => s.currentStatus === "PARTIAL_OUTAGE")) {
            return "bg-orange-50 border-orange-200";
        } else if (services.some(s => s.currentStatus === "DEGRADED")) {
            return "bg-yellow-50 border-yellow-200";
        } else {
            return "bg-green-50 border-green-200";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-5xl px-4 py-6 mx-auto sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">{organization.name} Status</h1>
                </div>
            </header>

            <main className="max-w-5xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
                {/* Overall Status */}
                <div className={`p-6 mb-8 border rounded-lg ${getOverallStatusClass()}`}>
                    <h2 className="text-2xl font-semibold text-gray-900">
                        {calculateOverallStatus()}
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Updated {new Date().toLocaleString()}
                    </p>
                </div>

                {/* Services Status */}
                <div className="mb-12">
                    <h2 className="mb-4 text-xl font-semibold text-gray-900">Services</h2>

                    {services.length === 0 ? (
                        <div className="p-4 text-sm text-gray-700 bg-white border rounded-lg border-gray-200">
                            No services have been added yet.
                        </div>
                    ) : (
                        <div className="overflow-hidden bg-white border rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Name</th>
                                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {services.map((service) => (
                                        <tr key={service.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">{service.name}</div>
                                                {service.description && (
                                                    <div className="text-sm text-gray-500">{service.description}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <ServiceStatusBadge status={service.currentStatus} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Incidents */}
                <div>
                    <h2 className="mb-4 text-xl font-semibold text-gray-900">Recent Incidents</h2>

                    {recentIncidents.length === 0 ? (
                        <div className="p-4 text-sm text-gray-700 bg-white border rounded-lg border-gray-200">
                            No incidents reported in the past 7 days.
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {recentIncidents.map((incident) => (
                                <div key={incident.id} className="p-4 bg-white border rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium text-gray-900">{incident.title}</h3>
                                        <span className="text-sm text-gray-500">
                                            {new Date(incident.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {incident.services.map(({ service }) => (
                                            <span key={service.id} className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                                                {service.name}
                                            </span>
                                        ))}
                                    </div>

                                    <p className="mt-2 text-gray-700">{incident.description}</p>

                                    {incident.updates.length > 0 && (
                                        <div className="mt-4 border-t border-gray-200">
                                            <h4 className="mt-4 mb-2 font-medium text-gray-900">Updates</h4>
                                            <div className="space-y-3">
                                                {incident.updates.map((update) => (
                                                    <div key={update.id} className="text-sm">
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-medium text-gray-900">
                                                                {update.status === "INVESTIGATING" && "🔍 Investigating"}
                                                                {update.status === "IDENTIFIED" && "🔎 Identified"}
                                                                {update.status === "MONITORING" && "👀 Monitoring"}
                                                                {update.status === "RESOLVED" && "✅ Resolved"}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                {new Date(update.createdAt).toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <p className="mt-1 text-gray-700">{update.message}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <footer className="py-6 bg-white border-t border-gray-200">
                <div className="max-w-5xl px-4 mx-auto text-center text-sm text-gray-500 sm:px-6 lg:px-8">
                    Powered by Status Page | {new Date().getFullYear()}
                </div>
            </footer>

            <RealtimeStatusListener organizationId={orgId} />
        </div>
    );
}