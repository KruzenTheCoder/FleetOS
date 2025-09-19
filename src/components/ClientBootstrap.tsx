"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { useSimulation } from "@/lib/simulation";

export default function ClientBootstrap() {
  const { hydrate, isBootstrapped } = useStore();

  useSimulation();

  useEffect(() => {
    if (isBootstrapped) return;

    let cancelled = false;

    async function bootstrap() {
      try {
        const response = await fetch("/api/bootstrap");
        if (!response.ok) {
          throw new Error(`Bootstrap request failed with status ${response.status}`);
        }
        const payload = await response.json();
        if (!cancelled) {
          hydrate(payload);
        }
      } catch (error) {
        console.error("Failed to bootstrap client state", error);
      }
    }

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, [hydrate, isBootstrapped]);

  return null;
}