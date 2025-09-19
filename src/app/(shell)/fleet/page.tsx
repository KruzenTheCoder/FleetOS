"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FleetTable } from "@/components/tables/FleetTable";
import { AddVehicleModal } from "@/components/modals/AddVehicleModal";
import { csvDownload } from "@/lib/utils";
import { useStore } from "@/lib/store";

export default function FleetPage() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { vehicles } = useStore();

  const exportCSV = useCallback(() => {
    const rows = [["ID", "Driver", "Status", "Route", "Fuel %", "Speed", "Odometer", "Lat", "Lng"]];

    vehicles.forEach((vehicle) => {
      rows.push([
        String(vehicle.id),
        String(vehicle.driver),
        String(vehicle.status),
        String(vehicle.routeId || ""),
        String(Math.round(vehicle.fuel)),
        String(Math.round(vehicle.speed)),
        String(Math.round(vehicle.odo)),
        String(vehicle.pos.lat.toFixed(5)),
        String(vehicle.pos.lng.toFixed(5))
      ]);
    });

    csvDownload("vehicles.csv", rows);
  }, [vehicles]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("modal") === "addVehicle") {
      setOpen(true);
    }
  }, []);

  const openModal = useCallback(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    params.set("modal", "addVehicle");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    setOpen(true);
  }, [pathname, router]);

  const closeModal = useCallback(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    params.delete("modal");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    setOpen(false);
  }, [pathname, router]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold">Fleet</div>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV} className="chip badge">Export CSV</button>
          <button onClick={openModal} className="chip badge">Add Vehicle</button>
        </div>
      </div>

      <div className="glass p-5 w-full overflow-x-auto">
        <FleetTable className="w-full min-w-[800px]" />
      </div>

      <AddVehicleModal open={open} onClose={closeModal} />
    </div>
  );
}
