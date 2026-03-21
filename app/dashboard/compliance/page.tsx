"use client";

import { ShieldCheck, AlertTriangle, FileText, Plus } from "lucide-react";

const rules = [
  { id: "r1", name: "DPCO Price Ceiling Check", description: "Auto-flag when dispensing price > DPCO ceiling for scheduled drugs", status: "active", violations: 2 },
  { id: "r2", name: "Schedule H Drug Prescription Required", description: "Alert when Schedule H/H1 drugs are dispensed without prescription record", status: "active", violations: 0 },
  { id: "r3", name: "Cold Chain Compliance", description: "Flag if cold-chain medicines stored out of temperature range", status: "active", violations: 1 },
  { id: "r4", name: "Expiry Dispensing Block", description: "Prevent dispensing of expired batches", status: "active", violations: 0 },
];

export default function CompliancePage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 12 }}>
        {[
          { label: "Active Rules", value: rules.filter(r => r.status === "active").length, color: "#1E3A8A", bg: "#EFF6FF" },
          { label: "Violations Today", value: rules.reduce((s, r) => s + r.violations, 0), color: "#DC2626", bg: "#FEF2F2" },
          { label: "Auto Reports", value: "Weekly", color: "#10B981", bg: "#F0FDF4" },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: s.bg, borderRadius: 10, padding: "14px 18px", border: `1px solid ${s.color}20` }}>
            <div style={{ fontSize: 26, fontWeight: 800, fontFamily: "JetBrains Mono, monospace", color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {rules.map(rule => (
          <div key={rule.id} style={{
            padding: "16px 20px", borderRadius: 12, background: "white",
            border: rule.violations > 0 ? "1px solid #FECACA" : "1px solid var(--border)",
            borderLeft: `4px solid ${rule.violations > 0 ? "#EF4444" : "#10B981"}`,
            display: "flex", alignItems: "center", gap: 14,
          }}>
            <div style={{ fontSize: 28 }}>{rule.violations > 0 ? "⚠️" : "✅"}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{rule.name}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 3 }}>{rule.description}</div>
            </div>
            {rule.violations > 0 && (
              <span style={{ fontWeight: 800, color: "#DC2626", fontFamily: "JetBrains Mono, monospace", fontSize: 16 }}>
                {rule.violations} violation{rule.violations > 1 ? "s" : ""}
              </span>
            )}
            <span className={`badge ${rule.status === "active" ? "badge-success" : "badge-warning"}`}>{rule.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
