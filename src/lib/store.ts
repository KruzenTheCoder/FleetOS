'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Vehicle, Route, FuelTxn, WorkOrder, Settings, FeedItem, User } from './types';
import { seedVehicles, seedRoutes, seedUsers, seedFuel, seedMaint, defaultSettings } from './seed';

type State = {
  settings: Settings;
  vehicles: Vehicle[];
  routes: Route[];
  users: User[];
  fuelTxns: FuelTxn[];
  maint: WorkOrder[];
  feed: FeedItem[];
  todayKm: number;
  todayFuelSpend: number;
  todayAvgSpeed: number;
  liveData: boolean;
  statusFilter: 'All' | Vehicle['status'];
  searchQuery: string;
};

type Actions = {
  setSettings: (p: Partial<Settings>) => void;
  addVehicle: (v: Vehicle) => void;
  updateVehicle: (id: string, p: Partial<Vehicle>) => void;
  removeVehicle: (id: string) => void;
  addUser: (u: User) => void;
  removeUser: (email: string) => void;
  addFuel: (t: FuelTxn) => void;
  updateFuel: (id: string, p: Partial<FuelTxn>) => void;
  removeFuel: (id: string) => void;
  addMaint: (w: WorkOrder) => void;
  updateMaint: (id: string, p: Partial<WorkOrder>) => void;
  removeMaint: (id: string) => void;
  addRoute: (r: Route) => void;
  removeRoute: (id: string) => void;
  pushFeed: (e: FeedItem) => void;
  setToday: (p: Partial<Pick<State,'todayKm'|'todayFuelSpend'|'todayAvgSpeed'>>) => void;
  setLiveData: (b: boolean) => void;
  setFilter: (f: State['statusFilter']) => void;
  setSearch: (q: string) => void;
};

export const useStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      vehicles: seedVehicles(),
      routes: seedRoutes(),
      users: seedUsers(),
      fuelTxns: seedFuel(),
      maint: seedMaint(),
      feed: [],
      todayKm: 2134,
      todayFuelSpend: 2410,
      todayAvgSpeed: 52,
      liveData: defaultSettings.liveDataDefault === 'on',
      statusFilter: 'All',
      searchQuery: '',

      setSettings: (p) => set(s => ({ settings: { ...s.settings, ...p } })),
      addVehicle: (v) => set(s => ({ vehicles: [...s.vehicles, v] })),
      updateVehicle: (id, p) => set(s => ({ vehicles: s.vehicles.map(v => v.id===id? {...v, ...p}: v) })),
      removeVehicle: (id) => set(s => ({ vehicles: s.vehicles.filter(v => v.id!==id) })),
      addUser: (u) => set(s => ({ users: [...s.users, u] })),
      removeUser: (email) => set(s => ({ users: s.users.filter(u => u.email !== email) })),
      addFuel: (t) => set(s => ({ fuelTxns: [...s.fuelTxns, t] })),
      updateFuel: (id, p) => set(s => ({ fuelTxns: s.fuelTxns.map(t => t.id===id? {...t, ...p}: t) })),
      removeFuel: (id) => set(s => ({ fuelTxns: s.fuelTxns.filter(t => t.id!==id) })),
      addMaint: (w) => set(s => ({ maint: [...s.maint, w] })),
      updateMaint: (id, p) => set(s => ({ maint: s.maint.map(w => w.id===id? {...w, ...p}: w) })),
      removeMaint: (id) => set(s => ({ maint: s.maint.filter(w => w.id!==id) })),
      addRoute: (r) => set(s => ({ routes: [...s.routes, r] })),
      removeRoute: (id) => set(s => ({ routes: s.routes.filter(r => r.id!==id) })),
      pushFeed: (e) => set(s => ({ feed: [e, ...s.feed].slice(0, 80) })),
      setToday: (p) => set(s => ({ ...s, ...p })),
      setLiveData: (b) => set({ liveData: b }),
      setFilter: (f) => set({ statusFilter: f }),
      setSearch: (q) => set({ searchQuery: q }),
    }),
    { name: 'fleetos_state' }
  )
);