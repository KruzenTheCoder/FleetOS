'use client';

import { useStore } from '@/lib/store';

export function MaintTable() {
  const { maint, updateMaint, removeMaint } = useStore();

  return (
    <div className="mt-2 overflow-auto thin-scroll md:max-h-[420px]">
      <table className="w-full min-w-[600px] text-sm hidden sm:table">
        <thead className="text-slate-500 sticky top-0 bg-white/90 backdrop-blur">
          <tr>
            <th className="text-left font-semibold py-2">ID</th>
            <th className="text-left font-semibold py-2">Vehicle</th>
            <th className="text-left font-semibold py-2">Type</th>
            <th className="text-left font-semibold py-2">Due</th>
            <th className="text-left font-semibold py-2">Status</th>
            <th className="text-right font-semibold py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {maint.map((w) => {
            const due = w.dueDate
              ? new Date(w.dueDate).toLocaleDateString()
              : w.dueOdo
              ? `${w.dueOdo} km`
              : '—';
            return (
              <tr key={w.id}>
                <td className="py-2">{w.id}</td>
                <td className="py-2">{w.vehicle}</td>
                <td className="py-2">{w.type}</td>
                <td className="py-2">{due}</td>
                <td className="py-2">
                  <span className="chip badge">
                    <span
                      className="dot"
                      style={{ background: w.status === 'Open' ? '#FF9500' : '#34C759' }}
                    ></span>
                    {w.status}
                  </span>
                </td>
                <td className="py-2 text-right">
                  {w.status === 'Open' && (
                    <button
                      className="chip badge mr-1"
                      onClick={() => updateMaint(w.id, { status: 'Completed' })}
                    >
                      Done
                    </button>
                  )}
                  <button className="chip badge" onClick={() => removeMaint(w.id)}>
                    Del
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="sm:hidden space-y-2">
        {maint.map((w) => {
          const due = w.dueDate
            ? new Date(w.dueDate).toLocaleDateString()
            : w.dueOdo
            ? `${w.dueOdo} km`
            : '—';
          return (
            <div key={w.id} className="p-3 border border-slate-200 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="font-semibold">{w.vehicle}</span>
                <span className="chip badge text-xs">
                  <span
                    className="dot"
                    style={{ background: w.status === 'Open' ? '#FF9500' : '#34C759' }}
                  ></span>
                  {w.status}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-1">{w.type}</div>
              <div className="text-xs text-slate-500">{due}</div>
              <div className="mt-2 text-right">
                {w.status === 'Open' && (
                  <button
                    className="chip badge mr-1"
                    onClick={() => updateMaint(w.id, { status: 'Completed' })}
                  >
                    Done
                  </button>
                )}
                <button className="chip badge" onClick={() => removeMaint(w.id)}>
                  Del
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
