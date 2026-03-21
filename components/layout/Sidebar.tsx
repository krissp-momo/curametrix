"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, Clock, Bell, Brain, BarChart3,
  Truck, Thermometer, ShieldCheck, AlertTriangle, Users,
  Settings, ChevronLeft, ChevronRight, Activity,
  ClipboardList, ArrowLeftRight
} from "lucide-react";

const navSections = [
  {
    label: "Overview",
    items: [
      { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    ],
  },
  {
    label: "Inventory",
    items: [
      { href: "/dashboard/inventory", icon: Package, label: "Medicines & Stock" },
      { href: "/dashboard/expiry", icon: Clock, label: "Expiry Management" },
      { href: "/dashboard/dispensing", icon: ClipboardList, label: "Dispensing Logs" },
    ],
  },
  {
    label: "Alerts",
    items: [
      { href: "/dashboard/alerts", icon: Bell, label: "Notification Center" },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { href: "/dashboard/ai-insights", icon: Brain, label: "AI Insights" },
      { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics & Reports" },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/dashboard/supply-chain", icon: Truck, label: "Supply Chain" },
      { href: "/dashboard/transfers", icon: ArrowLeftRight, label: "Hospital Transfers" },
      { href: "/dashboard/cold-chain", icon: Thermometer, label: "Cold Chain" },
    ],
  },
  {
    label: "Governance",
    items: [
      { href: "/dashboard/compliance", icon: ShieldCheck, label: "Compliance" },
      { href: "/dashboard/fraud", icon: AlertTriangle, label: "Fraud Detection" },
      { href: "/dashboard/audit", icon: Activity, label: "Audit Trail" },
    ],
  },
  {
    label: "Admin",
    items: [
      { href: "/dashboard/users", icon: Users, label: "Users & Roles" },
      { href: "/dashboard/settings", icon: Settings, label: "Settings" },
    ],
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar */}
      <aside
        className="sidebar"
        style={{ width: collapsed ? "var(--sidebar-collapsed)" : "var(--sidebar-width)" }}
      >
        {/* Logo */}
        <div className="sidebar-logo">
          <div
            style={{
              width: 36, height: 36, borderRadius: 8,
              background: "rgba(16,185,129,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 18 }}>💊</span>
          </div>
          {!collapsed && (
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#fff", lineHeight: 1.2, whiteSpace: "nowrap" }}>
                Curametrix
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>
                DRUG INVENTORY AI
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "8px 0" }}>
          {navSections.map((section) => (
            <div key={section.label}>
              {!collapsed && (
                <div className="sidebar-section-label">{section.label}</div>
              )}
              {section.items.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`sidebar-nav-item ${isActive ? "active" : ""}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon size={18} style={{ flexShrink: 0 }} />
                    {!collapsed && (
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                        {item.label}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            margin: "12px 8px",
            padding: "10px",
            background: "rgba(255,255,255,0.08)",
            border: "none",
            borderRadius: 8,
            color: "rgba(255,255,255,0.6)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            gap: 8,
            fontSize: 13,
            fontWeight: 500,
            transition: "background 0.2s",
            width: "calc(100% - 16px)",
          }}
        >
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Collapse</span></>}
        </button>

        {/* Hospital badge at bottom */}
        {!collapsed && (
          <div style={{
            margin: "0 8px 16px",
            padding: "10px 12px",
            background: "rgba(16,185,129,0.12)",
            borderRadius: 8,
            border: "1px solid rgba(16,185,129,0.2)",
          }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Hospital</div>
            <div style={{ fontSize: 13, color: "#fff", fontWeight: 600, marginTop: 2 }}>City General Hospital</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 1 }}>License: MH-PH-2024-001</div>
          </div>
        )}
      </aside>
    </>
  );
}
