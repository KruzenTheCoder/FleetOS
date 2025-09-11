'use client';

import { FleetTable } from '@/components/tables/FleetTable';
import { AddVehicleModal } from '@/components/modals/AddVehicleModal';
import { useState } from 'react';
import { csvDownload } from '@/lib/utils';
import { useStore } from '@/lib/store';

export default function FleetPage() {
  const [open, setOpen] = useState(false);
  const { vehicles, settings } = useStore();

 const exportCSV = () => {
  const rows = [['ID','Driver','Status','Route','Fuel %','Speed','Odometer','Lat','Lng']];

  vehicles.forEach(v => {
    rows.push([
      String(v.id),
      String(v.driver),
      String(v.status),
      String(v.routeId || ''),
      String(Math.round(v.fuel)),
      String(Math.round(v.speed)),
      String(Math.round(v.odo)),
      String(v.pos.lat.toFixed(5)),
      String(v.pos.lng.toFixed(5))
    ]);
  });

  csvDownload('vehicles.csv', rows);
};


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold">Fleet</div>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV} className="chip badge">Export CSV</button>
          <button onClick={()=>setOpen(true)} className="chip badge">Add Vehicle</button>
        </div>
      </div>

      <div className="glass p-5 w-full overflow-x-auto">
      <FleetTable className="w-full min-w-[800px]" />
      </div>

      <AddVehicleModal open={open} onClose={()=>setOpen(false)} />
    </div>
  );
}