// src/app/api/organizations/[organizationId]/maintenance/[maintenanceId]/route.ts
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher";

export async function GET(
  _req: Request,
  { params }: { params: { organizationId: string; maintenanceId: string } }
) {
  try {
    const maintenance = await prisma.scheduledMaintenance.findUnique({
      where: {
        id: params.maintenanceId,
        organizationId: params.organizationId,
      },
      include: {
        service: true,
      },
    });

    if (!maintenance) {
      return new NextResponse("Maintenance not found", { status: 404 });
    }

    return NextResponse.json(maintenance);
  } catch (error) {
    console.error("[MAINTENANCE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { organizationId: string; maintenanceId: string } }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, description, status, startTime, endTime, serviceId } = body;

    // Validate required fields
    if (!title || !description || !status || !startTime || !endTime || !serviceId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Update maintenance
    const maintenance = await prisma.scheduledMaintenance.update({
      where: {
        id: params.maintenanceId,
        organizationId: params.organizationId,
      },
      data: {
        title,
        description,
        status,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        serviceId,
      },
      include: {
        service: true,
      },
    });

    // Trigger real-time update
    await pusher.trigger(
      `organization-${params.organizationId}`,
      "maintenance-updated",
      {
        maintenance,
      }
    );

    return NextResponse.json(maintenance);
  } catch (error) {
    console.error("[MAINTENANCE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { organizationId: string; maintenanceId: string } }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Delete maintenance
    await prisma.scheduledMaintenance.delete({
      where: {
        id: params.maintenanceId,
        organizationId: params.organizationId,
      },
    });

    // Trigger real-time update
    await pusher.trigger(
      `organization-${params.organizationId}`,
      "maintenance-deleted",
      {
        id: params.maintenanceId,
      }
    );

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[MAINTENANCE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}