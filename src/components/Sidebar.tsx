'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import { IoCubeOutline, IoCarOutline, IoNavigateOutline, IoFlameOutline, IoConstructOutline, IoPeopleOutline, IoAnalyticsOutline, IoSettingsOutline, IoSpeedometerOutline } from 'react-icons/io5';
import { useState } from 'react';
import { AddVehicleModal } from '@/components/modals/AddVehicleModal';
import { AddUserModal } from '@/components/modals/AddUserModal';

export function Sidebar() {
  const pathname = usePathname();
  const { vehicles } = useStore();
  const [vehicleOpen, setVehicleOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const link = (href:string, label:string, icon:React.ReactNode) => {
    const active = pathname.startsWith(href);
    return (
      <Link href={href} className={`flex items-center gap-3 px-3 py-2 rounded-xl ${active ? 'bg-slate-100/80 text-slate-900 font-semibold nav-active' : 'text-slate-600 hover:bg-slate-100'}`}>
        {icon}{label}
      </Link>
    );
  };

  const online = vehicles.filter(v => v.status !== 'Maintenance').length;

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <div className="grad w-10 h-10 rounded-2xl flex items-center justify-center shadow-soft">
          <IoCubeOutline className="text-brand text-2xl" />
        </div>
        <div>
          <div className="text-xl font-bold">FleetOS</div>
          <div className="text-sm text-slate-500">Live Fleet Command</div>
        </div>
      </div>
      <nav className="space-y-1" id="sideNav">
        {link('/dashboard', 'Dashboard', <IoSpeedometerOutline />)}
        {link('/fleet', 'Fleet', <IoCarOutline />)}
        {link('/routes', 'Routes', <IoNavigateOutline />)}
        {link('/fuel', 'Fuel', <IoFlameOutline />)}
        {link('/maintenance', 'Maintenance', <IoConstructOutline />)}
        {link('/users', 'Users', <IoPeopleOutline />)}
        {link('/reports', 'Reports', <IoAnalyticsOutline />)}
        {link('/settings', 'Settings', <IoSettingsOutline />)}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="glass p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold">Fleet Summary</div>
            <span className="chip badge"><span className="dot" style={{ background: 'var(--brand)' }}></span>Live</span>
          </div>
          <div className="text-sm text-slate-600">{vehicles.length} Vehicles • {online} Online</div>
        </div>
        <button
          className="w-full bg-brand text-white font-semibold py-2.5 rounded-xl shadow-soft hover:brightness-95 transition"
          onClick={() => setVehicleOpen(true)}
        >
          Add Vehicle
        </button>
        <button
          className="w-full bg-slate-900 text-white font-semibold py-2.5 rounded-xl shadow-soft hover:brightness-95 transition"
          onClick={() => setUserOpen(true)}
        >
          Add User
        </button>
      </div>

      <AddVehicleModal open={vehicleOpen} onClose={() => setVehicleOpen(false)} />
      <AddUserModal open={userOpen} onClose={() => setUserOpen(false)} />
    </>
  );
}