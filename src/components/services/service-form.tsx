// src/components/services/service-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ServiceStatus } from "@prisma/client";

const serviceFormSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  description: z.string().optional(),
  currentStatus: z.enum(["OPERATIONAL", "DEGRADED", "PARTIAL_OUTAGE", "MAJOR_OUTAGE"])
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

interface ServiceFormProps {
  organizationId: string;
  service?: {
    id: string;
    name: string;
    description?: string | null;
    currentStatus: ServiceStatus;
  };
}

export default function ServiceForm({ organizationId, service }: ServiceFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: service?.name || "",
      description: service?.description || "",
      currentStatus: service?.currentStatus || "OPERATIONAL"
    }
  });

  const currentStatus = watch("currentStatus");

  const onSubmit = async (data: ServiceFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const endpoint = service 
        ? `/api/services/${service.id}` 
        : "/api/services";
      
      const method = service ? "PUT" : "POST";
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          organizationId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save service");
      }

      router.refresh();
      router.push("/services");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-4 text-sm text-red-800 rounded-md bg-red-50">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Service Name</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="e.g., Website, API, Database"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Brief description of this service"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Current Status</Label>
        <Select
          value={currentStatus}
          onValueChange={(value) => setValue("currentStatus", value as ServiceStatus)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="OPERATIONAL">Operational</SelectItem>
            <SelectItem value="DEGRADED">Degraded Performance</SelectItem>
            <SelectItem value="PARTIAL_OUTAGE">Partial Outage</SelectItem>
            <SelectItem value="MAJOR_OUTAGE">Major Outage</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-4">
        <Button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : service ? "Update Service" : "Create Service"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/services")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}