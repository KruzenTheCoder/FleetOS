'use client';

import { create } from 'zustand';
import type {
  Vehicle,
  Route,
  FuelTxn,
  WorkOrder,
  Settings,
  FeedItem,
  User,
} from './types';
import { supabase } from './supabaseClient';

const defaultSettings: Settings = {
  units: 'metric',
  currency: 'ZAR',
  tz: 'Africa/Johannesburg',
  liveDataDefault: 'on',
  refreshRate: 10,
};

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
  loadVehicles: () => Promise<void>;
  addVehicle: (v: Vehicle) => Promise<void>;
  updateVehicle: (id: string, p: Partial<Vehicle>) => Promise<void>;
  removeVehicle: (id: string) => Promise<void>;
  loadUsers: () => Promise<void>;
  addUser: (u: User) => Promise<void>;
  removeUser: (email: string) => Promise<void>;
  loadFuel: () => Promise<void>;
  addFuel: (t: FuelTxn) => Promise<void>;
  updateFuel: (id: string, p: Partial<FuelTxn>) => Promise<void>;
  removeFuel: (id: string) => Promise<void>;
  loadMaint: () => Promise<void>;
  addMaint: (w: WorkOrder) => Promise<void>;
  updateMaint: (id: string, p: Partial<WorkOrder>) => Promise<void>;
  removeMaint: (id: string) => Promise<void>;
  loadRoutes: () => Promise<void>;
  addRoute: (r: Route) => Promise<void>;
  removeRoute: (id: string) => Promise<void>;
  pushFeed: (e: FeedItem) => void;
  setToday: (
    p: Partial<Pick<State, 'todayKm' | 'todayFuelSpend' | 'todayAvgSpeed'>>
  ) => void;
  setLiveData: (b: boolean) => void;
  setFilter: (f: State['statusFilter']) => void;
  setSearch: (q: string) => void;
};

export const useStore = create<State & Actions>((set, get) => ({
  settings: defaultSettings,
  vehicles: [],
  routes: [],
  users: [],
  fuelTxns: [],
  maint: [],
  feed: [],
  todayKm: 0,
  todayFuelSpend: 0,
  todayAvgSpeed: 0,
  liveData: defaultSettings.liveDataDefault === 'on',
  statusFilter: 'All',
  searchQuery: '',

  setSettings: (p) => set((s) => ({ settings: { ...s.settings, ...p } })),
  loadVehicles: async () => {
    const { data } = await supabase.from('vehicles').select();
    set({ vehicles: data || [] });
  },
  addVehicle: async (v) => {
    await supabase.from('vehicles').insert(v);
    set((s) => ({ vehicles: [...s.vehicles, v] }));
  },
  updateVehicle: async (id, p) => {
    await supabase.from('vehicles').update(p).eq('id', id);
    set((s) => ({
      vehicles: s.vehicles.map((v) => (v.id === id ? { ...v, ...p } : v)),
    }));
  },
  removeVehicle: async (id) => {
    await supabase.from('vehicles').delete().eq('id', id);
    set((s) => ({ vehicles: s.vehicles.filter((v) => v.id !== id) }));
  },
  loadUsers: async () => {
    const { data } = await supabase.from('users').select();
    set({ users: data || [] });
  },
  addUser: async (u) => {
    await supabase.from('users').insert(u);
    set((s) => ({ users: [...s.users, u] }));
  },
  removeUser: async (email) => {
    await supabase.from('users').delete().eq('email', email);
    set((s) => ({ users: s.users.filter((u) => u.email !== email) }));
  },
  loadFuel: async () => {
    const { data } = await supabase.from('fuel_txns').select();
    set({ fuelTxns: data || [] });
  },
  addFuel: async (t) => {
    await supabase.from('fuel_txns').insert(t);
    set((s) => ({ fuelTxns: [...s.fuelTxns, t] }));
  },
  updateFuel: async (id, p) => {
    await supabase.from('fuel_txns').update(p).eq('id', id);
    set((s) => ({
      fuelTxns: s.fuelTxns.map((t) => (t.id === id ? { ...t, ...p } : t)),
    }));
  },
  removeFuel: async (id) => {
    await supabase.from('fuel_txns').delete().eq('id', id);
    set((s) => ({ fuelTxns: s.fuelTxns.filter((t) => t.id !== id) }));
  },
  loadMaint: async () => {
    const { data } = await supabase.from('work_orders').select();
    set({ maint: data || [] });
  },
  addMaint: async (w) => {
    await supabase.from('work_orders').insert(w);
    set((s) => ({ maint: [...s.maint, w] }));
  },
  updateMaint: async (id, p) => {
    await supabase.from('work_orders').update(p).eq('id', id);
    set((s) => ({
      maint: s.maint.map((w) => (w.id === id ? { ...w, ...p } : w)),
    }));
  },
  removeMaint: async (id) => {
    await supabase.from('work_orders').delete().eq('id', id);
    set((s) => ({ maint: s.maint.filter((w) => w.id !== id) }));
  },
  loadRoutes: async () => {
    const { data } = await supabase.from('routes').select();
    set({ routes: data || [] });
  },
  addRoute: async (r) => {
    await supabase.from('routes').insert(r);
    set((s) => ({ routes: [...s.routes, r] }));
  },
  removeRoute: async (id) => {
    await supabase.from('routes').delete().eq('id', id);
    set((s) => ({ routes: s.routes.filter((r) => r.id !== id) }));
  },
  pushFeed: (e) => set((s) => ({ feed: [e, ...s.feed].slice(0, 80) })),
  setToday: (p) => set((s) => ({ ...s, ...p })),
  setLiveData: (b) => set({ liveData: b }),
  setFilter: (f) => set({ statusFilter: f }),
  setSearch: (q) => set({ searchQuery: q }),
}));
