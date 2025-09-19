"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { MapContainer, TileLayer, Marker, Polyline, Tooltip as LTooltip, useMap } from "react-leaflet";
import L, { DivIcon, Map as LeafletMap, type TileLayerOptions } from "leaflet";
import { useMemo, useEffect, useRef, useCallback, useState } from "react";
import { useStore } from "@/lib/store";
import { COLORS } from "@/lib/utils";
import type { Vehicle } from "@/lib/types";

const FOCUS_ZOOM = 15;
const FOCUS_TIMEOUT_MS = 20000;
const MAPBOX_STYLE = "mapbox/navigation-day-v1";
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const STATUS_ICONS: Record<Vehicle["status"], string> = {
  "En Route": "&#128666;",
  Idle: "&#9203;",
  "At Depot": "&#127970;",
  Maintenance: "&#9881;"
};
const FALLBACK_ICON = "&#128663;";
const ICON_CACHE: Partial<Record<Vehicle["status"], DivIcon>> = {};

function makeIcon(status: Vehicle["status"]) {
  if (ICON_CACHE[status]) {
    return ICON_CACHE[status]!;
  }

  const ring = (COLORS as Record<string, string>)[status] ?? "#0A84FF";
  const iconSymbol = STATUS_ICONS[status] ?? FALLBACK_ICON;
  const html = `<div class="marker ${status === 'En Route' ? 'pulse' : ''}" style="--ring:${ring}"><div class="emoji">${iconSymbol}</div></div>`;
  const icon = L.divIcon({ className: "", html, iconSize: [38, 38], iconAnchor: [19, 19] }) as DivIcon;
  ICON_CACHE[status] = icon;
  return icon;
}

function FitBounds({ vehicles, disabled }: { vehicles: Vehicle[]; disabled: boolean }) {
  const map = useMap();

  useEffect(() => {
    if (disabled || vehicles.length === 0) return;
    const bounds = L.latLngBounds(vehicles.map((vehicle) => [vehicle.pos.lat, vehicle.pos.lng]));
    if (bounds.isValid()) {
      map.fitBounds(bounds.pad(0.2));
    }
  }, [vehicles, map, disabled]);

  return null;
}

type MarkerDescriptor = {
  id: string;
  position: [number, number];
  icon: DivIcon;
  vehicle: Vehicle;
};

function VehicleMarkers({ markers, onVehicleFocus }: { markers: MarkerDescriptor[]; onVehicleFocus: (map: LeafletMap, vehicle: Vehicle) => void }) {
  const map = useMap();

  return (
    <>
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={marker.position}
          icon={marker.icon}
          eventHandlers={{
            dblclick: (event) => {
              event.originalEvent?.stopPropagation();
              onVehicleFocus(map, marker.vehicle);
            }
          }}
        >
          <LTooltip>{`${marker.vehicle.id} - ${marker.vehicle.driver} - ${marker.vehicle.status}`}</LTooltip>
        </Marker>
      ))}
    </>
  );
}

export default function LiveMapInner() {
  const { vehicles, routes } = useStore();
  const showRoutes = true;
  const [manualFocus, setManualFocus] = useState(false);
  const focusTimeoutRef = useRef<number | null>(null);

  const markers = useMemo<MarkerDescriptor[]>(
    () =>
      vehicles.map((vehicle) => ({
        id: vehicle.id,
        position: [vehicle.pos.lat, vehicle.pos.lng] as [number, number],
        icon: makeIcon(vehicle.status),
        vehicle
      })),
    [vehicles]
  );

  const lines = useMemo(() => {
    if (!showRoutes) return [];
    return vehicles
      .filter((vehicle) => vehicle.routeId)
      .map((vehicle) => {
        const route = routes.find((candidate) => candidate.id === vehicle.routeId);
        return route ? route.points.map((point) => [point.lat, point.lng]) : [];
      });
  }, [vehicles, routes, showRoutes]);

  const handleVehicleFocus = useCallback((mapInstance: LeafletMap, vehicle: Vehicle) => {
    setManualFocus(true);
    if (focusTimeoutRef.current) {
      window.clearTimeout(focusTimeoutRef.current);
    }
    focusTimeoutRef.current = window.setTimeout(() => {
      setManualFocus(false);
    }, FOCUS_TIMEOUT_MS);

    mapInstance.flyTo([vehicle.pos.lat, vehicle.pos.lng], FOCUS_ZOOM, { duration: 0.8 });
  }, []);

  useEffect(() => () => {
    if (focusTimeoutRef.current) {
      window.clearTimeout(focusTimeoutRef.current);
    }
  }, []);

  const tileLayerUrl = MAPBOX_TOKEN
    ? `https://api.mapbox.com/styles/v1/${MAPBOX_STYLE}/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const tileOptions: TileLayerOptions = MAPBOX_TOKEN
    ? {
        tileSize: 512,
        zoomOffset: -1,
        attribution: '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 20
      }
    : {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      };

  return (
    <div className="relative">
      <MapContainer
        center={[-30.5595, 22.9375]}
        zoom={5}
        style={{ height: 440, width: "100%" }}
        zoomControl={false}
        attributionControl={false}
        doubleClickZoom={false}
        preferCanvas
      >
        <TileLayer url={tileLayerUrl} {...tileOptions} />
        <FitBounds vehicles={vehicles} disabled={manualFocus} />
        {lines.map((latlngs, index) => (
          <Polyline key={index} positions={latlngs as any} pathOptions={{ color: "#0A84FF", weight: 5, opacity: 0.35 }} />
        ))}
        <VehicleMarkers markers={markers} onVehicleFocus={handleVehicleFocus} />
      </MapContainer>
    </div>
  );
}
