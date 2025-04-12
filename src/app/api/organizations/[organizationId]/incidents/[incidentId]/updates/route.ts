// src/app/api/organizations/[organizationId]/incidents/[incidentId]/updates/route.ts
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { organizationId: string; incidentId: string } }
) {
  try {
    const { userId, orgId } = auth();

    if (!userId || orgId !== params.organizationId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { message, status } = body;

    if (!message || !status) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Create the update
    const update = await prisma.incidentUpdate.create({
      data: {
        message,
        status,
        incidentId: params.incidentId,
      },
    });

    // Update the incident status
    const incident = await prisma.incident.update({
      where: {
        id: params.incidentId,
      },
      data: {
        status,
        resolvedAt: status === "RESOLVED" ? new Date() : null,
      },
      include: {
        service: true,
      },
    });

    // Update service status based on incident status
    let serviceStatus = "OPERATIONAL";
    
    if (status !== "RESOLVED") {
      serviceStatus = incident.impact === "CRITICAL" 
        ? "MAJOR_OUTAGE" 
        : incident.impact === "MAJOR" 
          ? "PARTIAL_OUTAGE" 
          : "DEGRADED_PERFORMANCE";
    } else {
      // Check if there are other active incidents for this service
      const activeIncidents = await prisma.incident.count({
        where: {
          serviceId: incident.serviceId,
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
        id: incident.serviceId,
      },
      data: {
        status: serviceStatus,
      },
    });

    // Trigger real-time update
    await pusherServer.trigger(
      `organization-${params.organizationId}`,
      "incident-updated",
      {
        incidentId: params.incidentId,
        serviceId: incident.serviceId,
        status,
        update: {
          id: update.id,
          message,
          status,
          createdAt: update.createdAt,
        },
      }
    );

    return NextResponse.json(update);
  } catch (error) {
    console.error("[INCIDENT_UPDATES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}