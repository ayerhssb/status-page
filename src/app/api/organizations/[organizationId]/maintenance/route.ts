// src/app/api/organizations/[organizationId]/maintenance/route.ts
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher";

export async function POST(
  req: Request,
  { params }: { params: { organizationId: string } }
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

    // Create maintenance
    const maintenance = await prisma.scheduledMaintenance.create({
      data: {
        title,
        description,
        status,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        serviceId,
        organizationId: params.organizationId,
      },
      include: {
        service: true,
      },
    });

    // Trigger real-time update
    await pusher.trigger(
      `organization-${params.organizationId}`,
      "maintenance-created",
      {
        maintenance,
      }
    );

    return NextResponse.json(maintenance);
  } catch (error) {
    console.error("[MAINTENANCE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  _req: Request,
  { params }: { params: { organizationId: string } }
) {
  try {
    const maintenances = await prisma.scheduledMaintenance.findMany({
      where: {
        organizationId: params.organizationId,
      },
      include: {
        service: true,
      },
      orderBy: {
        startTime: "desc",
      },
    });

    return NextResponse.json(maintenances);
  } catch (error) {
    console.error("[MAINTENANCE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}