"use client";

import { useState } from "react";
import { Bell, AlertTriangle, Clock, ShieldAlert, Info, CheckCircle2, X, Phone, Mail, Trash2, Brain } from "lucide-react";
import { mockAlerts } from "@/lib/mockData";
import type { Alert, AlertType, AlertSeverity } from "@/types";
import { useEffect } from "react";
import { fetchWithAuth } from "@/lib/api";

const tabConfig = [
  { key: "all", label: "All", icon: Bell },
  { key: "critical", label: "Critical", icon: AlertTriangle },
  { key: "expiry", label: "Expiry", icon: Clock },
  { key: "low_stock", label: "Low Stock", icon: ShieldAlert },
  { key: "fraud", label: "Fraud", icon: ShieldAlert },
  { key: "ai_orders", label: "AI Orders", icon: Brain },
  { key: "info", label: "Info", icon: Info },
];

const alertTypeColor: Record<AlertType, string> = {
  low_stock: "#F59E0B", expiry: "#EF4444", critical_drug: "#DC2626",
  fraud: "#7C3AED", temperature: "#0EA5E9", auto_order: "#10B981",
  compliance: "#6366F1", transfer: "#06B6D4",
};

const alertTypeIcon: Record<AlertType, string> = {
  low_stock: "📦", expiry: "⏳", critical_drug: "🚨",
  fraud: "🔍", temperature: "🌡️", auto_order: "🤖",
  compliance: "📋", transfer: "🔄",
};

const severityConfig: Record<AlertSeverity, { bg: string; border: string; dot: string }> = {
  critical: { bg: "#FEF2F2", border: "#FECACA", dot: "#EF4444" },
  warning:  { bg: "#FFFBEB", border: "#FCD34D", dot: "#F59E0B" },
  info:     { bg: "#F0F9FF", border: "#BAE6FD", dot: "#0EA5E9" },
};

const extendedAlerts: Alert[] = [
  ...mockAlerts,
  { id: "a5", type: "temperature", severity: "warning", title: "Cold Storage Zone B — Temp Rising", message: "Zone B temperature at 9.8°C, exceeds safe threshold (2–8°C). Check refrigeration unit.", status: "active", smsSent: true, emailSent: false, hospitalId: "hosp001", createdAt: new Date(Date.now() - 1800000) },
  { id: "a6", type: "auto_order", severity: "info", title: "AI Reorder — Metformin 500mg", message: "Predicted 30-day demand: 420 units. Current stock: 120. Recommended order: 300 units.", status: "active", smsSent: false, emailSent: true, hospitalId: "hosp001", createdAt: new Date(Date.now() - 5400000) },
  { id: "a7", type: "auto_order", severity: "warning", title: "Weather Alert: Monsoon Surge Demand", message: "Viral infection trends rising due to high humidity. Suggesting 20% increase in Paracetamol 650mg stock.", status: "active", smsSent: true, emailSent: true, hospitalId: "hosp001", createdAt: new Date(Date.now() - 9000000) },
  { id: "a8", type: "transfer", severity: "info", title: "Excess Stock Suggestion — Insulin", message: "Stock for Insulin Glargine is 3.2x predicted monthly need. Suggesting transfer of 50 units to Memorial Hospital.", status: "active", smsSent: false, emailSent: false, hospitalId: "hosp001", createdAt: new Date(Date.now() - 12000000) },
];

function ManageContactsDrawer({ onClose }: { onClose: () => void }) {
  const [contacts, setContacts] = useState([
    { id: 1, name: "Dr. Sharma", role: "Admin", email: "admin@curametrix.com", phone: "+91 9876543210", sms: true, emailAlerts: true },
    { id: 2, name: "Pharmacist Ravi", role: "Pharmacist", email: "ravi@curametrix.com", phone: "+91 9123456780", sms: true, emailAlerts: false },
  ]);

  const [newContact, setNewContact] = useState({ name: "", role: "Pharmacist", email: "", phone: "", sms: true, emailAlerts: true });

  const handleAdd = () => {
    if (!newContact.name || (!newContact.email && !newContact.phone)) return alert("Name and at least one contact method required.");
    setContacts([...contacts, { id: Date.now(), ...newContact }]);
    setNewContact({ name: "", role: "Pharmacist", email: "", phone: "", sms: true, emailAlerts: true });
  };

  const removeContact = (id: number) => setContacts(contacts.filter(c => c.id !== id));

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="drawer" style={{ display: "flex", flexDirection: "column", width: "100%", maxWidth: 450 }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 17, fontWeight: 700 }}>Manage Alert Contacts</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><X size={20} /></button>
        </div>
        
        <div style={{ padding: 24, flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Add New */}
          <div style={{ background: "var(--bg)", padding: 16, borderRadius: 10, border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Add New Contact</div>
            <div style={{ display: "grid", gap: 10 }}>
              <input className="input" placeholder="Name" value={newContact.name} onChange={e => setNewContact({...newContact, name: e.target.value})} />
              <select className="select" value={newContact.role} onChange={e => setNewContact({...newContact, role: e.target.value})}>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Pharmacist">Pharmacist</option>
              </select>
              <input className="input" placeholder="Email Address" value={newContact.email} onChange={e => setNewContact({...newContact, email: e.target.value})} />
              <input className="input" placeholder="Phone Number (e.g. +91...)" value={newContact.phone} onChange={e => setNewContact({...newContact, phone: e.target.value})} />
              <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
                <label style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                  <input type="checkbox" checked={newContact.sms} onChange={e => setNewContact({...newContact, sms: e.target.checked})} /> SMS
                </label>
                <label style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                  <input type="checkbox" checked={newContact.emailAlerts} onChange={e => setNewContact({...newContact, emailAlerts: e.target.checked})} /> Email
                </label>
              </div>
              <button className="btn-primary" style={{ marginTop: 8 }} onClick={handleAdd}>Add Contact</button>
            </div>
          </div>

          {/* List */}
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Active Contacts</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {contacts.map(c => (
                <div key={c.id} style={{ border: "1px solid var(--border)", padding: 14, borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{c.name} <span style={{ fontSize: 11, fontWeight: 400, color: "var(--text-muted)", background: "#F1F5F9", padding: "2px 6px", borderRadius: 4 }}>{c.role}</span></div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                      {c.email && <div>✉️ {c.email}</div>}
                      {c.phone && <div>📞 {c.phone}</div>}
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                      {c.sms && <span style={{ fontSize: 10, background: "#DCFCE7", color: "#15803D", padding: "2px 6px", borderRadius: 4, fontWeight: 600 }}>SMS Active</span>}
                      {c.emailAlerts && <span style={{ fontSize: 10, background: "#DBEAFE", color: "#1D4ED8", padding: "2px 6px", borderRadius: 4, fontWeight: 600 }}>Email Active</span>}
                    </div>
                  </div>
                  <button onClick={() => removeContact(c.id)} style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", padding: 8 }}><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function AlertsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [showContacts, setShowContacts] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>(extendedAlerts);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const res = await fetchWithAuth('/api/alerts');
        const data = await res.json();
        if (data.alerts) {
          setAlerts(prev => {
            const liveIds = new Set(data.alerts.map((a: any) => a.id));
            const filteredMock = prev.filter(a => !liveIds.has(a.id));
            return [...data.alerts, ...filteredMock];
          });
        }
      } catch (e) {
        console.error("Failed to fetch alerts:", e);
      }
    }
    fetchAlerts();
  }, []);

  const runAiAnalysis = async () => {
    setLoadingAi(true);
    try {
      const res = await fetchWithAuth('/api/ai/generate-orders', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert(`AI Analysis Complete! Generated ${data.ordersGenerated} new reorder alerts based on ${data.weather} conditions.`);
        if (data.orders) {
          setAlerts(prev => [...data.orders, ...prev]);
        }
      } else {
        alert("Error: " + data.error);
      }
    } catch (e) {
      alert("Failed to run AI analysis.");
    } finally {
      setLoadingAi(false);
    }
  };

  const filtered = alerts.filter(a => {
    if (activeTab === "all") return true;
    if (activeTab === "ai_orders") return a.type === "auto_order" || a.type === "transfer";
    return a.type === activeTab;
  });

  const counts = {
    all: alerts.length,
    critical: alerts.filter(a => a.severity === "critical").length,
    expiry: alerts.filter(a => a.type === "expiry").length,
    low_stock: alerts.filter(a => a.type === "low_stock").length,
    fraud: alerts.filter(a => a.type === "fraud").length,
    info: alerts.filter(a => a.severity === "info").length,
  } as Record<string, number>;

  const acknowledge = (id: string) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: "acknowledged" as const } : a));
  const resolve = (id: string) => setAlerts(prev => prev.filter(a => a.id !== id));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Stats Row */}
      <div style={{ display: "flex", gap: 12 }}>
        {[
          { label: "Active Alerts", value: alerts.filter(a => a.status === "active").length, color: "#EF4444", bg: "#FEF2F2" },
          { label: "Critical", value: counts.critical, color: "#DC2626", bg: "#FFF5F5" },
          { label: "SMS Sent Today", value: alerts.filter(a => a.smsSent).length, color: "#10B981", bg: "#F0FDF4" },
          { label: "Emails Sent Today", value: alerts.filter(a => a.emailSent).length, color: "#0EA5E9", bg: "#F0F9FF" },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: s.bg, borderRadius: 10, padding: "14px 18px", border: `1px solid ${s.color}20` }}>
            <div style={{ fontSize: 26, fontWeight: 800, fontFamily: "JetBrains Mono, monospace", color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* SMS/Email Notification Panel */}
      <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", padding: "14px 18px", display: "flex", gap: 20, alignItems: "center" }}>
        <div style={{ fontSize: 16, fontWeight: 700 }}>📬 Notification Channels</div>
        <div style={{ display: "flex", gap: 12, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: "#F0FDF4", borderRadius: 8, border: "1px solid #BBF7D0" }}>
            <Phone size={15} color="#10B981" />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#15803D" }}>SMS Active</span>
            <span style={{ fontSize: 11, color: "#64748B" }}>· Pharmacist, Manager, Admin</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: "#EFF6FF", borderRadius: 8, border: "1px solid #BFDBFE" }}>
            <Mail size={15} color="#2563EB" />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1D4ED8" }}>Email Active</span>
            <span style={{ fontSize: 11, color: "#64748B" }}>· All roles + weekly reports</span>
          </div>
        </div>
        <button className="btn-primary" style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }} 
          onClick={runAiAnalysis} disabled={loadingAi}>
          {loadingAi ? 'Analyzing...' : <><Brain size={15} /> Run AI Demand Analysis</>}
        </button>
        <button className="btn-secondary" style={{ fontSize: 13 }} onClick={() => setShowContacts(true)}>Manage Contacts</button>
      </div>

      {/* Tabs */}
      <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden" }}>
        <div style={{ display: "flex", borderBottom: "1px solid var(--border)", overflowX: "auto" }}>
          {tabConfig.map(tab => {
            const count = counts[tab.key] ?? 0;
            const isActive = activeTab === tab.key;
            return (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                padding: "12px 20px", border: "none", background: "none",
                cursor: "pointer", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap",
                color: isActive ? "var(--accent)" : "var(--text-muted)",
                borderBottom: isActive ? "2px solid var(--accent)" : "2px solid transparent",
                display: "flex", alignItems: "center", gap: 7, transition: "all 0.15s",
              }}>
                <tab.icon size={14} />
                {tab.label}
                {count > 0 && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 999,
                    background: isActive ? "var(--accent)" : "#F1F5F9",
                    color: isActive ? "white" : "var(--text-muted)",
                  }}>{count}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Alert Cards */}
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>
              <CheckCircle2 size={40} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
              <div style={{ fontSize: 15, fontWeight: 600 }}>All clear!</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>No alerts in this category.</div>
            </div>
          )}
          {filtered.map(alert => {
            const cfg = severityConfig[alert.severity];
            const typeColor = alertTypeColor[alert.type];
            return (
              <div key={alert.id} style={{
                background: alert.status === "acknowledged" ? "#FAFAFA" : cfg.bg,
                border: `1px solid ${alert.status === "acknowledged" ? "var(--border)" : cfg.border}`,
                borderLeft: `4px solid ${alert.status === "acknowledged" ? "#CBD5E1" : typeColor}`,
                borderRadius: 10, padding: "14px 16px",
                opacity: alert.status === "acknowledged" ? 0.7 : 1,
                transition: "all 0.2s",
              }} className="alert-entry">
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  {/* Icon */}
                  <div style={{
                    width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                    background: `${typeColor}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                  }}>
                    {alertTypeIcon[alert.type]}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{alert.title}</span>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 999, textTransform: "uppercase",
                        background: alert.severity === "critical" ? "#FEE2E2" : alert.severity === "warning" ? "#FEF3C7" : "#E0F2FE",
                        color: alert.severity === "critical" ? "#B91C1C" : alert.severity === "warning" ? "#B45309" : "#0369A1",
                      }}>{alert.severity}</span>
                      {alert.status === "acknowledged" && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 999, background: "#F1F5F9", color: "#64748B" }}>ACKNOWLEDGED</span>}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5, marginBottom: 8 }}>{alert.message}</div>

                    {/* Notification status */}
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                        {new Date(alert.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {alert.smsSent && (
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#15803D", background: "#DCFCE7", padding: "2px 8px", borderRadius: 999, display: "flex", alignItems: "center", gap: 4 }}>
                          <Phone size={10} /> SMS Sent
                        </span>
                      )}
                      {alert.emailSent && (
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#1D4ED8", background: "#DBEAFE", padding: "2px 8px", borderRadius: 999, display: "flex", alignItems: "center", gap: 4 }}>
                          <Mail size={10} /> Email Sent
                        </span>
                      )}
                      {!alert.smsSent && !alert.emailSent && (
                        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>No notification sent</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    {alert.status === "active" && (
                      <>
                        <button className="btn-ghost" style={{ fontSize: 12, padding: "5px 10px" }} onClick={() => acknowledge(alert.id)}>
                          <CheckCircle2 size={13} /> Acknowledge
                        </button>
                        <button style={{
                          background: "none", border: "none", cursor: "pointer",
                          color: "var(--text-muted)", padding: "5px 6px", borderRadius: 6,
                        }} onClick={() => resolve(alert.id)}>
                          <X size={15} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showContacts && <ManageContactsDrawer onClose={() => setShowContacts(false)} />}
    </div>
  );
}
