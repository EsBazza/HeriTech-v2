"use client";

import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { MaterialBatch } from "@/lib/types";

// Fix Leaflet default marker icon issue in Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function createCustomIcon(status: MaterialBatch["status"]) {
  const colors: Record<MaterialBatch["status"], string> = {
    available: "#10b981",
    reserved: "#f59e0b",
    claimed: "#64748b",
  };
  const color = colors[status];

  return L.divIcon({
    html: `
      <div style="
        width: 28px;
        height: 28px;
        background: ${color};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 3px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
}

interface MaterialMapProps {
  batches: MaterialBatch[];
  onBatchClick: (batch: MaterialBatch) => void;
}

export function MaterialMap({ batches, onBatchClick }: MaterialMapProps) {
  // Center on Southeast Asia
  const center: [number, number] = [15, 100];

  return (
    <MapContainer
      center={center}
      zoom={3}
      style={{ height: "100%", width: "100%", borderRadius: 28 }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {batches.map((batch) => (
        <Marker
          key={batch.id}
          position={[batch.gps.lat, batch.gps.lng]}
          icon={createCustomIcon(batch.status)}
          eventHandlers={{
            click: () => onBatchClick(batch),
          }}
        >
          <Popup>
            <div style={{ minWidth: 180, fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              <p
                style={{
                  fontWeight: 700,
                  fontSize: 13,
                  marginBottom: 4,
                  color: "#1e293b",
                }}
              >
                {batch.title}
              </p>
              <p
                style={{ fontSize: 11, color: "#64748b", marginBottom: 2 }}
              >
                {batch.weightKg}kg · {batch.materialType}
              </p>
              <span
                style={{
                  display: "inline-block",
                  padding: "2px 8px",
                  borderRadius: 20,
                  fontSize: 10,
                  fontWeight: 600,
                  background:
                    batch.status === "available"
                      ? "#d1fae5"
                      : batch.status === "reserved"
                        ? "#fef3c7"
                        : "#f1f5f9",
                  color:
                    batch.status === "available"
                      ? "#059669"
                      : batch.status === "reserved"
                        ? "#92400e"
                        : "#475569",
                  textTransform: "capitalize",
                }}
              >
                {batch.status}
              </span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
