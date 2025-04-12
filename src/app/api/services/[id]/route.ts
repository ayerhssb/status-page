// src/app/api/services/[id]/route.ts
import { auth, currentOrganization } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ServiceStatus } from "@prisma/client";
import { z } from "zod";
import { pusher } from "@/lib/pusher";

// Schema for validating input
const serviceUpdateSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  description: z.string().optional(),
  currentStatus: z.enum(["OPERATIONAL", "DEGRADED", "PARTIAL_OUTAGE", "MAJOR_OUTAGE"]),
  organizationId: z.string().min(1, "Organization ID is required")
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authentication check
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const { id } = params;
    
    // Find the service
    const service = await prisma.service.findUnique({
      where: { id }
    });
    
    if (!service) {
      return NextResponse.json({ message: "Service not found" }, { status: 404 });
    }
    
    // Verify the user belongs to the organization
    const organization = await currentOrganization();
    if (!organization || organization.id !== service.organizationId) {
      return NextResponse.json(
        { message: "You don't have permission to access this service" },
        { status: 403 }
      );
    }
    
    return NextResponse.json(service);
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json(
      { message: "Failed to fetch service" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authentication check
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const { id } = params;
    
    // Parse and validate the request body
    const body = await req.json();
    const validationResult = serviceUpdateSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: validationResult.error.errors },
        { status: 400 }
      );
    }
    
    const { name, description, currentStatus, organizationId } = validationResult.data;
    
    // Find the service
    const existingService = await prisma.service.findUnique({
      where: { id }
    });
    
    if (!existingService) {
      return NextResponse.json({ message: "Service not found" }, { status: 404 });
    }
    
    // Verify the user belongs to the organization
    const organization = await currentOrganization();
    if (!organization || organization.id !== organizationId) {
      return NextResponse.json(
        { message: "You don't have permission to update this service" },
        { status: 403 }
      );
    }
    
    // Verify the service belongs to the specified organization
    if (existingService.organizationId !== organizationId) {
      return NextResponse.json(
        { message: "Service does not belong to the specified organization" },
        { status: 403 }
      );
    }
    
    // Update the service
    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        name,
        description,
        currentStatus: currentStatus as ServiceStatus
      }
    });

    await pusher.trigger(
        `org-${organizationId}-services`,  // Channel
        'service-updated',                 // Event
        {
          id: updatedService.id,
          name: updatedService.name,
          currentStatus: updatedService.currentStatus
        }
      );
    
    return NextResponse.json(updatedService);
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      { message: "Failed to update service" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authentication check
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const { id } = params;
    
    // Find the service
    const service = await prisma.service.findUnique({
      where: { id }
    });
    
    if (!service) {
      return NextResponse.json({ message: "Service not found" }, { status: 404 });
    }
    
    // Verify the user belongs to the organization
    const organization = await currentOrganization();
    if (!organization || organization.id !== service.organizationId) {
      return NextResponse.json(
        { message: "You don't have permission to delete this service" },
        { status: 403 }
      );
    }
    
    // Delete the service
    await prisma.service.delete({
      where: { id }
    });
    
    return NextResponse.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { message: "Failed to delete service" },
      { status: 500 }
    );
  }
}