"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Search, ChevronDown, AlertTriangle, User, LogOut, Settings, HelpCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { mockAlerts } from "@/lib/mockData";

const activeAlerts = mockAlerts.filter(a => a.status === "active");

export default function Header({ pageTitle }: { pageTitle?: string }) {
  const router = useRouter();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);

  return (
    <>
      <header className="header" style={{ marginLeft: 0, gap: 12, zIndex: 100 }}>
        {/* Page Title */}
        <div style={{ flex: 1 }}>
          {pageTitle && (
            <h1 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", margin: 0 }}>
              {pageTitle}
            </h1>
          )}
        </div>

        {/* Search Bar */}
        <div style={{ position: "relative", width: 280 }}>
          <Search size={15} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            className="input input-search"
            placeholder="Search medicines, alerts…"
            style={{ height: 36, fontSize: 13, paddingLeft: 34 }}
          />
        </div>

        {/* Notification Bell */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => { setShowNotifs(!showNotifs); setShowProfile(false); }}
            style={{
              width: 38, height: 38,
              background: showNotifs ? "var(--accent-light)" : "#f1f5f9",
              border: "none", borderRadius: 8, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative", transition: "background 0.2s",
            }}
          >
            <Bell size={17} color={showNotifs ? "var(--accent)" : "var(--text-muted)"} />
            {activeAlerts.length > 0 && <span className="notif-dot" />}
          </button>

          {/* Notif Dropdown */}
          {showNotifs && (
            <div style={{
              position: "absolute", top: 46, right: 0, width: 360,
              background: "white", borderRadius: 12,
              border: "1px solid var(--border)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)", zIndex: 100,
              animation: "slideInUp 0.2s ease",
            }}>
              <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>Notifications</span>
                <span style={{ fontSize: 11, background: "#fee2e2", color: "#b91c1c", borderRadius: 999, padding: "2px 8px", fontWeight: 600 }}>
                  {activeAlerts.length} Active
                </span>
              </div>
              <div style={{ maxHeight: 320, overflowY: "auto" }}>
                {mockAlerts.slice(0, 4).map(alert => (
                  <div key={alert.id} style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid #f8fafc",
                    display: "flex", gap: 10, alignItems: "flex-start",
                    cursor: "pointer", transition: "background 0.15s",
                  }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#f8fff8")}
                    onMouseLeave={e => (e.currentTarget.style.background = "white")}
                  >
                    <div style={{
                      width: 8, height: 8, borderRadius: "50%", marginTop: 5, flexShrink: 0,
                      background: alert.severity === "critical" ? "var(--danger)" : alert.severity === "warning" ? "var(--warning)" : "var(--secondary)",
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{alert.title}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{alert.message.slice(0, 80)}…</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                        {new Date(alert.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        {alert.smsSent && <span style={{ marginLeft: 8, color: "var(--accent)", fontWeight: 600 }}>📱 SMS sent</span>}
                        {alert.emailSent && <span style={{ marginLeft: 6, color: "var(--secondary)", fontWeight: 600 }}>📧 Email sent</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: "10px 16px" }}>
                <Link href="/dashboard/alerts" onClick={() => setShowNotifs(false)} style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
                  View all notifications →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotifs(false); }}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: showProfile ? "var(--accent-light)" : "#f1f5f9",
              border: "none", borderRadius: 8, padding: "6px 10px",
              cursor: "pointer", transition: "background 0.2s",
            }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: "var(--primary)",
              color: "white", fontSize: 12, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>AD</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Admin</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Administrator</div>
            </div>
            <ChevronDown size={14} color="var(--text-muted)" />
          </button>

          {showProfile && (
            <div
              onClick={e => e.stopPropagation()}
              style={{
                position: "absolute", top: 46, right: 0, width: 230,
                background: "white", borderRadius: 12,
                border: "1px solid var(--border)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.18)", zIndex: 200, overflow: "hidden",
              }}
            >
              {[
                { icon: User, label: "My Profile", href: "/dashboard/users" },
                { icon: Settings, label: "Account Settings", href: "/dashboard/users" },
                { icon: Bell, label: "Notification Preferences", href: "/dashboard/users" },
                { icon: RefreshCw, label: "Switch to Pharmacist View", action: () => alert('Role switching will be enabled with Firebase Auth.') },
                { icon: HelpCircle, label: "Help & Support", action: () => alert('Opening Help Center (mock).') },
                { divider: true, label: "div1" },
                { icon: LogOut, label: "Sign Out", href: "/login", danger: true },
              ].map(item => item.divider ? (
                <div key={item.label} style={{ height: 1, background: "var(--border)", margin: "4px 0" }} />
              ) : item.href ? (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setShowProfile(false)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, width: "100%",
                    padding: "11px 16px", cursor: "pointer", textDecoration: "none",
                    fontSize: 13, color: item.danger ? "var(--danger)" : "var(--text)",
                    fontWeight: 600, transition: "background 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = item.danger ? "#fef2f2" : "#f8fafc")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  {item.icon && <item.icon size={15} />}
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.label}
                  onClick={(e) => {
                    e.preventDefault();
                    if (item.action) item.action();
                    setShowProfile(false);
                  }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, width: "100%",
                    padding: "11px 16px", cursor: "pointer",
                    fontSize: 13, color: item.danger ? "var(--danger)" : "var(--text)",
                    fontWeight: 600, transition: "background 0.15s",
                    background: "none", border: "none", textAlign: "left",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = item.danger ? "#fef2f2" : "#f8fafc")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  {item.icon && <item.icon size={15} />}
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Emergency Alert Button */}
      <button
        className="emergency-btn"
        title="Emergency Alert"
        onClick={() => setShowEmergency(true)}
      >
        <AlertTriangle size={22} />
      </button>

      {/* Emergency Modal */}
      {showEmergency && (
        <>
          <div className="modal-backdrop" onClick={() => setShowEmergency(false)} />
          <div className="modal" style={{ maxWidth: 440 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🚨</div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--danger)", marginBottom: 8 }}>
                Emergency Alert
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 20 }}>
                This will immediately notify all authorized personnel via SMS and email about a critical shortage.
              </p>
              <textarea
                className="input"
                placeholder="Describe the emergency (e.g., Out of Adrenaline in ICU)…"
                rows={3}
                style={{ marginBottom: 16 }}
              />
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowEmergency(false)}>
                  Cancel
                </button>
                <button className="btn-danger" style={{ flex: 1 }}>
                  🚨 Send Emergency Alert
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Backdrop to close dropdowns */}
      {(showNotifs || showProfile) && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 90 }}
          onClick={() => { setShowNotifs(false); setShowProfile(false); }}
        />
      )}
    </>
  );
}
