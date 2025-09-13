'use client';

import { Modal } from './Modal';
import { useStore } from '@/lib/store';
import { depot } from '@/lib/seed';

export function AddVehicleModal({ open, onClose }:{ open:boolean; onClose:()=>void }) {
  const { routes, addVehicle } = useStore();

  const save = () => {
    const id = (document.getElementById('avId') as HTMLInputElement).value.trim() || `TRK-${Math.floor(100+Math.random()*900)}`;
    const driver = (document.getElementById('avDriver') as HTMLInputElement).value.trim() || 'New Driver';
    const routeSel = (document.getElementById('avRoute') as HTMLSelectElement).value;
    const fuel = Math.min(100, Math.max(5, parseInt((document.getElementById('avFuel') as HTMLInputElement).value || '80',10)));
    const cargo = (document.getElementById('avCargo') as HTMLInputElement).value.trim() || 'N/A';
    const routeId = routeSel === 'none' ? null : routeSel;

    let pos = depot; let status:'En Route'|'Idle'|'At Depot'|'Maintenance' = 'Idle'; let speed=0; let i=0;
    if (routeId) {
      const r = routes.find(x=>x.id===routeId)!;
      pos = r.points[0]; status='En Route'; speed=45; i=0;
    }

    addVehicle({ id, driver, status, fuel, speed, odo: Math.floor(5000+Math.random()*200000), pos, routeId, i, cargo });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-md sm:max-w-xl">
      <div className="flex items-start justify-between">
        <div className="text-xl sm:text-2xl font-bold">Add Vehicle</div>
        <button className="chip badge" onClick={onClose}>Close</button>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div><div className="label">Vehicle ID</div><input id="avId" className="input" placeholder="TRK-201" /></div>
        <div><div className="label">Driver</div><input id="avDriver" className="input" placeholder="Thandi" /></div>
        <div>
          <div className="label">Route</div>
          <select id="avRoute" className="input">
            <option value="none">None</option>
            {routes.map(r=> <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
        <div>
          <div className="label">Fuel (%)</div>
          <input
            id="avFuel"
            type="number"
            className="input"
            defaultValue={80}
            min={5}
            max={100}
          />
        </div>
        <div className="sm:col-span-2"><div className="label">Cargo</div><input id="avCargo" className="input" placeholder="FMCG" /></div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <button className="chip" onClick={save}>Save</button>
      </div>
    </Modal>
  );
}
