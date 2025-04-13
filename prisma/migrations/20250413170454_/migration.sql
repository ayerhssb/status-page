-- CreateEnum
CREATE TYPE "MaintenanceStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ServiceStatus" AS ENUM ('OPERATIONAL', 'DEGRADED', 'OUTAGE');

-- CreateEnum
CREATE TYPE "IncidentStatus" AS ENUM ('INVESTIGATING', 'IDENTIFIED', 'MONITORING', 'RESOLVED');

-- CreateEnum
CREATE TYPE "IncidentImpact" AS ENUM ('MINOR', 'MAJOR', 'CRITICAL');

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "ServiceStatus" NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduledMaintenance" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "MaintenanceStatus" NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "serviceId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "ScheduledMaintenance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Incident" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "IncidentStatus" NOT NULL,
    "impact" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "serviceId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidentUpdate" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "IncidentStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "incidentId" TEXT NOT NULL,

    CONSTRAINT "IncidentUpdate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledMaintenance" ADD CONSTRAINT "ScheduledMaintenance_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledMaintenance" ADD CONSTRAINT "ScheduledMaintenance_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentUpdate" ADD CONSTRAINT "IncidentUpdate_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
