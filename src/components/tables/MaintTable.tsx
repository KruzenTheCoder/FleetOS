'use client';

import { useStore } from '@/lib/store';

export function MaintTable() {
  const { maint, updateMaint, removeMaint } = useStore();

  return (
    <div className="mt-2 max-h-[420px] overflow-auto thin-scroll">
      <table className="w-full min-w-[600px] text-sm">
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
          {maint.map(w=>{
            const due = w.dueDate ? new Date(w.dueDate).toLocaleDateString() : (w.dueOdo ? `${w.dueOdo} km` : '—');
            return (
              <tr key={w.id}>
                <td className="py-2">{w.id}</td>
                <td className="py-2">{w.vehicle}</td>
                <td className="py-2">{w.type}</td>
                <td className="py-2">{due}</td>
                <td className="py-2"><span className="chip badge"><span className="dot" style={{background:w.status==='Open'?'#FF9500':'#34C759'}}></span>{w.status}</span></td>
                <td className="py-2 text-right">
                  {w.status==='Open' && <button className="chip badge" onClick={()=>updateMaint(w.id, { status: 'Completed' })}>Done</button>}
                  <button className="chip badge" onClick={()=>removeMaint(w.id)}>Del</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}