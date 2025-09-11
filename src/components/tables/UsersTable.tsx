'use client';

import { useStore } from '@/lib/store';

export function UsersTable() {
  const { users, removeUser, setSettings } = useStore();
  return (
    <div className="space-y-2">
      {users.map((u,i)=>(
        <div key={u.email} className="flex items-center justify-between p-2 rounded-lg border border-slate-200">
          <div>
            <div className="font-semibold">{u.name}</div>
            <div className="text-slate-500 text-xs">{u.email}</div>
          </div>
          <div className="flex items-center gap-2">
            <select className="input" value={u.role} onChange={e=>{ users[i].role = e.target.value; }}>
              <option>Admin</option>
              <option>Manager</option>
              <option>Dispatcher</option>
              <option>Driver</option>
            </select>
            <button className="chip badge" onClick={()=>removeUser(u.email)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}