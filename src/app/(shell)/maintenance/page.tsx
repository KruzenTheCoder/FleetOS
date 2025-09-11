'use client';

import { MaintTable } from '@/components/tables/MaintTable';
import { MaintModal } from '@/components/modals/MaintModal';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { csvDownload } from '@/lib/utils';


export default function MaintenancePage() {
  const [open, setOpen] = useState(false);
  const { maint } = useStore();

  const exportCSV = () => {
  const rows = [['ID','Vehicle','Type','Due','Status','Notes']];
  maint.forEach(w => rows.push([w.id, w.vehicle, w.type, w.dueDate || w.dueOdo || '', w.status, w.notes || ''].map(String)));
  csvDownload('maintenance.csv', rows);
};

  const openCount = maint.filter(w=>w.status==='Open').length;
  const dueWeek = maint.filter(w=> w.status==='Open' && w.dueDate && (Math.ceil((+new Date(w.dueDate) - +new Date())/86400000) <= 7)).length;
  const completed = maint.filter(w=>w.status==='Completed').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold">Maintenance</div>
        <div className="flex items-center gap-2">
          <button className="chip badge" onClick={()=>setOpen(true)}>Add Work Order</button>
          <button className="chip badge" onClick={exportCSV}>Export CSV</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass p-4"><div className="text-slate-500 text-sm">Open</div><div className="text-2xl font-bold">{openCount}</div></div>
        <div className="glass p-4"><div className="text-slate-500 text-sm">Due This Week</div><div className="text-2xl font-bold">{dueWeek}</div></div>
        <div className="glass p-4"><div className="text-slate-500 text-sm">Completed (30d)</div><div className="text-2xl font-bold">{completed}</div></div>
      </div>

      <div className="glass p-5">
        <div className="font-semibold">Work Orders</div>
        <MaintTable />
      </div>

      <MaintModal open={open} onClose={()=>setOpen(false)} />
    </div>
  );
}