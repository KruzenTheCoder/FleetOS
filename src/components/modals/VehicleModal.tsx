'use client';

import { Modal } from './Modal';
import { useStore } from '@/lib/store';

export function VehicleModal({ vehicleId, onClose }:{ vehicleId:string|null; onClose:()=>void }) {
  const { vehicles, routes, updateVehicle } = useStore();
  const v = vehicles.find(x=>x.id===vehicleId || '') || null;
  const routeName = v?.routeId ? routes.find(r=>r.id===v.routeId)?.name : undefined;

  return (
    <Modal open={!!v} onClose={onClose}>
      {!v ? null : (
        <>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-2xl font-bold">{v.id}</div>
              <div className="text-slate-500 mt-1 text-sm">{v.driver} • {v.status}</div>
            </div>
            <button className="chip badge" onClick={onClose}>Close</button>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="glass p-4">
              <div className="text-slate-500 text-sm">Fuel</div>
              <div className="text-2xl font-bold">{Math.round(v.fuel)}%</div>
              <div className="h-2 bg-slate-100 rounded-full mt-2"><div className="h-2 bg-brand rounded-full" style={{width:`${v.fuel}%`}}></div></div>
            </div>
            <div className="glass p-4"><div className="text-slate-500 text-sm">Speed</div><div className="text-2xl font-bold">{Math.round(v.speed)} km/h</div></div>
            <div className="glass p-4"><div className="text-slate-500 text-sm">Odometer</div><div className="text-2xl font-bold">{Math.round(v.odo)} km</div></div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass p-4">
              <div className="font-semibold mb-2">Status</div>
              <div className="chip"><span className="dot" style={{background:'#0A84FF'}}></span>{v.status}</div>
              <div className="text-sm text-slate-500 mt-3">{v.routeId ? `Route: ${routeName || v.routeId}.` : 'No active route.'}</div>
            </div>
            <div className="glass p-4">
              <div className="font-semibold mb-2">Actions</div>
              <div className="flex flex-wrap gap-2">
                <select id="mRerouteSelect" className="input w-48">
                  <option value="">None</option>
                  {routes.map(r=><option key={r.id} value={r.id} selected={v.routeId===r.id}>{r.name}</option>)}
                </select>
                <button className="chip" onClick={()=>{
                  const rid = (document.getElementById('mRerouteSelect') as HTMLSelectElement).value || null;
                  if (rid) {
                    const r = routes.find(x=>x.id===rid);
                    if (r) updateVehicle(v.id, { routeId: rid, i: 0, pos: r.points[0], status: 'En Route' });
                  } else {
                    updateVehicle(v.id, { routeId: null, status: v.status==='En Route' ? 'Idle':'Idle' });
                  }
                  onClose();
                }}>Assign Route</button>
              </div>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}