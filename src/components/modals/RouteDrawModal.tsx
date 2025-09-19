"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Modal } from "./Modal";
import { useStore } from "@/lib/store";
import { makeRoutePath } from "@/lib/utils";
import type { LatLng } from "@/lib/types";

type GeocodeSuggestion = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

type WaypointState = {
  id: string;
  query: string;
  location: GeocodeSuggestion | null;
  suggestions: GeocodeSuggestion[];
  loading: boolean;
};

const MIN_QUERY_LENGTH = 3;
const SUGGESTION_DEBOUNCE = 350;

const createId = () =>
  (typeof globalThis !== "undefined" && globalThis.crypto?.randomUUID
    ? globalThis.crypto.randomUUID()
    : Math.random().toString(36).slice(2));

const createWaypoint = (): WaypointState => ({
  id: createId(),
  query: "",
  location: null,
  suggestions: [],
  loading: false,
});

const computeLabel = (index: number, total: number) => {
  if (index === 0) return "Start address";
  if (index === total - 1) return "Destination";
  return `Stop ${index}`;
};

export function RouteDrawModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addRoute } = useStore();
  const [routeName, setRouteName] = useState("");
  const [waypoints, setWaypoints] = useState<WaypointState[]>(() => [createWaypoint(), createWaypoint()]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const timersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const abortControllers = useRef<Record<string, AbortController>>({});

  const resetState = useCallback(() => {
    setRouteName("");
    setError(null);
    setSaving(false);
    setWaypoints([createWaypoint(), createWaypoint()]);
  }, []);

  useEffect(() => {
    if (open) {
      resetState();
    } else {
      Object.values(timersRef.current).forEach((timer) => clearTimeout(timer));
      timersRef.current = {};
      Object.values(abortControllers.current).forEach((controller) => controller.abort());
      abortControllers.current = {};
    }
  }, [open, resetState]);

  const fetchSuggestions = useCallback(async (id: string, query: string) => {
    abortControllers.current[id]?.abort();
    const controller = new AbortController();
    abortControllers.current[id] = controller;

    try {
      const response = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`, { signal: controller.signal });
      if (!response.ok) throw new Error("Failed to fetch suggestions");

      const payload = (await response.json()) as { results: GeocodeSuggestion[] };
      const suggestions = payload.results ?? [];

      setWaypoints((prev) =>
        prev.map((waypoint) =>
          waypoint.id === id ? { ...waypoint, suggestions, loading: false } : waypoint,
        ),
      );
    } catch (err) {
      if (controller.signal.aborted) return;
      console.error("[RouteDrawModal] geocode error", err);
      setWaypoints((prev) =>
        prev.map((waypoint) =>
          waypoint.id === id ? { ...waypoint, suggestions: [], loading: false } : waypoint,
        ),
      );
    }
  }, []);

  const scheduleSuggestions = useCallback(
    (id: string, query: string) => {
      if (timersRef.current[id]) {
        clearTimeout(timersRef.current[id]);
      }

      if (query.trim().length < MIN_QUERY_LENGTH) {
        setWaypoints((prev) =>
          prev.map((waypoint) =>
            waypoint.id === id ? { ...waypoint, suggestions: [], loading: false } : waypoint,
          ),
        );
        return;
      }

      setWaypoints((prev) =>
        prev.map((waypoint) =>
          waypoint.id === id ? { ...waypoint, loading: true } : waypoint,
        ),
      );

      timersRef.current[id] = setTimeout(() => {
        fetchSuggestions(id, query);
      }, SUGGESTION_DEBOUNCE);
    },
    [fetchSuggestions],
  );

  const handleQueryChange = useCallback(
    (id: string, value: string) => {
      setWaypoints((prev) =>
        prev.map((waypoint) =>
          waypoint.id === id
            ? { ...waypoint, query: value, location: null }
            : waypoint,
        ),
      );
      setError(null);
      scheduleSuggestions(id, value);
    },
    [scheduleSuggestions],
  );

  const handleSuggestionSelect = useCallback((id: string, suggestion: GeocodeSuggestion) => {
    setWaypoints((prev) =>
      prev.map((waypoint) =>
        waypoint.id === id
          ? { ...waypoint, query: suggestion.name, location: suggestion, suggestions: [], loading: false }
          : waypoint,
      ),
    );
  }, []);

  const handleAddStop = useCallback(() => {
    setWaypoints((prev) => {
      const clone = [...prev];
      clone.splice(clone.length - 1, 0, createWaypoint());
      return clone;
    });
  }, []);

  const handleRemoveWaypoint = useCallback((id: string) => {
    setWaypoints((prev) => {
      if (prev.length <= 2) return prev;
      const index = prev.findIndex((w) => w.id === id);
      if (index === 0 || index === prev.length - 1) return prev;
      return prev.filter((w) => w.id !== id);
    });
  }, []);

  const canSave = useMemo(() => {
    const confirmed = waypoints.filter((waypoint) => waypoint.location);
    return confirmed.length >= 2 && !saving;
  }, [waypoints, saving]);

  const handleSave = useCallback(() => {
    const confirmed = waypoints.filter((waypoint) => waypoint.location);

    if (confirmed.length < 2) {
      setError("Please select at least a start and destination address.");
      return;
    }

    const finalName =
      routeName.trim() ||
      `${confirmed[0].location?.name ?? "Route"} -> ${confirmed[confirmed.length - 1].location?.name ?? ""}`;

    setSaving(true);
    try {
      const latLngs: LatLng[] = confirmed.map((waypoint) => ({
        lat: waypoint.location!.lat,
        lng: waypoint.location!.lng,
      }));

      const path: LatLng[] = [];
      for (let i = 0; i < latLngs.length - 1; i += 1) {
        const segment = makeRoutePath([latLngs[i], latLngs[i + 1]], 40);
        path.push(...segment);
      }

      const id = `R${Math.floor(100 + Math.random() * 900)}`;
      addRoute({
        id,
        name: finalName,
        color: "#0A84FF",
        points: path,
        waypoints: confirmed.map((waypoint) => ({
          lat: waypoint.location!.lat,
          lng: waypoint.location!.lng,
          address: waypoint.location!.name,
        })),
      });

      onClose();
    } finally {
      setSaving(false);
    }
  }, [addRoute, waypoints, routeName, onClose]);

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-2xl">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-2xl font-bold">Create New Route</div>
          <p className="text-sm text-slate-500 mt-1">Search precise addresses to build the path between stops.</p>
        </div>
        <button type="button" className="chip badge" onClick={onClose}>
          Close
        </button>
      </div>

      <div className="mt-4 space-y-5">
        <div>
          <div className="label">Route name</div>
          <input
            className="input mt-1"
            placeholder="Cape Town logistics run"
            value={routeName}
            onChange={(event) => setRouteName(event.target.value)}
          />
        </div>

        <div>
          <div className="label mb-2">Waypoints</div>
          <div className="space-y-3">
            {waypoints.map((waypoint, index) => {
              const label = computeLabel(index, waypoints.length);
              return (
                <div key={waypoint.id} className="waypoint-item flex-col gap-2 md:flex-row md:items-start md:gap-3">
                  <div className="w-full md:flex-1 relative">
                    <div className="label mb-1 text-xs uppercase tracking-wide text-slate-400">{label}</div>
                    <input
                      className="input"
                      placeholder="Start typing an address..."
                      value={waypoint.query}
                      onChange={(event) => handleQueryChange(waypoint.id, event.target.value)}
                    />
                    {waypoint.loading && <div className="absolute right-3 top-9 h-2 w-2 rounded-full bg-brand animate-ping" />}
                    {waypoint.suggestions.length > 0 && (
                      <div className="absolute z-40 mt-1 w-full rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
                        {waypoint.suggestions.map((suggestion) => (
                          <button
                            key={suggestion.id}
                            type="button"
                            className="block w-full text-left px-3 py-2 text-sm hover:bg-slate-100"
                            onClick={() => handleSuggestionSelect(waypoint.id, suggestion)}
                          >
                            {suggestion.name}
                          </button>
                        ))}
                      </div>
                    )}
                    {!waypoint.loading && waypoint.suggestions.length === 0 && waypoint.query.trim().length >= MIN_QUERY_LENGTH && !waypoint.location && (
                      <div className="absolute z-30 mt-1 w-full rounded-xl border border-dashed border-slate-300 bg-white px-3 py-2 text-xs text-slate-500">
                        No matches yet - keep typing to search the map.
                      </div>
                    )}
                  </div>
                  {waypoints.length > 2 && index > 0 && index < waypoints.length - 1 && (
                    <button
                      type="button"
                      className="chip badge self-end md:self-center"
                      onClick={() => handleRemoveWaypoint(waypoint.id)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <button type="button" className="chip mt-3" onClick={handleAddStop}>
            Add Stop
          </button>
        </div>

        {error && <div className="text-sm text-red-500 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">{error}</div>}

        <div className="flex items-center justify-end gap-2">
          <button type="button" className="chip" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className={`chip ${canSave ? '' : 'opacity-60 cursor-not-allowed pointer-events-none'}`}
            onClick={handleSave}
            disabled={!canSave}
          >
            {saving ? 'Saving...' : 'Save Route'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
