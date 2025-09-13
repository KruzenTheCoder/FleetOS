'use client';

import { Modal } from './Modal';
import { useStore } from '@/lib/store';

export function AddUserModal({ open, onClose }:{ open:boolean; onClose:()=>void }) {
  const { addUser } = useStore();

  const save = () => {
    const name = (document.getElementById('auName') as HTMLInputElement).value.trim() || 'New User';
    const email = (document.getElementById('auEmail') as HTMLInputElement).value.trim() || 'user@fleet.co.za';
    const role = (document.getElementById('auRole') as HTMLSelectElement).value || 'Dispatcher';
    const phone = (document.getElementById('auPhone') as HTMLInputElement).value.trim() || '';
    addUser({ name, email, role, phone });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-md sm:max-w-xl">
      <div className="flex items-start justify-between">
        <div className="text-xl sm:text-2xl font-bold">Add User</div>
        <button className="chip badge" onClick={onClose}>Close</button>
      </div>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div><div className="label">Name</div><input id="auName" className="input" placeholder="Anele Nkosi" /></div>
        <div><div className="label">Email</div><input id="auEmail" type="email" className="input" placeholder="anele@fleet.co.za" /></div>
        <div><div className="label">Role</div>
          <select id="auRole" className="input">
            <option>Dispatcher</option><option>Manager</option><option>Driver</option><option>Admin</option>
          </select>
        </div>
        <div><div className="label">Phone</div><input id="auPhone" className="input" placeholder="+27 82 123 4567" /></div>
      </div>
      <div className="mt-4 flex items-center justify-end gap-2">
        <button className="chip" onClick={save}>
          Save
        </button>
      </div>
    </Modal>
  );
}