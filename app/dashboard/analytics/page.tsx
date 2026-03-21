"use client";

import { useState } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Download, TrendingUp, TrendingDown, DollarSign, Package, Trash2 } from "lucide-react";
import { formatCurrency, formatLargeNumber } from "@/lib/utils";
import { stockUsageChartData, expiryTimelineData, categoryBreakdownData } from "@/lib/mockData";

const monthlyRevenue = [
  { month: "Oct", revenue: 485000, cost: 320000, profit: 165000 },
  { month: "Nov", revenue: 520000, cost: 345000, profit: 175000 },
  { month: "Dec", revenue: 498000, cost: 330000, profit: 168000 },
  { month: "Jan", revenue: 612000, cost: 390000, profit: 222000 },
  { month: "Feb", revenue: 578000, cost: 372000, profit: 206000 },
  { month: "Mar", revenue: 643000, cost: 408000, profit: 235000 },
];

const wastageData = [
  { category: "Expired", value: 84200, color: "#EF4444" },
  { category: "Damaged", value: 28500, color: "#F59E0B" },
  { category: "Recalled", value: 12000, color: "#8B5CF6" },
  { category: "Returned", value: 18300, color: "#0EA5E9" },
];

const topMovers = {
  fast: [
    { name: "Insulin Glargine", units: 840, value: 688800 },
    { name: "Amoxicillin 500mg", units: 1240, value: 14880 },
    { name: "Adrenaline 1mg", units: 312, value: 14976 },
  ],
  slow: [
    { name: "Vitamin B12 Inj", units: 12, value: 3600 },
    { name: "Zinc Sulphate", units: 8, value: 480 },
    { name: "Calcium Gluconate", units: 15, value: 1500 },
  ],
};

const kpiCards = [
  { label: "Total Revenue (Mar)", value: formatLargeNumber(643000), change: "+11.2%", up: true, icon: TrendingUp, color: "#10B981", bg: "#F0FDF4" },
  { label: "Total Cost (Mar)", value: formatLargeNumber(408000), change: "+9.7%", up: false, icon: DollarSign, color: "#0EA5E9", bg: "#F0F9FF" },
  { label: "Gross Profit (Mar)", value: formatLargeNumber(235000), change: "+14.1%", up: true, icon: TrendingUp, color: "#1E3A8A", bg: "#EFF6FF" },
  { label: "Wastage Loss (Mar)", value: formatLargeNumber(84200), change: "-5.2%", up: true, icon: Trash2, color: "#EF4444", bg: "#FEF2F2" },
];

const tabs = ["Overview", "Financial P&L", "Wastage Analysis", "Fast/Slow Movers", "KPI Metrics"];

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("Overview");

  const handleDownload = (type: "PDF" | "Excel") => {
    alert(`Generating ${type} report for ${activeTab}... (Mock download).\n\nReal data export will be enabled once we connect the backing database.`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Tabs + Export */}
      <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 16px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", overflowX: "auto" }}>
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: "13px 18px", border: "none", background: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 600, whiteSpace: "nowrap",
                color: activeTab === tab ? "var(--accent)" : "var(--text-muted)",
                borderBottom: activeTab === tab ? "2px solid var(--accent)" : "2px solid transparent",
                transition: "all 0.15s",
              }}>{tab}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-ghost" onClick={() => handleDownload("PDF")} style={{ fontSize: 12, gap: 5 }}><Download size={13} /> PDF</button>
            <button className="btn-ghost" onClick={() => handleDownload("Excel")} style={{ fontSize: 12, gap: 5 }}><Download size={13} /> Excel</button>
          </div>
        </div>

        <div style={{ padding: 20 }}>
          {/* KPI Cards */}
          <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            {kpiCards.map(k => (
              <div key={k.label} style={{ flex: 1, minWidth: 160, background: k.bg, borderRadius: 10, padding: "14px 16px", border: `1px solid ${k.color}20` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>{k.label}</span>
                  <k.icon size={16} color={k.color} />
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: k.color, fontFamily: "JetBrains Mono, monospace" }}>{k.value}</div>
                <div style={{ fontSize: 12, color: k.up ? "#15803D" : "#DC2626", fontWeight: 600, marginTop: 4 }}>{k.change} vs last month</div>
              </div>
            ))}
          </div>

          {activeTab === "Overview" || activeTab === "Financial P&L" ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Monthly Revenue vs Cost vs Profit</div>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={monthlyRevenue} barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(v: any) => formatCurrency(v)} contentStyle={{ borderRadius: 8, fontSize: 13, border: "1px solid var(--border)" }} />
                    <Bar dataKey="revenue" fill="#0EA5E9" radius={[3, 3, 0, 0]} name="Revenue" />
                    <Bar dataKey="cost" fill="#F59E0B" radius={[3, 3, 0, 0]} name="Cost" />
                    <Bar dataKey="profit" fill="#10B981" radius={[3, 3, 0, 0]} name="Profit" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Stock Usage Trend</div>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={stockUsageChartData}>
                    <defs>
                      <linearGradient id="blue-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13, border: "1px solid var(--border)" }} />
                    <Area type="monotone" dataKey="units" stroke="#0EA5E9" strokeWidth={2} fill="url(#blue-grad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : activeTab === "Wastage Analysis" ? (
            <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Wastage by Type</div>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={wastageData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`} labelLine={false}>
                      {wastageData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: any) => formatCurrency(v)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Wastage Breakdown</div>
                <div className="table-container">
                  <table>
                    <thead><tr><th>Type</th><th>Value</th><th>% of Total</th></tr></thead>
                    <tbody>
                      {wastageData.map(w => {
                        const total = wastageData.reduce((s, x) => s + x.value, 0);
                        return (
                          <tr key={w.category}>
                            <td><span style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 10, height: 10, borderRadius: 3, background: w.color }} />{w.category}</span></td>
                            <td><span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700 }}>{formatCurrency(w.value)}</span></td>
                            <td><span className="badge badge-warning">{((w.value / total) * 100).toFixed(1)}%</span></td>
                          </tr>
                        );
                      })}
                      <tr><td style={{ fontWeight: 700 }}>Total</td><td style={{ fontWeight: 800, fontFamily: "JetBrains Mono, monospace" }}>{formatCurrency(wastageData.reduce((s, w) => s + w.value, 0))}</td><td>100%</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : activeTab === "Fast/Slow Movers" ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {[{ label: "🚀 Fast Movers", data: topMovers.fast, color: "#10B981" }, { label: "🐢 Slow Movers", data: topMovers.slow, color: "#F59E0B" }].map(g => (
                <div key={g.label}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>{g.label}</div>
                  <div className="table-container">
                    <table>
                      <thead><tr><th>Medicine</th><th>Units/Month</th><th>Value</th></tr></thead>
                      <tbody>
                        {g.data.map(d => (
                          <tr key={d.name}>
                            <td style={{ fontWeight: 600 }}>{d.name}</td>
                            <td><span style={{ fontFamily: "JetBrains Mono,monospace", color: g.color, fontWeight: 700 }}>{d.units}</span></td>
                            <td><span style={{ fontFamily: "JetBrains Mono,monospace", fontWeight: 700 }}>{formatCurrency(d.value)}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {[
                { label: "Inventory Turnover Rate", value: "4.2×", sub: "per month", color: "#0EA5E9" },
                { label: "Stock Efficiency", value: "87.3%", sub: "optimal utilization", color: "#10B981" },
                { label: "Forecast Accuracy", value: "91.4%", sub: "AI model", color: "#1E3A8A" },
                { label: "Expiry Savings (Mar)", value: "₹1.8L", sub: "prevented wastage", color: "#10B981" },
                { label: "Order Fill Rate", value: "96.7%", sub: "on-time delivery", color: "#0EA5E9" },
                { label: "Customer Dues", value: "₹2.4L", sub: "pending payments", color: "#EF4444" },
              ].map(m => (
                <div key={m.label} style={{ background: "var(--bg)", borderRadius: 12, padding: "18px 20px", border: "1px solid var(--border)", textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: m.color, fontFamily: "JetBrains Mono, monospace" }}>{m.value}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", margin: "6px 0 3px" }}>{m.label}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{m.sub}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
