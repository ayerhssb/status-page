// src/app/api/services/route.ts
import { auth, currentOrganization } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ServiceStatus } from "@prisma/client";
import { z } from "zod";

// Schema for validating input
const serviceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  description: z.string().optional(),
  currentStatus: z.enum(["OPERATIONAL", "DEGRADED", "PARTIAL_OUTAGE", "MAJOR_OUTAGE"]),
  organizationId: z.string().min(1, "Organization ID is required")
});

export async function POST(req: NextRequest) {
  try {
    // Authentication check
    const { userId } = auth();
    const organization = await currentOrganization();
    
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    // Parse and validate the request body
    const body = await req.json();
    const validationResult = serviceSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: validationResult.error.errors },
        { status: 400 }
      );
    }
    
    const { name, description, currentStatus, organizationId } = validationResult.data;
    
    // Verify the user belongs to the organization
    if (!organization || organization.id !== organizationId) {
      return NextResponse.json(
        { message: "You don't have permission to add services to this organization" },
        { status: 403 }
      );
    }
    
    // Create the service
    const service = await prisma.service.create({
      data: {
        name,
        description,
        currentStatus: currentStatus as ServiceStatus,
        organizationId
      }
    });
    
    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { message: "Failed to create service" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Authentication check
    const { userId } = auth();
    const organization = await currentOrganization();
    
    if (!userId || !organization) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    // Get services for the current organization
    const services = await prisma.service.findMany({
      where: { organizationId: organization.id },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { message: "Failed to fetch services" },
      { status: 500 }
    );
  }
}