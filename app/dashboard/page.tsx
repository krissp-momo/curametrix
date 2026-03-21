"use client";

import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import {
  TrendingUp, TrendingDown, Package, Clock, AlertTriangle,
  ShieldAlert, Brain, ChevronRight, CheckCircle, Zap,
  ArrowUpRight, ArrowDownRight
} from "lucide-react";
import {
  mockKPIs, mockAlerts, mockDispensingLogs,
  mockDemandPredictions, stockUsageChartData,
  expiryTimelineData, categoryBreakdownData
} from "@/lib/mockData";
import { formatLargeNumber, formatCurrency } from "@/lib/utils";

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KPICard({
  title, value, unit, change, changeLabel, color, icon: Icon, subtitle
}: {
  title: string; value: string | number; unit?: string; change?: number;
  changeLabel?: string; color: "green" | "blue" | "orange" | "red";
  icon: React.ElementType; subtitle?: string;
}) {
  const isPositive = (change ?? 0) >= 0;
  const colorMap = { green: "#10B981", blue: "#0EA5E9", orange: "#F59E0B", red: "#EF4444" };
  const bgMap = { green: "#D1FAE5", blue: "#E0F2FE", orange: "#FEF3C7", red: "#FEE2E2" };

  return (
    <div className={`kpi-card ${color}`} style={{ flex: 1, minWidth: 200 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)" }}>{title}</div>
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: bgMap[color],
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={18} color={colorMap[color]} />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 6 }}>
        <span className="stat-number">{value}</span>
        {unit && <span style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 500 }}>{unit}</span>}
      </div>
      {subtitle && <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>{subtitle}</div>}
      {change !== undefined && (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {isPositive
            ? <ArrowUpRight size={13} color={color === "red" || color === "orange" ? "#EF4444" : "#10B981"} />
            : <ArrowDownRight size={13} color="#10B981" />}
          <span style={{
            fontSize: 12, fontWeight: 600,
            color: color === "green" ? (isPositive ? "#10B981" : "#EF4444")
              : color === "red" ? (isPositive ? "#EF4444" : "#10B981")
              : "#64748B"
          }}>
            {Math.abs(change)}% {changeLabel}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Alert Strip Item ─────────────────────────────────────────────────────────
function AlertStripItem({ alert }: { alert: typeof mockAlerts[0] }) {
  const colors = { critical: "#EF4444", warning: "#F59E0B", info: "#0EA5E9" };
  const bg = { critical: "#FEF2F2", warning: "#FFFBEB", info: "#F0F9FF" };
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "10px 14px",
      background: bg[alert.severity],
      borderLeft: `3px solid ${colors[alert.severity]}`,
      borderRadius: 8, marginBottom: 6,
    }}>
      <AlertTriangle size={15} color={colors[alert.severity]} style={{ flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{alert.title}</span>
        <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: 8 }}>
          {alert.message.slice(0, 90)}…
        </span>
      </div>
      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
        {alert.smsSent && <span style={{ fontSize: 11, color: "#10B981", fontWeight: 600, background: "#D1FAE5", padding: "2px 7px", borderRadius: 999 }}>📱 SMS</span>}
        {alert.emailSent && <span style={{ fontSize: 11, color: "#0EA5E9", fontWeight: 600, background: "#E0F2FE", padding: "2px 7px", borderRadius: 999 }}>📧 Email</span>}
        <button className="btn-ghost" style={{ padding: "3px 10px", fontSize: 12 }}>View</button>
      </div>
    </div>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>{label}</div>
        {payload.map((p: any) => (
          <div key={p.name} style={{ fontSize: 14, fontWeight: 700, color: p.color }}>
            {typeof p.value === "number" && p.name === "value" ? formatCurrency(p.value) : `${p.value} units`}
          </div>
        ))}
      </div>
    );
  }
  return null;
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const kpi = mockKPIs;
  const criticalAlerts = mockAlerts.filter(a => a.severity === "critical" && a.status === "active");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Welcome Banner */}
      <div style={{
        background: "linear-gradient(135deg, var(--primary) 0%, #2D4FA3 60%, #1a5276 100%)",
        borderRadius: 14, padding: "20px 28px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        color: "white", overflow: "hidden", position: "relative",
      }}>
        <div style={{ position: "absolute", right: -20, top: -20, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "absolute", right: 60, bottom: -40, width: 120, height: 120, borderRadius: "50%", background: "rgba(16,185,129,0.1)" }} />
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>
            Good afternoon, Admin 👋
          </div>
          <div style={{ fontSize: 14, opacity: 0.8 }}>
            City General Hospital · Saturday, 21 March 2026
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
            <div style={{ fontSize: 13, opacity: 0.9 }}>
              <span style={{ fontWeight: 700, color: "#FCD34D" }}>⚠️ {criticalAlerts.length} critical alerts</span> need attention
            </div>
            <div style={{ fontSize: 13, opacity: 0.9 }}>
              🤖 AI forecast accuracy: <span style={{ fontWeight: 700, color: "#6EE7B7" }}>{kpi.forecastAccuracy}%</span>
            </div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>Total Inventory Value</div>
          <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "JetBrains Mono, monospace" }}>
            {formatLargeNumber(kpi.totalStockValue)}
          </div>
          <div style={{ fontSize: 12, opacity: 0.6 }}>{kpi.totalItems} active medicines</div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <KPICard
          title="Total Stock Value" value={formatLargeNumber(kpi.totalStockValue)}
          color="green" icon={TrendingUp} change={4.2} changeLabel="vs last month"
          subtitle={`${kpi.totalItems} medicines tracked`}
        />
        <KPICard
          title="Expiring Soon" value={kpi.expiringSoon} unit="items"
          color="orange" icon={Clock} change={8.5} changeLabel="increase"
          subtitle="Within next 30 days"
        />
        <KPICard
          title="Low / Out of Stock" value={kpi.lowStockCount + kpi.outOfStockCount} unit="items"
          color="red" icon={Package} change={kpi.outOfStockCount} changeLabel="out of stock"
          subtitle={`${kpi.outOfStockCount} completely out`}
        />
        <KPICard
          title="Fraud Alerts" value={kpi.fraudAlerts} unit="active"
          color="red" icon={ShieldAlert}
          subtitle="Anomalies detected today"
        />
        <KPICard
          title="Pending PO Orders" value={kpi.pendingOrders} unit="orders"
          color="blue" icon={Package}
          subtitle="Awaiting approval or delivery"
        />
        <KPICard
          title="Forecast Accuracy" value={`${kpi.forecastAccuracy}%`}
          color="green" icon={Brain}
          subtitle={`Turnover: ${kpi.inventoryTurnoverRate}x/month`}
        />
      </div>

      {/* Critical Alerts Strip */}
      {criticalAlerts.length > 0 && (
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #FECACA", overflow: "hidden" }}>
          <div style={{
            padding: "10px 16px", background: "#FEF2F2",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            borderBottom: "1px solid #FECACA",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, background: "#EF4444", borderRadius: "50%", animation: "pulse 1.5s infinite" }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#B91C1C" }}>
                🚨 {criticalAlerts.length} Critical Alerts Require Immediate Action
              </span>
            </div>
            <a href="/dashboard/alerts" style={{ fontSize: 12, color: "#EF4444", fontWeight: 600, textDecoration: "none" }}>
              View All →
            </a>
          </div>
          <div style={{ padding: "12px 12px 6px" }}>
            {criticalAlerts.map(a => <AlertStripItem key={a.id} alert={a} />)}
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Stock Usage Chart */}
        <div className="chart-container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Stock Usage Trend</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Units dispensed — Last 21 days</div>
            </div>
            <span className="badge badge-success">↑ 12% vs last period</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={stockUsageChartData}>
              <defs>
                <linearGradient id="green-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="units" stroke="#10B981" strokeWidth={2.5}
                fill="url(#green-gradient)" dot={false} activeDot={{ r: 5, fill: "#10B981" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Expiry Timeline */}
        <div className="chart-container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Expiry Timeline</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Medicines by expiry window</div>
            </div>
            <a href="/dashboard/expiry" style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>Manage →</a>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={expiryTimelineData} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(v: any, name: string) => [
                  name === "value" ? formatCurrency(v) : `${v} items`, name === "value" ? "Est. Loss" : "Items"
                ]}
                contentStyle={{ borderRadius: 8, border: "1px solid var(--border)", fontSize: 13 }}
              />
              <Bar dataKey="count" fill="#F59E0B" radius={[4, 4, 0, 0]} name="count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Breakdown + Category Legend Row */}
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr 1fr", gap: 16 }}>
        {/* Pie chart */}
        <div className="chart-container">
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>By Category</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>Stock distribution %</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={categoryBreakdownData} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                dataKey="value" paddingAngle={2}>
                {categoryBreakdownData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: any) => [`${v}%`, "Share"]} contentStyle={{ borderRadius: 8, fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {categoryBreakdownData.map(c => (
              <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: c.color, flexShrink: 0 }} />
                <span style={{ color: "var(--text-muted)", flex: 1 }}>{c.name}</span>
                <span style={{ fontWeight: 700, color: "var(--text)", fontFamily: "JetBrains Mono, monospace" }}>{c.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Dispensing Logs */}
        <div className="chart-container" style={{ gridColumn: "span 1" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Recent Dispensing</div>
            <a href="/dashboard/dispensing" style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>View All →</a>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {mockDispensingLogs.map(log => (
              <div key={log.id} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "9px 0",
                borderBottom: "1px solid #F8FAFC",
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: "var(--accent-light)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, flexShrink: 0,
                }}>💊</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {log.medicineName}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    {log.patientName} · {log.dispensedByName}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{log.quantity} units</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    {new Date(log.dispensedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Reorder Suggestions */}
        <div className="chart-container card-accent">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Brain size={16} color="var(--accent)" />
              <span style={{ fontSize: 15, fontWeight: 700 }}>AI Reorder Suggestions</span>
            </div>
            <a href="/dashboard/ai-insights" style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>All Insights →</a>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {mockDemandPredictions.map(pred => (
              <div key={pred.medicineId} style={{
                padding: "12px 14px",
                border: pred.daysUntilStockout <= 10 ? "1px solid #FECACA" : "1px solid var(--border)",
                borderRadius: 10,
                background: pred.daysUntilStockout <= 10 ? "#FFF5F5" : "var(--bg)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{pred.medicineName}</div>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999,
                    background: pred.daysUntilStockout <= 10 ? "#fee2e2" : "#D1FAE5",
                    color: pred.daysUntilStockout <= 10 ? "#b91c1c" : "#15803d",
                  }}>
                    {pred.daysUntilStockout}d left
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>
                  <span>Stock: <b style={{ color: "var(--text)" }}>{pred.currentStock} units</b></span>
                  <span>Predicted: <b style={{ color: "var(--text)" }}>{pred.predictedDemand}/mo</b></span>
                  <span>Confidence: <b style={{ color: "var(--accent)" }}>{Math.round(pred.confidenceScore * 100)}%</b></span>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="btn-primary" style={{ flex: 1, justifyContent: "center", fontSize: 12, padding: "6px 10px" }}>
                    <Zap size={12} /> Order {pred.reorderSuggested} units
                  </button>
                  <button className="btn-ghost" style={{ padding: "6px 10px", fontSize: 12 }}>
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stock Efficiency KPIs row */}
      <div style={{ display: "flex", gap: 16 }}>
        {[
          { label: "Stock Efficiency", value: `${kpi.stockEfficiency}%`, icon: "📊", sub: "Optimal inventory usage", color: "#10B981" },
          { label: "Expiry Waste This Month", value: formatCurrency(kpi.expiryWastageValue), icon: "🗑️", sub: "Estimated loss", color: "#EF4444" },
          { label: "Inventory Turnover", value: `${kpi.inventoryTurnoverRate}×`, icon: "🔄", sub: "Per month", color: "#0EA5E9" },
          { label: "Forecast Accuracy", value: `${kpi.forecastAccuracy}%`, icon: "🤖", sub: "AI model performance", color: "#8B5CF6" },
        ].map(m => (
          <div key={m.label} style={{
            flex: 1, background: "white", borderRadius: 12, padding: "16px 18px",
            border: "1px solid var(--border)", textAlign: "center",
          }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{m.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: m.color, fontFamily: "JetBrains Mono, monospace" }}>{m.value}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", margin: "4px 0 2px" }}>{m.label}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{m.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
