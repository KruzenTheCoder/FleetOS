'use client';

import { useState } from 'react';
import { FuelTable } from '@/components/tables/FuelTable';
import { FuelModal } from '@/components/modals/FuelModal';
import { csvDownload, formatCurrency } from '@/lib/utils';
import { useStore } from '@/lib/store';

export default function FuelPage() {
  const [open, setOpen] = useState(false);
  const { fuelTxns } = useStore();

const exportCSV = () => {
  const rows = [['ID','Date','Vehicle','Liters','Price/L','Total','Station','Odometer']];
  
  fuelTxns.forEach(t => {
    rows.push([
      String(t.id),
      new Date(t.dt).toLocaleString(),
      String(t.vehicle),
      String(t.liters),
      String(t.price),
      String(Math.round(t.total ?? t.liters * t.price)),
      String(t.station || ''),
      String(t.odo || '')
    ]);
  });

  csvDownload('fuel_transactions.csv', rows);
};


  const todaySpend = Math.round(fuelTxns.filter(t => new Date(t.dt).toDateString() === new Date().toDateString()).reduce((a,b)=> a + (b.total || b.liters*b.price), 0));
  const weekSpend = Math.round(fuelTxns.reduce((a,b)=> a + (b.total || b.liters*b.price), 0));
  const monthSpend = Math.round(weekSpend * 2.5);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="text-xl font-bold">Fuel</div>
        <div className="flex items-center gap-2">
          <button className="chip badge" onClick={() => setOpen(true)}>Add Transaction</button>
          <button className="chip badge" onClick={exportCSV}>Export CSV</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass p-4"><div className="text-slate-500 text-sm">Today Spend</div><div className="text-2xl font-bold">{formatCurrency(todaySpend)}</div></div>
        <div className="glass p-4"><div className="text-slate-500 text-sm">This Week</div><div className="text-2xl font-bold">{formatCurrency(weekSpend)}</div></div>
        <div className="glass p-4"><div className="text-slate-500 text-sm">This Month</div><div className="text-2xl font-bold">{formatCurrency(monthSpend)}</div></div>
      </div>

      <div className="glass p-5 w-full overflow-auto">
        <div className="flex items-center justify-between">
          <div className="font-semibold">Transactions</div>
        </div>
        <FuelTable />
      </div>

      <FuelModal open={open} onClose={()=>setOpen(false)} />
    </div>
  );
}