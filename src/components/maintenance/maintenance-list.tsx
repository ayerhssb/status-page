// src/components/maintenance/maintenance-list.tsx
import { MaintenanceStatusBadge } from "@/components/maintenance/maintenance-status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, formatDistanceToNow } from "date-fns";
import { Calendar, Edit, Trash } from "lucide-react";
import Link from "next/link";

interface MaintenanceListProps {
  maintenances: any[];
  organizationId: string;
}

export function MaintenanceList({ maintenances, organizationId }: MaintenanceListProps) {
  if (maintenances.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg">
        <h3 className="text-lg font-medium">No scheduled maintenance</h3>
        <p className="text-sm text-muted-foreground">
          Schedule maintenance to notify your users about upcoming service disruptions.
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
          <TableHead>Start Time</TableHead>
          <TableHead>End Time</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {maintenances.map((maintenance) => (
          <TableRow key={maintenance.id}>
            <TableCell className="font-medium">{maintenance.title}</TableCell>
            <TableCell>{maintenance.service.name}</TableCell>
            <TableCell>
              <MaintenanceStatusBadge status={maintenance.status} />
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                {format(new Date(maintenance.startTime), "MMM d, h:mm a")}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                {format(new Date(maintenance.endTime), "MMM d, h:mm a")}
              </div>
            </TableCell>
            <TableCell className="flex space-x-2">
              <Link
                href={`/dashboard/${organizationId}/maintenance/${maintenance.id}`}
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