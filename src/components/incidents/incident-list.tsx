// src/components/incidents/incident-list.tsx
import { IncidentImpactBadge } from "@/components/incidents/incident-impact-badge";
import { IncidentStatusBadge } from "@/components/incidents/incident-status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { Edit, Trash } from "lucide-react";
import Link from "next/link";

interface IncidentListProps {
  incidents: any[];
  organizationId: string;
}

export function IncidentList({ incidents, organizationId }: IncidentListProps) {
  if (incidents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg">
        <h3 className="text-lg font-medium">No incidents reported</h3>
        <p className="text-sm text-muted-foreground">
          Create a new incident to get started.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Service</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Impact</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {incidents.map((incident) => (
          <TableRow key={incident.id}>
            <TableCell className="font-medium">{incident.title}</TableCell>
            <TableCell>{incident.service.name}</TableCell>
            <TableCell>
              <IncidentStatusBadge status={incident.status} />
            </TableCell>
            <TableCell>
              <IncidentImpactBadge impact={incident.impact} />
            </TableCell>
            <TableCell>
              {formatDistanceToNow(new Date(incident.createdAt), {
                addSuffix: true,
              })}
            </TableCell>
            <TableCell className="flex space-x-2">
              <Link
                href={`/dashboard/${organizationId}/incidents/${incident.id}`}
                passHref
              >
                <Button size="icon" variant="ghost">
                  <Edit className="w-4 h-4" />
                </Button>
              </Link>
              <Button size="icon" variant="ghost" className="text-destructive">
                <Trash className="w-4 h-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}