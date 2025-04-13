"use client";
// src/components/incidents/incident-update-list.tsx
import { IncidentStatusBadge } from "@/components/incidents/incident-status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Plus } from "lucide-react";
import { useState } from "react";
import { IncidentUpdateForm } from "./incident-update-form";

interface IncidentUpdateListProps {
  incidentId: string;
  organizationId: string;
  updates: any[];
}

export function IncidentUpdateList({
  incidentId,
  organizationId,
  updates,
}: IncidentUpdateListProps) {
  const [isAddingUpdate, setIsAddingUpdate] = useState(false);

  return (
    <div className="space-y-4">
      {isAddingUpdate ? (
        <IncidentUpdateForm
          incidentId={incidentId}
          organizationId={organizationId}
          onCancel={() => setIsAddingUpdate(false)}
          onSuccess={() => setIsAddingUpdate(false)}
        />
      ) : (
        <Button onClick={() => setIsAddingUpdate(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Update
        </Button>
      )}

      {updates.length === 0 && !isAddingUpdate ? (
        <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg">
          <h3 className="text-lg font-medium">No updates yet</h3>
          <p className="text-sm text-muted-foreground">
            Add your first update to keep users informed.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {updates.map((update) => (
            <Card key={update.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-md">
                    <IncidentStatusBadge status={update.status} />
                  </CardTitle>
                  <CardDescription>
                    {formatDistanceToNow(new Date(update.createdAt), {
                      addSuffix: true,
                    })}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p>{update.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}