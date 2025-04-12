// src/app/api/organizations/[organizationId]/incidents/route.ts
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { organizationId: string } }
) {
  try {
    const { userId, orgId } = auth();

    if (!userId || orgId !== params.organizationId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const incidents = await prisma.incident.findMany({
      where: {
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(incidents);
  } catch (error) {
    console.error("[INCIDENTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { organizationId: string } }
) {
  try {
    const { userId, orgId } = auth();

    if (!userId || orgId !== params.organizationId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, description, status, impact, serviceId } = body;

    if (!title || !description || !status || !impact || !serviceId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Create the incident
    const incident = await prisma.incident.create({
      data: {
        title,
        description,
        status,
        impact,
        organizationId: params.organizationId,
        serviceId,
        updates: {
          create: {
            message: `Incident created: ${description}`,
            status,
          },
        },
      },
    });

    // Update the service status based on the incident impact
    const serviceStatus = impact === "CRITICAL" 
      ? "MAJOR_OUTAGE" 
      : impact === "MAJOR" 
        ? "PARTIAL_OUTAGE" 
        : "DEGRADED_PERFORMANCE";

    await prisma.service.update({
      where: {
        id: serviceId,
      },
      data: {
        status: serviceStatus,
      },
    });

    return NextResponse.json(incident);
  } catch (error) {
    console.error("[INCIDENTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}