'use client';

import { useState, useMemo } from 'react';
import { useStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { FuelModal } from '@/components/modals/FuelModal';

export function FuelTable() {
  const { fuelTxns } = useStore();
  const [query, setQuery] = useState('');
  const [editId, setEditId] = useState<string | null>(null);

  const list = useMemo(() => {
    const q = query.toLowerCase().trim();
    return fuelTxns
      .filter(
        (t) =>
          !q ||
          t.vehicle.toLowerCase().includes(q) ||
          (t.station || '').toLowerCase().includes(q)
      )
      .sort((a, b) => +new Date(b.dt) - +new Date(a.dt));
  }, [fuelTxns, query]);

  return (
    <>
      <div className="flex items-center justify-between mt-2">
        <div className="relative flex-1 md:flex-none">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search vehicle/station..."
            className="pl-3 pr-3 py-2 rounded-xl bg-slate-100 focus:bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand/40 transition w-full md:w-64"
          />
        </div>
      </div>
      <div className="mt-2 overflow-auto thin-scroll md:max-h-[400px]">
        <table className="w-full min-w-[700px] text-sm hidden sm:table">
          <thead className="text-slate-500 sticky top-0 bg-white/90 backdrop-blur">
            <tr>
              <th className="text-left font-semibold py-2">Date</th>
              <th className="text-left font-semibold py-2">Vehicle</th>
              <th className="text-right font-semibold py-2">Liters</th>
              <th className="text-right font-semibold py-2">Price/L</th>
              <th className="text-right font-semibold py-2">Total</th>
              <th className="text-left font-semibold py-2">Station</th>
              <th className="text-right font-semibold py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((t) => {
              const total = t.total ?? t.liters * t.price;
              return (
                <tr key={t.id}>
                  <td className="py-2">{new Date(t.dt).toLocaleString()}</td>
                  <td className="py-2">{t.vehicle}</td>
                  <td className="py-2 text-right">{t.liters.toFixed(1)}</td>
                  <td className="py-2 text-right">{formatCurrency(t.price)}</td>
                  <td className="py-2 text-right">{formatCurrency(total)}</td>
                  <td className="py-2">{t.station || '—'}</td>
                  <td className="py-2 text-right">
                    <button className="chip badge" onClick={() => setEditId(t.id)}>Edit</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="sm:hidden space-y-2">
          {list.map((t) => {
            const total = t.total ?? t.liters * t.price;
            return (
              <div key={t.id} className="p-3 border border-slate-200 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">{t.vehicle}</span>
                  <span>{new Date(t.dt).toLocaleDateString()}</span>
                </div>
                <div className="mt-1 text-xs text-slate-500 flex justify-between">
                  <span>{t.station || '—'}</span>
                  <span>
                    {t.liters.toFixed(1)}L @ {formatCurrency(t.price)}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-semibold">{formatCurrency(total)}</span>
                  <button className="chip badge" onClick={() => setEditId(t.id)}>
                    Edit
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <FuelModal open={!!editId} onClose={() => setEditId(null)} editId={editId || undefined} />
    </>
  );
}
