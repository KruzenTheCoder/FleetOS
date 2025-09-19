"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Vehicle, Route, FuelTxn, WorkOrder, Settings, FeedItem, User } from "./types";
import { seedVehicles, seedRoutes, seedUsers, seedFuel, seedMaint, defaultSettings } from "./seed";

type BaseState = {
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
  statusFilter: "All" | Vehicle["status"];
  searchQuery: string;
  currentUser: User | null;
  seeded: boolean;
  isBootstrapped: boolean;
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
  setToday: (p: Partial<Pick<BaseState, "todayKm" | "todayFuelSpend" | "todayAvgSpeed">>) => void;
  setLiveData: (b: boolean) => void;
  setFilter: (f: BaseState["statusFilter"]) => void;
  setSearch: (q: string) => void;
  hydrate: (payload: BootstrapPayload) => void;
  setCurrentUser: (user: User | null) => void;
  logout: () => void;
};

type BootstrapPayload = {
  vehicles?: Vehicle[];
  routes?: Route[];
  users?: User[];
  fuelTxns?: FuelTxn[];
  maint?: WorkOrder[];
  settings?: Settings;
  seeded?: boolean;
};

const defaultAdmin: User = {
  name: "Admin User",
  role: "Administrator",
  email: "admin@fleetos.local",
};

function createInitialState(): BaseState {
  const routes = seedRoutes();
  const vehicles = seedVehicles(routes);
  const users = seedUsers();
  return {
    settings: { ...defaultSettings },
    vehicles,
    routes,
    users,
    fuelTxns: seedFuel(),
    maint: seedMaint(),
    feed: [],
    todayKm: 2134,
    todayFuelSpend: 2410,
    todayAvgSpeed: 52,
    liveData: defaultSettings.liveDataDefault === "on",
    statusFilter: "All",
    searchQuery: "",
    currentUser: users.find((user) => /admin/i.test(user.role)) ?? defaultAdmin,
    seeded: false,
    isBootstrapped: false,
  };
}

export const useStore = create<BaseState & Actions>()(
  persist(
    (set, _get) => ({
      ...createInitialState(),
      setSettings: (p) => set((state) => ({ settings: { ...state.settings, ...p } })),
      addVehicle: (v) => set((state) => ({ vehicles: [...state.vehicles, v] })),
      updateVehicle: (id, p) =>
        set((state) => ({
          vehicles: state.vehicles.map((vehicle) => (vehicle.id === id ? { ...vehicle, ...p } : vehicle)),
        })),
      removeVehicle: (id) => set((state) => ({ vehicles: state.vehicles.filter((vehicle) => vehicle.id !== id) })),
      addUser: (u) => set((state) => ({ users: [...state.users, u] })),
      removeUser: (email) => set((state) => ({ users: state.users.filter((user) => user.email !== email) })),
      addFuel: (t) => set((state) => ({ fuelTxns: [...state.fuelTxns, t] })),
      updateFuel: (id, p) =>
        set((state) => ({
          fuelTxns: state.fuelTxns.map((txn) => (txn.id === id ? { ...txn, ...p } : txn)),
        })),
      removeFuel: (id) => set((state) => ({ fuelTxns: state.fuelTxns.filter((txn) => txn.id !== id) })),
      addMaint: (w) => set((state) => ({ maint: [...state.maint, w] })),
      updateMaint: (id, p) =>
        set((state) => ({
          maint: state.maint.map((order) => (order.id === id ? { ...order, ...p } : order)),
        })),
      removeMaint: (id) => set((state) => ({ maint: state.maint.filter((order) => order.id !== id) })),
      addRoute: (r) => set((state) => ({ routes: [...state.routes, r] })),
      removeRoute: (id) => set((state) => ({ routes: state.routes.filter((route) => route.id !== id) })),
      pushFeed: (e) => set((state) => ({ feed: [e, ...state.feed].slice(0, 80) })),
      setToday: (p) => set((state) => ({ ...state, ...p })),
      setLiveData: (b) => set({ liveData: b }),
      setFilter: (f) => set({ statusFilter: f }),
      setSearch: (q) => set({ searchQuery: q }),
      hydrate: (payload) => {
        set((state) => {
          const updates: Partial<BaseState> = {};
          if (payload.routes) updates.routes = payload.routes;
          if (payload.vehicles) updates.vehicles = payload.vehicles;
          if (payload.fuelTxns) updates.fuelTxns = payload.fuelTxns;
          if (payload.maint) updates.maint = payload.maint;
          if (payload.settings) {
            updates.settings = { ...state.settings, ...payload.settings };
            updates.liveData = payload.settings.liveDataDefault === "on";
          }
          if (payload.users) {
            updates.users = payload.users;
            if (payload.users.length === 0) {
              updates.currentUser = null;
            } else if (!state.currentUser || !payload.users.some((user) => user.email === state.currentUser?.email)) {
              updates.currentUser =
                payload.users.find((user) => /admin/i.test(user.role)) ?? payload.users[0];
            }
          }
          if (payload.seeded !== undefined) {
            updates.seeded = payload.seeded;
          }
          updates.isBootstrapped = true;
          return { ...state, ...updates };
        });
      },
      setCurrentUser: (user) => set({ currentUser: user }),
      logout: () => {
        const base = createInitialState();
        set((state) => ({
          ...state,
          ...base,
          currentUser: null,
        }));
      },
    }),
    {
      name: "fleetos_state",
      version: 2,
    },
  ),
);