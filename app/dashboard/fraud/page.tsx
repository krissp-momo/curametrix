"use client";

import { useState } from "react";
import { ShieldAlert, Eye, AlertTriangle, TrendingDown, Search, Filter } from "lucide-react";

const anomalies = [
  { id: "f1", type: "Stock Disappearance", medicine: "Morphine Sulfate", detail: "10 units removed without billing record", time: "Today, 2:15 PM", user: "Unknown", severity: "critical", status: "investigating" },
  { id: "f2", type: "Unusual Dispensing", medicine: "Tramadol 100mg", detail: "50 units dispensed in a single transaction — 5× normal pattern", time: "Today, 11:42 AM", user: "Pharmacist Ravi", severity: "high", status: "flagged" },
  { id: "f3", type: "Repeated Entry", medicine: "Insulin Glargine", detail: "Same batch B-2024-01 added twice within 10 minutes by different users", time: "Yesterday, 4:30 PM", user: "Admin Priya", severity: "medium", status: "resolved" },
  { id: "f4", type: "Price Anomaly", medicine: "Amoxicillin 500mg", detail: "Dispensing price ₹22 exceeds MRP ₹15 — possible billing error", time: "Yesterday, 2:10 PM", user: "Pharmacist Amit", severity: "medium", status: "resolved" },
  { id: "f5", type: "Fake Entry Detected", medicine: "Paracetamol 650mg", detail: "GRN entered without corresponding purchase order. Supplier not in system.", time: "2 days ago", user: "Store Manager", severity: "high", status: "flagged" },
];

const severityConfig: Record<string, { color: string; bg: string; border: string }> = {
  critical: { color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
  high:     { color: "#D97706", bg: "#FFFBEB", border: "#FCD34D" },
  medium:   { color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE" },
};

const typeIcon: Record<string, string> = {
  "Stock Disappearance": "🕵️",
  "Unusual Dispensing": "📊",
  "Repeated Entry": "🔁",
  "Price Anomaly": "💸",
  "Fake Entry Detected": "⚠️",
};

export default function FraudPage() {
  const [status, setStatus] = useState("all");

  const filtered = anomalies.filter(a => status === "all" || a.status === status);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Stats */}
      <div style={{ display: "flex", gap: 12 }}>
        {[
          { label: "Total Anomalies", value: anomalies.length, color: "#1E3A8A", bg: "#EFF6FF" },
          { label: "Critical", value: anomalies.filter(a => a.severity === "critical").length, color: "#DC2626", bg: "#FEF2F2" },
          { label: "Under Investigation", value: anomalies.filter(a => a.status === "investigating").length, color: "#D97706", bg: "#FFFBEB" },
          { label: "Resolved", value: anomalies.filter(a => a.status === "resolved").length, color: "#15803D", bg: "#F0FDF4" },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: s.bg, borderRadius: 10, padding: "14px 18px", border: `1px solid ${s.color}20` }}>
            <div style={{ fontSize: 26, fontWeight: 800, fontFamily: "JetBrains Mono, monospace", color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div style={{ background: "linear-gradient(135deg, #FFF7ED, #FEF3C7)", borderRadius: 12, padding: "14px 18px", border: "1px solid #FCD34D", display: "flex", gap: 16, alignItems: "center" }}>
        <div style={{ fontSize: 28 }}>🔍</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>How Fraud Detection Works</div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
            Rule-based engine + ML anomaly scoring monitors: stock removals without billing, quantities 3× above daily average, price > MRP, duplicate GRN entries, and unrecognized supplier records.
          </div>
        </div>
      </div>

      {/* Filter + Table */}
      <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden" }}>
        <div style={{ display: "flex", gap: 8, padding: "12px 16px", borderBottom: "1px solid var(--border)", alignItems: "center" }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>Suspicious Activity Log</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            {["all", "flagged", "investigating", "resolved"].map(s => (
              <button key={s} onClick={() => setStatus(s)} style={{
                padding: "5px 12px", border: `1px solid ${status === s ? "var(--accent)" : "var(--border)"}`,
                borderRadius: 6, background: status === s ? "var(--accent-light)" : "white",
                color: status === s ? "var(--accent)" : "var(--text-muted)",
                fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize",
              }}>{s}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {filtered.map(a => {
            const cfg = severityConfig[a.severity];
            return (
              <div key={a.id} style={{
                display: "flex", gap: 14, padding: "14px 18px",
                borderBottom: "1px solid #F8FAFC",
                borderLeft: `4px solid ${cfg.color}`,
                background: a.status === "resolved" ? "#FAFAFA" : "white",
                opacity: a.status === "resolved" ? 0.7 : 1,
                transition: "background 0.15s",
              }}
                onMouseEnter={e => (e.currentTarget.style.background = "#F8FFF8")}
                onMouseLeave={e => (e.currentTarget.style.background = a.status === "resolved" ? "#FAFAFA" : "white")}
              >
                <div style={{ fontSize: 24, alignSelf: "flex-start", marginTop: 2 }}>{typeIcon[a.type]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{a.type}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 999, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                      {a.severity.toUpperCase()}
                    </span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 999,
                      background: a.status === "resolved" ? "#DCFCE7" : a.status === "investigating" ? "#FEF3C7" : "#FEE2E2",
                      color: a.status === "resolved" ? "#15803D" : a.status === "investigating" ? "#B45309" : "#B91C1C",
                    }}>{a.status.toUpperCase()}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text)", marginBottom: 4 }}>
                    <b>{a.medicine}</b> — {a.detail}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {a.time} · By: {a.user}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, alignSelf: "center" }}>
                  <button className="btn-ghost" style={{ fontSize: 12, padding: "5px 10px" }}><Eye size={13} /> Investigate</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
