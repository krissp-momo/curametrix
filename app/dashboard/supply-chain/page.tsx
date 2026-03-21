"use client";

import { useState } from "react";
import { Truck, Package, FileText, ArrowLeftRight, Plus, CheckCircle2, Clock, XCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const suppliers = [
  { id: "s1", name: "MedLine Pharma Pvt Ltd", contact: "Rajesh Kumar", phone: "+91 98765 43210", email: "rajesh@medline.com", city: "Mumbai", rating: 4.8, isActive: true, lastOrder: "Mar 18, 2026" },
  { id: "s2", name: "HealthFirst Distributors", contact: "Anita Singh", phone: "+91 87654 32109", email: "anita@healthfirst.com", city: "Delhi", rating: 4.5, isActive: true, lastOrder: "Mar 15, 2026" },
  { id: "s3", name: "CureWell Supplies", contact: "Mohan Rao", phone: "+91 76543 21098", email: "mohan@curewell.com", city: "Hyderabad", rating: 3.8, isActive: true, lastOrder: "Mar 10, 2026" },
];

const purchaseOrders = [
  { id: "po1", number: "PO-2026-089", supplier: "MedLine Pharma", items: 3, amount: 248500, status: "pending", created: "Mar 20, 2026", auto: true },
  { id: "po2", number: "PO-2026-088", supplier: "HealthFirst Distributors", items: 5, amount: 184200, status: "approved", created: "Mar 18, 2026", auto: false },
  { id: "po3", number: "PO-2026-087", supplier: "CureWell Supplies", items: 2, amount: 62400, status: "received", created: "Mar 15, 2026", auto: false },
  { id: "po4", number: "PO-2026-086", supplier: "MedLine Pharma", items: 7, amount: 412000, status: "sent", created: "Mar 12, 2026", auto: true },
];

const transfers = [
  { id: "t1", from: "City General Hospital", to: "District Hospital B", medicine: "Insulin Glargine", qty: 100, status: "suggested", isAI: true, reason: "200 units expiring in 7 days vs shortage at District B" },
  { id: "t2", from: "City General Hospital", to: "Community Health Center A", medicine: "Amoxicillin 500mg", qty: 200, status: "approved", isAI: false, reason: "Manual transfer request" },
];

const poStatusConfig: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  pending:  { color: "#D97706", bg: "#FEF3C7", icon: Clock },
  approved: { color: "#2563EB", bg: "#DBEAFE", icon: CheckCircle2 },
  sent:     { color: "#7C3AED", bg: "#F5F3FF", icon: Truck },
  received: { color: "#15803D", bg: "#DCFCE7", icon: CheckCircle2 },
  cancelled:{ color: "#DC2626", bg: "#FEE2E2", icon: XCircle },
};

const tabs = ["Suppliers", "Purchase Orders", "Inter-Hospital Transfers", "Returns & Disposal"];

export default function SupplyChainPage() {
  const [activeTab, setActiveTab] = useState("Suppliers");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden" }}>
        <div style={{ display: "flex", borderBottom: "1px solid var(--border)", padding: "0 16px" }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              padding: "12px 18px", border: "none", background: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 600, whiteSpace: "nowrap",
              color: activeTab === t ? "var(--accent)" : "var(--text-muted)",
              borderBottom: activeTab === t ? "2px solid var(--accent)" : "2px solid transparent",
              transition: "all 0.15s",
            }}>{t}</button>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", padding: "0 0 0 12px" }}>
            <button className="btn-primary" style={{ fontSize: 13 }}><Plus size={14} /> {activeTab === "Suppliers" ? "Add Supplier" : activeTab === "Purchase Orders" ? "New PO" : "New Transfer"}</button>
          </div>
        </div>

        <div style={{ padding: 20 }}>
          {activeTab === "Suppliers" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {suppliers.map(s => (
                <div key={s.id} style={{ padding: "16px 18px", borderRadius: 12, border: "1px solid var(--border)", background: "var(--bg)", display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🏭</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.contact} · {s.phone} · {s.city}</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#F59E0B" }}>{"★".repeat(Math.round(s.rating))}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{s.rating}/5</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span className={`badge ${s.isActive ? "badge-success" : "badge-warning"}`}>{s.isActive ? "Active" : "Inactive"}</span>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Last order: {s.lastOrder}</div>
                  </div>
                  <button className="btn-ghost" style={{ fontSize: 13 }}>View</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === "Purchase Orders" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {/* Auto-order info */}
              <div style={{ padding: "10px 14px", background: "#F0FDF4", borderRadius: 8, border: "1px solid #BBF7D0", fontSize: 13, color: "#15803D", display: "flex", gap: 8, alignItems: "center" }}>
                🤖 <b>Smart Auto-Ordering Active</b> — POs are auto-generated when stock hits reorder levels. SMS + Email sent for approval.
              </div>
              <div className="table-container">
                <table>
                  <thead><tr><th>PO Number</th><th>Supplier</th><th>Items</th><th>Amount</th><th>Status</th><th>Type</th><th>Date</th><th></th></tr></thead>
                  <tbody>
                    {purchaseOrders.map(po => {
                      const sc = poStatusConfig[po.status];
                      return (
                        <tr key={po.id}>
                          <td style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700 }}>{po.number}</td>
                          <td>{po.supplier}</td>
                          <td>{po.items} items</td>
                          <td style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700 }}>{formatCurrency(po.amount)}</td>
                          <td>
                            <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: sc.bg, color: sc.color }}>
                              {po.status.toUpperCase()}
                            </span>
                          </td>
                          <td>
                            {po.auto && <span className="badge badge-primary">🤖 Auto</span>}
                            {!po.auto && <span className="badge badge-info">Manual</span>}
                          </td>
                          <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{po.created}</td>
                          <td>
                            {po.status === "pending" && <button className="btn-primary" style={{ fontSize: 12, padding: "5px 10px" }}>Approve</button>}
                            {po.status !== "pending" && <button className="btn-ghost" style={{ fontSize: 12, padding: "5px 10px" }}>View</button>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "Inter-Hospital Transfers" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ padding: "10px 14px", background: "#EFF6FF", borderRadius: 8, border: "1px solid #BFDBFE", fontSize: 13, color: "#1D4ED8" }}>
                🌐 AI monitors all hospital branches for excess stock and shortages. Transfer suggestions are auto-generated to prevent wastage and shortages simultaneously.
              </div>
              {transfers.map(t => (
                <div key={t.id} style={{
                  padding: "16px 18px", borderRadius: 12,
                  border: t.isAI ? "1px solid var(--accent)" : "1px solid var(--border)",
                  background: t.isAI ? "#F0FDF4" : "var(--bg)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{t.medicine}</div>
                    {t.isAI && <span className="badge badge-success">🤖 AI Suggested</span>}
                    <span className={`badge ${t.status === "approved" ? "badge-success" : "badge-warning"}`}>{t.status}</span>
                    <span style={{ marginLeft: "auto", fontFamily: "JetBrains Mono, monospace", fontWeight: 700 }}>{t.qty} units</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14 }}>
                    <span style={{ fontWeight: 600 }}>{t.from}</span>
                    <ArrowLeftRight size={16} color="var(--accent)" />
                    <span style={{ fontWeight: 600 }}>{t.to}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6 }}>{t.reason}</div>
                  {t.status === "suggested" && (
                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                      <button className="btn-primary" style={{ fontSize: 13 }}>Approve Transfer</button>
                      <button className="btn-ghost" style={{ fontSize: 13 }}>Reject</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === "Returns & Disposal" && (
            <div style={{ textAlign: "center", padding: 60, color: "var(--text-muted)" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>Returns & Disposal Tracking</div>
              <div style={{ fontSize: 13, marginTop: 6 }}>Log expired, damaged or recalled stock returns to suppliers</div>
              <button className="btn-primary" style={{ marginTop: 20 }}><Plus size={14} /> Log Return</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
