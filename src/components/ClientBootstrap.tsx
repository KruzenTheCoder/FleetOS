'use client';

import { useEffect } from 'react';
import { useSimulation } from '@/lib/simulation';
import { useStore } from '@/lib/store';

export default function ClientBootstrap() {
  const { loadVehicles, loadRoutes, loadUsers, loadFuel, loadMaint } = useStore();

  useEffect(() => {
    loadVehicles();
    loadRoutes();
    loadUsers();
    loadFuel();
    loadMaint();
  }, [loadVehicles, loadRoutes, loadUsers, loadFuel, loadMaint]);

  useSimulation();
  return null;
}