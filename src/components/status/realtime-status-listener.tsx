// src/components/status/realtime-status-listener.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Pusher from "pusher-js";

interface RealtimeStatusListenerProps {
  organizationId: string;
}

export default function RealtimeStatusListener({
  organizationId,
}: RealtimeStatusListenerProps) {
  const router = useRouter();

  useEffect(() => {
    // Initialize Pusher
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    // Subscribe to the organization channel
    const channel = pusher.subscribe(`organization-${organizationId}`);

    // Listen for service update events
    channel.bind("service-updated", () => {
      router.refresh();
    });

    // Listen for incident events
    channel.bind("incident-created", () => {
      router.refresh();
    });

    channel.bind("incident-updated", () => {
      router.refresh();
    });

    channel.bind("incident-deleted", () => {
      router.refresh();
    });

    channel.bind("incident-update-created", () => {
      router.refresh();
    });

    // Listen for maintenance events
    channel.bind("maintenance-created", () => {
      router.refresh();
    });

    channel.bind("maintenance-updated", () => {
      router.refresh();
    });

    channel.bind("maintenance-deleted", () => {
      router.refresh();
    });

    // Cleanup on unmount
    return () => {
      pusher.unsubscribe(`organization-${organizationId}`);
    };
  }, [organizationId, router]);

  // This component doesn't render anything
  return null;
}