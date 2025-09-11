'use client';

import { Modal } from './Modal';
import { useStore } from '@/lib/store';
import { makeRoutePath } from '@/lib/utils';

export function RouteDrawModal({ open, onClose }:{ open:boolean; onClose:()=>void }) {
  const { addRoute } = useStore();

  const save = () => {
    const name = (document.getElementById('rdName') as HTMLInputElement).value.trim();
    if (!name) { alert('Please enter a route name'); return; }
    const waypointsEls = Array.from(document.querySelectorAll('.waypoint-input')) as HTMLInputElement[];
    const waypoints = waypointsEls.map((input, i)=>({
      lat: -30 + (Math.random() * 10),
      lng: 20 + (Math.random() * 10),
      address: input.value.trim() || (i===0?'Start':'Stop')
    }));
    if (waypoints.length < 2) { alert('Please add at least 2 addresses'); return; }
    const points:any[] = [];
    for (let i=0;i<waypoints.length-1;i++){
      const segment = makeRoutePath([waypoints[i], waypoints[i+1]], 20);
      points.push(...segment);
    }
    const id = 'R' + Math.floor(100 + Math.random()*900);
    const color = '#0A84FF';
    addRoute({ id, name, color, points, waypoints });
    onClose();
    alert('Route saved successfully!');
  };

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-2xl">
      <div className="flex items-start justify-between">
        <div className="text-2xl font-bold">Create New Route</div>
        <button className="chip badge" onClick={onClose}>Close</button>
      </div>

      <div className="mt-4">
        <div className="label">Route Name</div>
        <input id="rdName" className="input mb-4" placeholder="Enter route name" />
        <div className="label">Waypoints</div>
        <div id="waypointsContainer" className="mb-4 space-y-2">
          <div className="waypoint-item"><input type="text" className="waypoint-input input" placeholder="Start address" /></div>
          <div className="waypoint-item"><input type="text" className="waypoint-input input" placeholder="Destination address" /></div>
        </div>
        <button className="chip mb-4" onClick={()=>{
          const container = document.getElementById('waypointsContainer')!;
          const item = document.createElement('div');
          item.className = 'waypoint-item';
          item.innerHTML = `<input type="text" class="waypoint-input input" placeholder="Stop" /> <span class="remove-btn text-red-500 cursor-pointer">Remove</span>`;
          container.appendChild(item);
          item.querySelector('.remove-btn')?.addEventListener('click', ()=> container.removeChild(item));
        }}>Add Stop</button>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button className="chip" onClick={onClose}>Cancel</button>
          <button className="chip" onClick={save}>Save Route</button>
        </div>
      </div>
    </Modal>
  );
}