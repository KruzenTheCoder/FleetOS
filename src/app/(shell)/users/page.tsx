'use client';

import { UsersTable } from '@/components/tables/UsersTable';
import { AddUserModal } from '@/components/modals/AddUserModal';
import { useState } from 'react';

export default function UsersPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold">Users & Roles</div>
        <button className="chip badge" onClick={()=>setOpen(true)}>Add User</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass p-5 lg:col-span-2">
          <UsersTable />
        </div>
        <div className="glass p-5">
          <div className="font-semibold">Roles</div>
          <div className="mt-3 text-sm space-y-2">
            <div className="flex items-center justify-between p-2 rounded-lg border border-slate-200"><div>Admin</div><span className="chip badge">Full Access</span></div>
            <div className="flex items-center justify-between p-2 rounded-lg border border-slate-200"><div>Manager</div><span className="chip badge">Most</span></div>
            <div className="flex items-center justify-between p-2 rounded-lg border border-slate-200"><div>Dispatcher</div><span className="chip badge">Ops</span></div>
            <div className="flex items-center justify-between p-2 rounded-lg border border-slate-200"><div>Driver</div><span className="chip badge">Limited</span></div>
          </div>
        </div>
      </div>

      <AddUserModal open={open} onClose={()=>setOpen(false)} />
    </div>
  );
}