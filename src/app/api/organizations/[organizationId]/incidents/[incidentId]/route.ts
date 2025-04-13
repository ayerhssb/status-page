// src/app/api/organizations/[organizationId]/incidents/[incidentId]/route.ts
import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { organizationId: string; incidentId: string } }
) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || orgId !== params.organizationId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const incident = await prisma.incident.findUnique({
      where: {
        id: params.incidentId,
        organizationId: params.organizationId,
      },
      include: {
        service: true,
        updates: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!incident) {
      return new NextResponse("Incident not found", { status: 404 });
    }

    return NextResponse.json(incident);
  } catch (error) {
    console.error("[INCIDENT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { organizationId: string; incidentId: string } }
) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || orgId !== params.organizationId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, description, status, impact, serviceId } = body;

    if (!title || !description || !status || !impact || !serviceId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Get the current incident to check for status change
    const currentIncident = await prisma.incident.findUnique({
      where: {
        id: params.incidentId,
      },
    });

    if (!currentIncident) {
      return new NextResponse("Incident not found", { status: 404 });
    }

    const statusChanged = currentIncident.status !== status;

    // Update the incident
    const updatedIncident = await prisma.incident.update({
      where: {
        id: params.incidentId,
        organizationId: params.organizationId,
      },
      data: {
        title,
        description,
        status,
        impact,
        serviceId,
        resolvedAt: status === "RESOLVED" ? new Date() : null,
      },
    });

    // Create an update if the status changed
    if (statusChanged) {
      await prisma.incidentUpdate.create({
        data: {
          message: `Status changed to ${status}`,
          status,
          incidentId: params.incidentId,
        },
      });
    }

    // Update the service status based on incident status and impact
    let serviceStatus = "OPERATIONAL";
    
    if (status !== "RESOLVED") {
      serviceStatus = impact === "CRITICAL" 
        ? "MAJOR_OUTAGE" 
        : impact === "MAJOR" 
          ? "PARTIAL_OUTAGE" 
          : "DEGRADED_PERFORMANCE";
    } else {
      // Check if there are other active incidents for this service
      const activeIncidents = await prisma.incident.count({
        where: {
          serviceId,
          status: {
            not: "RESOLVED",
          },
          id: {
            not: params.incidentId,
          },
        },
      });
      
      if (activeIncidents === 0) {
        serviceStatus = "OPERATIONAL";
      }
    }

    await prisma.service.update({
      where: {
        id: serviceId,
      },
      data: {
        status: serviceStatus,
      },
    });

    // Trigger real-time update
    await pusher.trigger(
      `organization-${params.organizationId}`,
      "incident-updated",
      {
        incidentId: params.incidentId,
        serviceId,
        status,
        impact,
      }
    );

    return NextResponse.json(updatedIncident);
  } catch (error) {
    console.error("[INCIDENT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { organizationId: string; incidentId: string } }
) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || orgId !== params.organizationId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the incident with its service before deletion
    const incident = await prisma.incident.findUnique({
      where: {
        id: params.incidentId,
        organizationId: params.organizationId,
      },
      select: {
        serviceId: true,
      },
    });

    if (!incident) {
      return new NextResponse("Incident not found", { status: 404 });
    }

    // Delete the incident
    await prisma.incident.delete({
      where: {
        id: params.incidentId,
        organizationId: params.organizationId,
      },
    });

    // Check if there are other active incidents for this service
    const activeIncidents = await prisma.incident.count({
      where: {
        serviceId: incident.serviceId,
        status: {
          not: "RESOLVED",
        },
      },
    });

    // If no more active incidents, update service status to operational
    if (activeIncidents === 0) {
      await prisma.service.update({
        where: {
          id: incident.serviceId,
        },
        data: {
          status: "OPERATIONAL",
        },
      });
    }

    // Trigger real-time update
    await pusher.trigger(
      `organization-${params.organizationId}`,
      "incident-deleted",
      {
        incidentId: params.incidentId,
        serviceId: incident.serviceId,
      }
    );

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[INCIDENT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}