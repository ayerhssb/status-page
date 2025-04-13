import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    redirect("/sign-in");
  }

  const organization = await prisma.organization.findUnique({
    where: { id: orgId },
  });

  if (!organization) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)]">
        <h2 className="text-2xl font-bold text-center">Welcome to Status Page</h2>
        <p className="mt-2 text-gray-600 text-center max-w-md">
          You need to create or join an organization to manage services and incidents.
        </p>
        <Button className="mt-4" asChild>
          <a href="https://accounts.clerk.dev/organizations" target="_blank" rel="noopener noreferrer">
            Manage Organizations
          </a>
        </Button>
      </div>
    );
  }

  const servicesCount = await prisma.service.count({ where: { organizationId: organization.id } });
  const incidentsCount = await prisma.incident.count({ where: { organizationId: organization.id } });
  const openIncidentsCount = await prisma.incident.count({
    where: {
      organizationId: organization.id,
      status: { notIn: ['RESOLVED'] },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{organization.name} Dashboard</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{servicesCount}</div>
            <p className="text-xs text-muted-foreground">Total services being tracked</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{incidentsCount}</div>
            <p className="text-xs text-muted-foreground">All-time incidents recorded</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openIncidentsCount}</div>
            <p className="text-xs text-muted-foreground">Currently active incidents</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you might want to perform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full mb-2">
              <Link href="/services/new">Add New Service</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/incidents/new">Report Incident</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Public Status Page</CardTitle>
            <CardDescription>View your organization's public status page</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full">
              <Link href={`/status/${organization.id}`}>View Public Status Page</Link>
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Share this link with your users to let them check your services' status
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
