"use client";

import { useState } from "react";
import { Clock, AlertTriangle, CheckCircle2, Filter, Package, Zap } from "lucide-react";
import { mockMedicines } from "@/lib/mockData";
import { getDaysToExpiry, formatDate } from "@/lib/utils";

// Simulated batch data with expiry dates
const batchesWithExpiry = [
  { id: "b1", medicineId: "med001", medicineName: "Insulin Glargine", batchNo: "B-2024-01", qty: 200, expiryDate: new Date(Date.now() + 3 * 86400000), supplierId: "s1" },
  { id: "b2", medicineId: "med002", medicineName: "Amoxicillin 500mg", batchNo: "B-2024-02", qty: 120, expiryDate: new Date(Date.now() + 12 * 86400000), supplierId: "s2" },
  { id: "b3", medicineId: "med003", medicineName: "Morphine Sulfate", batchNo: "B-2024-03", qty: 28, expiryDate: new Date(Date.now() + 22 * 86400000), supplierId: "s1" },
  { id: "b4", medicineId: "med004", medicineName: "Metformin 500mg", batchNo: "B-2024-04", qty: 89, expiryDate: new Date(Date.now() + 45 * 86400000), supplierId: "s3" },
  { id: "b5", medicineId: "med005", medicineName: "Adrenaline 1mg", batchNo: "B-2024-05", qty: 156, expiryDate: new Date(Date.now() + 78 * 86400000), supplierId: "s2" },
  { id: "b6", medicineId: "med001", medicineName: "Insulin Glargine", batchNo: "B-2024-06", qty: 50, expiryDate: new Date(Date.now() - 2 * 86400000), supplierId: "s1" }, // expired
  { id: "b7", medicineId: "med002", medicineName: "Amoxicillin 500mg", batchNo: "B-2024-07", qty: 300, expiryDate: new Date(Date.now() + 120 * 86400000), supplierId: "s2" },
];

function ExpiryStatusBadge({ days }: { days: number }) {
  if (days <= 0) return <span className="badge badge-danger">🔴 EXPIRED</span>;
  if (days <= 7) return <span className="badge badge-danger">🔴 {days}d left</span>;
  if (days <= 30) return <span className="badge badge-warning">🟡 {days}d left</span>;
  return <span className="badge badge-success">🟢 {days}d left</span>;
}

function ExpiryProgressBar({ days }: { days: number }) {
  const safe = 90;
  const pct = days <= 0 ? 100 : Math.max(0, 100 - (days / safe) * 100);
  const color = days <= 0 ? "#EF4444" : days <= 7 ? "#DC2626" : days <= 30 ? "#F59E0B" : "#10B981";
  return (
    <div style={{ width: "100%", height: 4, background: "#F1F5F9", borderRadius: 2, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 2, transition: "width 0.3s" }} />
    </div>
  );
}

export default function ExpiryPage() {
  const [filter, setFilter] = useState<"all" | "expired" | "critical" | "near" | "safe">("all");
  const [showFefoModal, setShowFefoModal] = useState(false);
  const [fefoMedicine, setFefoMedicine] = useState<string | null>(null);

  const withDays = batchesWithExpiry.map(b => ({
    ...b, daysLeft: getDaysToExpiry(b.expiryDate),
  })).sort((a, b) => a.daysLeft - b.daysLeft);

  const filtered = withDays.filter(b => {
    if (filter === "all") return true;
    if (filter === "expired") return b.daysLeft <= 0;
    if (filter === "critical") return b.daysLeft > 0 && b.daysLeft <= 7;
    if (filter === "near") return b.daysLeft > 7 && b.daysLeft <= 30;
    if (filter === "safe") return b.daysLeft > 30;
    return true;
  });

  const counts = {
    expired: withDays.filter(b => b.daysLeft <= 0).length,
    critical: withDays.filter(b => b.daysLeft > 0 && b.daysLeft <= 7).length,
    near: withDays.filter(b => b.daysLeft > 7 && b.daysLeft <= 30).length,
    safe: withDays.filter(b => b.daysLeft > 30).length,
  };

  const fefoSuggestion = fefoMedicine
    ? withDays.filter(b => b.medicineName === fefoMedicine && b.daysLeft > 0).sort((a, b) => a.daysLeft - b.daysLeft)[0]
    : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Summary Cards */}
      <div style={{ display: "flex", gap: 12 }}>
        {[
          { key: "expired", label: "Expired Batches", value: counts.expired, color: "#DC2626", bg: "#FEF2F2", icon: "❌" },
          { key: "critical", label: "< 7 Days", value: counts.critical, color: "#EF4444", bg: "#FFF5F5", icon: "🔴" },
          { key: "near", label: "7–30 Days", value: counts.near, color: "#D97706", bg: "#FFFBEB", icon: "🟡" },
          { key: "safe", label: "Safe (>30 Days)", value: counts.safe, color: "#15803D", bg: "#F0FDF4", icon: "🟢" },
        ].map(s => (
          <button key={s.key} onClick={() => setFilter(s.key as any)} style={{
            flex: 1, background: filter === s.key ? s.bg : "white",
            borderRadius: 10, padding: "14px 16px",
            border: `${filter === s.key ? "2px" : "1px"} solid ${filter === s.key ? s.color : "var(--border)"}`,
            cursor: "pointer", textAlign: "left", transition: "all 0.15s",
          }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.color, fontFamily: "JetBrains Mono, monospace" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>{s.label}</div>
          </button>
        ))}
        <button onClick={() => setFilter("all")} style={{
          flex: 1, background: filter === "all" ? "var(--accent-light)" : "white",
          borderRadius: 10, padding: "14px 16px",
          border: `${filter === "all" ? "2px" : "1px"} solid ${filter === "all" ? "var(--accent)" : "var(--border)"}`,
          cursor: "pointer", textAlign: "left",
        }}>
          <div style={{ fontSize: 20, marginBottom: 4 }}>📦</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "var(--accent)", fontFamily: "JetBrains Mono, monospace" }}>{withDays.length}</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>All Batches</div>
        </button>
      </div>

      {/* FEFO Dispense Tool */}
      <div style={{
        background: "linear-gradient(135deg, #F0FDF4, #DBEAFE)",
        borderRadius: 12, padding: "16px 20px",
        border: "1px solid var(--accent)",
        display: "flex", alignItems: "center", gap: 16,
      }}>
        <div style={{ fontSize: 28 }}>⚡</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--primary)" }}>FEFO Smart Dispensing</div>
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>First Expiry, First Out — select a medicine to get the correct batch to dispense</div>
        </div>
        <select className="select" onChange={e => { setFefoMedicine(e.target.value || null); setShowFefoModal(!!e.target.value); }}
          style={{ height: 38, fontSize: 13 }}>
          <option value="">Select Medicine…</option>
          {[...new Set(batchesWithExpiry.map(b => b.medicineName))].map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        {fefoSuggestion && showFefoModal && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 50,
            display: "flex", alignItems: "center", justifyContent: "center",
          }} onClick={() => setShowFefoModal(false)}>
            <div onClick={e => e.stopPropagation()} style={{
              background: "white", borderRadius: 16, padding: 28, maxWidth: 400, width: "90%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            }}>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>⚡</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "var(--primary)" }}>FEFO Recommendation</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Dispense this batch first to minimize wastage</div>
              </div>
              <div style={{ background: "var(--bg)", borderRadius: 10, padding: 16, marginBottom: 20 }}>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{fefoSuggestion.medicineName}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 13 }}>
                  <div><span style={{ color: "var(--text-muted)" }}>Batch: </span><b>{fefoSuggestion.batchNo}</b></div>
                  <div><span style={{ color: "var(--text-muted)" }}>Qty: </span><b>{fefoSuggestion.qty} units</b></div>
                  <div><span style={{ color: "var(--text-muted)" }}>Expiry: </span><b style={{ color: fefoSuggestion.daysLeft <= 7 ? "#DC2626" : "#D97706" }}>{formatDate(fefoSuggestion.expiryDate)}</b></div>
                  <div><span style={{ color: "var(--text-muted)" }}>Days Left: </span><b style={{ color: fefoSuggestion.daysLeft <= 7 ? "#DC2626" : "#D97706" }}>{fefoSuggestion.daysLeft}d</b></div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowFefoModal(false)}>Cancel</button>
                <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }}>
                  <Zap size={14} /> Confirm Dispense
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Batch Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Medicine / Batch</th>
              <th>Expiry Date</th>
              <th>Days Left</th>
              <th>Time Bar</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(batch => (
              <tr key={batch.id}>
                <td>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{batch.medicineName}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Batch: {batch.batchNo}</div>
                </td>
                <td>
                  <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 13 }}>
                    {formatDate(batch.expiryDate)}
                  </span>
                </td>
                <td>
                  <span style={{
                    fontFamily: "JetBrains Mono, monospace", fontSize: 15, fontWeight: 700,
                    color: batch.daysLeft <= 0 ? "#DC2626" : batch.daysLeft <= 7 ? "#EF4444" : batch.daysLeft <= 30 ? "#D97706" : "#15803D"
                  }}>
                    {batch.daysLeft <= 0 ? "EXPIRED" : `${batch.daysLeft}d`}
                  </span>
                </td>
                <td style={{ minWidth: 120 }}>
                  <ExpiryProgressBar days={batch.daysLeft} />
                </td>
                <td>
                  <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 600 }}>{batch.qty}</span>
                  <span style={{ color: "var(--text-muted)", fontSize: 12 }}> units</span>
                </td>
                <td><ExpiryStatusBadge days={batch.daysLeft} /></td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    {batch.daysLeft > 0 && (
                      <button className="btn-primary" onClick={() => { setFefoMedicine(batch.medicineName); setShowFefoModal(true); }}
                        style={{ fontSize: 12, padding: "5px 10px" }}>
                        <Zap size={12} /> FEFO
                      </button>
                    )}
                    {batch.daysLeft <= 0 && (
                      <button className="btn-danger" style={{ fontSize: 12, padding: "5px 10px" }}>
                        Dispose
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
