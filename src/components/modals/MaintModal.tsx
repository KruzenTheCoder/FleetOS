'use client';

import { Modal } from './Modal';
import { useStore } from '@/lib/store';

export function MaintModal({ open, onClose }:{ open:boolean; onClose:()=>void }) {
  const { vehicles, addMaint } = useStore();

  const save = () => {
    const id = 'WO-' + Math.floor(1000 + Math.random()*9000);
    const vehicle = (document.getElementById('maintVehicle') as HTMLSelectElement).value;
    const type = (document.getElementById('maintType') as HTMLSelectElement).value;
    const dueDate = (document.getElementById('maintDate') as HTMLInputElement).value || null;
    const dueOdo = parseInt((document.getElementById('maintOdo') as HTMLInputElement).value || '0',10) || null;
    const notes = (document.getElementById('maintNotes') as HTMLInputElement).value || '';
    addMaint({ id, vehicle, type, dueDate, dueOdo, status:'Open', notes });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-xl">
      <div className="flex items-start justify-between">
        <div className="text-2xl font-bold">Add Work Order</div>
        <button className="chip badge" onClick={onClose}>Close</button>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div><div className="label">Vehicle</div><select id="maintVehicle" className="input">{vehicles.map(v=> <option key={v.id}>{v.id}</option>)}</select></div>
        <div><div className="label">Type</div>
          <select id="maintType" className="input"><option>Oil Change</option><option>Brake Pads</option><option>Tire Rotation</option><option>Inspection</option><option>Other</option></select>
        </div>
        <div><div className="label">Due Date</div><input id="maintDate" type="date" className="input" /></div>
        <div><div className="label">Due Odometer (km)</div><input id="maintOdo" type="number" className="input" /></div>
        <div className="md:col-span-2"><div className="label">Notes</div><input id="maintNotes" className="input" placeholder="Any notes..." /></div>
      </div>
      <div className="mt-4 flex items-center justify-end gap-2"><button className="chip" onClick={save}>Save</button></div>
    </Modal>
  );
}