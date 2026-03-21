"use client";

import { useState } from "react";
import { Thermometer, Droplets, AlertTriangle, CheckCircle2, Activity } from "lucide-react";

const zones = [
  { id: "z1", name: "Main Refrigerator A", type: "Refrigerated", minTemp: 2, maxTemp: 8, current: 4.2, humidity: 58, status: "normal", medicines: 24 },
  { id: "z2", name: "Cold Chain Unit B", type: "Cold Chain", minTemp: 2, maxTemp: 8, current: 9.8, humidity: 62, status: "breach", medicines: 8 },
  { id: "z3", name: "Freezer Unit C", type: "Frozen", minTemp: -25, maxTemp: -15, current: -19.5, humidity: 45, status: "normal", medicines: 3 },
  { id: "z4", name: "Controlled Room D", type: "Controlled", minTemp: 15, maxTemp: 25, current: 22.1, humidity: 52, status: "normal", medicines: 18 },
  { id: "z5", name: "General Storage E", type: "Room Temp", minTemp: 20, maxTemp: 30, current: 27.8, humidity: 61, status: "warning", medicines: 312 },
];

const historyData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  temp: 4 + Math.sin(i * 0.3) * 1.5 + (i === 10 ? 5.8 : 0),
}));

function TempGauge({ current, min, max, status }: { current: number; min: number; max: number; status: string }) {
  const range = max - min;
  const pct = Math.min(100, Math.max(0, ((current - min) / range) * 100));
  const color = status === "breach" ? "#EF4444" : status === "warning" ? "#F59E0B" : "#10B981";
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 28, fontWeight: 800, color, fontFamily: "JetBrains Mono, monospace" }}>
        {current > 0 ? "+" : ""}{current.toFixed(1)}°C
      </div>
      <div style={{ margin: "8px 0", height: 8, background: "#E2E8F0", borderRadius: 4, overflow: "hidden", position: "relative" }}>
        <div style={{
          position: "absolute", left: `${((min < 0 ? 0 : 0))}%`, width: "100%",
          height: "100%",
        }}>
          <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.5s" }} />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text-muted)" }}>
        <span>{min}°C</span><span>Safe: {min}–{max}°C</span><span>{max}°C</span>
      </div>
    </div>
  );
}

export default function ColdChainPage() {
  const [selected, setSelected] = useState(zones[0]);
  const breachCount = zones.filter(z => z.status === "breach").length;
  const warningCount = zones.filter(z => z.status === "warning").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Status Row */}
      <div style={{ display: "flex", gap: 12 }}>
        {[
          { label: "Monitoring Zones", value: zones.length, color: "#1E3A8A", bg: "#EFF6FF" },
          { label: "Normal", value: zones.filter(z => z.status === "normal").length, color: "#15803D", bg: "#F0FDF4" },
          { label: "Temperature Breach", value: breachCount, color: "#DC2626", bg: "#FEF2F2" },
          { label: "Warning", value: warningCount, color: "#D97706", bg: "#FFFBEB" },
          { label: "Medicines at Risk", value: zones.filter(z => z.status !== "normal").reduce((s, z) => s + z.medicines, 0), color: "#EF4444", bg: "#FFF5F5" },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: s.bg, borderRadius: 10, padding: "14px 16px", border: `1px solid ${s.color}20` }}>
            <div style={{ fontSize: 26, fontWeight: 800, fontFamily: "JetBrains Mono, monospace", color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {breachCount > 0 && (
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "14px 18px", background: "#FEF2F2", border: "1px solid #FECACA",
          borderLeft: "4px solid #EF4444", borderRadius: 10, animation: "alertPulse 2s infinite",
        }}>
          <AlertTriangle size={20} color="#DC2626" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#B91C1C" }}>🌡️ Temperature Breach Detected — Cold Chain Unit B</div>
            <div style={{ fontSize: 13, color: "#DC2626" }}>Current: 9.8°C · Safe range: 2–8°C · SMS sent to Store Manager and Pharmacist</div>
          </div>
          <span style={{ fontSize: 11, fontWeight: 600, background: "#DCFCE7", color: "#15803D", padding: "3px 10px", borderRadius: 999 }}>📱 SMS Sent</span>
        </div>
      )}

      {/* Zone Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {zones.map(zone => (
          <div key={zone.id} onClick={() => setSelected(zone)} style={{
            background: "white", borderRadius: 12, padding: "18px 20px",
            border: zone.status === "breach" ? "2px solid #EF4444" : zone.status === "warning" ? "2px solid #F59E0B" : "1px solid var(--border)",
            cursor: "pointer", transition: "all 0.2s",
            boxShadow: selected.id === zone.id ? "0 0 0 3px rgba(16,185,129,0.2)" : "none",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{zone.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{zone.type} · {zone.medicines} medicines</div>
              </div>
              {zone.status === "breach" ? <AlertTriangle size={18} color="#EF4444" /> :
               zone.status === "warning" ? <AlertTriangle size={18} color="#F59E0B" /> :
               <CheckCircle2 size={18} color="#10B981" />}
            </div>
            <TempGauge current={zone.current} min={zone.minTemp} max={zone.maxTemp} status={zone.status} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 12 }}>
              <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                <Droplets size={12} /> {zone.humidity}% humidity
              </span>
              <span style={{
                fontWeight: 700,
                color: zone.status === "breach" ? "#DC2626" : zone.status === "warning" ? "#D97706" : "#15803D",
              }}>
                {zone.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Live chart of selected zone */}
      <div className="chart-container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{selected.name} — 24h Temperature Log</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Safe range: {selected.minTemp}°C to {selected.maxTemp}°C</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ fontSize: 12, padding: "4px 10px", background: "#DBEAFE", color: "#1D4ED8", borderRadius: 6, fontWeight: 600 }}>
              <Activity size={11} style={{ marginRight: 4 }} />Live
            </span>
          </div>
        </div>
        <div style={{ height: 200, background: "var(--bg)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", color: "var(--text-muted)" }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>📊</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Live temperature chart</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>Connect IoT sensors via API to enable real-time monitoring</div>
          </div>
        </div>
      </div>
    </div>
  );
}
