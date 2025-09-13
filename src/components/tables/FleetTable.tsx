'use client';

import { useMemo, useState } from 'react';
import { useStore } from '@/lib/store';
import { COLORS } from '@/lib/utils';
import { VehicleModal } from '@/components/modals/VehicleModal';

interface FleetTableProps {
  className?: string;
}

export function FleetTable({ className }: FleetTableProps) {
  const { vehicles, statusFilter, searchQuery } = useStore();
  const [openId, setOpenId] = useState<string | null>(null);

  const list = useMemo(() => {
    const q = (searchQuery || '').toLowerCase().trim();
    return vehicles
      .filter((v) => statusFilter === 'All' || v.status === statusFilter)
      .filter(
        (v) =>
          !q ||
          v.id.toLowerCase().includes(q) ||
          v.driver.toLowerCase().includes(q) ||
          v.status.toLowerCase().includes(q)
      );
  }, [vehicles, statusFilter, searchQuery]);

  return (
    <>
      <div
        className={`mt-1 overflow-auto thin-scroll md:max-h-[540px] ${
          className || ''
        }`}
      >
        <table className="w-full text-sm hidden sm:table">
          <thead className="text-slate-500 sticky top-0 bg-white/90 backdrop-blur">
            <tr>
              <th className="text-left font-semibold py-2">Vehicle</th>
              <th className="text-left font-semibold py-2">Driver</th>
              <th className="text-left font-semibold py-2">Status</th>
              <th className="text-left font-semibold py-2">Route</th>
              <th className="text-right font-semibold py-2">Fuel</th>
              <th className="text-right font-semibold py-2">Speed</th>
            </tr>
          </thead>
          <tbody>
            {list.map((v) => {
              const color = (COLORS as any)[v.status] ?? '#0f172a';
              return (
                <tr
                  key={v.id}
                  className="table-row cursor-pointer"
                  onClick={() => setOpenId(v.id)}
                >
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: color }}
                      ></span>
                      <div className="font-semibold">{v.id}</div>
                    </div>
                  </td>
                  <td className="py-2">{v.driver}</td>
                  <td className="py-2">
                    <span className="chip badge">
                      <span
                        className="dot"
                        style={{ background: color }}
                      ></span>
                      {v.status}
                    </span>
                  </td>
                  <td className="py-2">{v.routeId || '—'}</td>
                  <td className="py-2 text-right">{Math.round(v.fuel)}%</td>
                  <td className="py-2 text-right">{Math.round(v.speed)} km/h</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="sm:hidden space-y-2">
          {list.map((v) => {
            const color = (COLORS as any)[v.status] ?? '#0f172a';
            return (
              <div
                key={v.id}
                className="p-3 border border-slate-200 rounded-lg flex justify-between items-center"
                onClick={() => setOpenId(v.id)}
              >
                <div>
                  <div className="font-semibold flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: color }}
                    ></span>
                    {v.id}
                  </div>
                  <div className="text-xs text-slate-500">{v.driver}</div>
                </div>
                <div className="text-right text-xs">
                  <div className="chip badge mb-1 inline-flex">
                    <span
                      className="dot"
                      style={{ background: color }}
                    ></span>
                    {v.status}
                  </div>
                  <div className="text-slate-500">
                    {Math.round(v.fuel)}% • {Math.round(v.speed)} km/h
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <VehicleModal vehicleId={openId} onClose={() => setOpenId(null)} />
    </>
  );
}
