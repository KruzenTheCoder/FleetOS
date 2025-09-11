'use client';

import { Modal } from './Modal';
import { useStore } from '@/lib/store';

export function FuelModal({ open, onClose, editId }:{ open:boolean; onClose:()=>void; editId?:string }) {
  const { vehicles, fuelTxns, addFuel, updateFuel } = useStore();
  const editing = fuelTxns.find(x=>x.id===editId);

  const save = () => {
    const id = editing?.id || ('F'+Math.random().toString(36).slice(2,8).toUpperCase());
    const dt = new Date((document.getElementById('fuelDate') as HTMLInputElement).value || new Date()).toISOString();
    const vehicle = (document.getElementById('fuelVehicle') as HTMLSelectElement).value;
    const liters = parseFloat((document.getElementById('fuelLiters') as HTMLInputElement).value || '0');
    const price = parseFloat((document.getElementById('fuelPrice') as HTMLInputElement).value || '0');
    const station = (document.getElementById('fuelStation') as HTMLInputElement).value || '';
    const odo = parseInt((document.getElementById('fuelOdo') as HTMLInputElement).value || '0', 10);
    const t = { id, dt, vehicle, liters, price, total: liters*price, station, odo };
    if (editing) updateFuel(id, t);
    else addFuel(t);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-xl">
      <div className="flex items-start justify-between">
        <div className="text-2xl font-bold">{editing?'Edit':'Add'} Fuel Transaction</div>
        <button className="chip badge" onClick={onClose}>Close</button>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div><div className="label">Date & Time</div><input id="fuelDate" type="datetime-local" className="input" defaultValue={editing ? editing.dt.slice(0,16) : new Date().toISOString().slice(0,16)} /></div>
        <div><div className="label">Vehicle</div><select id="fuelVehicle" className="input" defaultValue={editing?.vehicle || vehicles[0]?.id}>
          {vehicles.map(v=> <option key={v.id}>{v.id}</option>)}
        </select></div>
        <div><div className="label">Liters</div><input id="fuelLiters" type="number" className="input" min={1} step={0.1} defaultValue={editing?.liters || 10} /></div>
        <div><div className="label">Price per Liter</div><input id="fuelPrice" type="number" className="input" min={1} step={0.1} defaultValue={editing?.price || 24.5} /></div>
        <div><div className="label">Station</div><input id="fuelStation" className="input" defaultValue={editing?.station || ''} placeholder="Engen, Cape Town" /></div>
        <div><div className="label">Odometer (km)</div><input id="fuelOdo" type="number" className="input" min={0} defaultValue={editing?.odo || 0} /></div>
      </div>
      <div className="mt-4 flex items-center justify-end gap-2"><button className="chip" onClick={save}>Save</button></div>
    </Modal>
  );
}