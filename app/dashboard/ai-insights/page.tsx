"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from "recharts";
import { Brain, TrendingUp, Package, AlertTriangle, Zap, ChevronRight, Target } from "lucide-react";
import { mockDemandPredictions } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";

const forecastChartData = [
  { month: "Oct", actual: 180, predicted: 175 },
  { month: "Nov", actual: 220, predicted: 215 },
  { month: "Dec", actual: 195, predicted: 202 },
  { month: "Jan", actual: 240, predicted: 238 },
  { month: "Feb", actual: 210, predicted: 218 },
  { month: "Mar", actual: 265, predicted: null },
  { month: "Apr", actual: null, predicted: 272 },
  { month: "May", actual: null, predicted: 285 },
];

const wastePredictions = [
  { name: "Insulin Glargine", batch: "B-2024-01", expiry: "3 days", qty: 200, value: 164000, risk: "high" },
  { name: "Amoxicillin 500mg", batch: "B-2024-02", expiry: "12 days", qty: 60, value: 900, risk: "medium" },
  { name: "Morphine Sulfate", batch: "B-2024-03", expiry: "22 days", qty: 8, value: 1440, risk: "low" },
];

const stockoutData = [
  { medicine: "Insulin Glargine", current: 45, dailyUsage: 6.4, daysLeft: 7, reorder: 200, urgency: "critical" },
  { medicine: "Metformin 500mg", current: 89, dailyUsage: 10.7, daysLeft: 8, reorder: 300, urgency: "critical" },
  { medicine: "Amoxicillin 500mg", current: 1240, dailyUsage: 14.9, daysLeft: 83, reorder: 0, urgency: "safe" },
  { medicine: "Adrenaline 1mg", current: 156, dailyUsage: 2.0, daysLeft: 78, reorder: 0, urgency: "safe" },
];

function AccuracyGauge({ value }: { value: number }) {
  const angle = (value / 100) * 180 - 90;
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ position: "relative", width: 120, height: 70, margin: "0 auto" }}>
        <svg width="120" height="70" viewBox="0 0 120 70">
          <path d="M10 65 A50 50 0 0 1 110 65" stroke="#E2E8F0" strokeWidth="10" fill="none" strokeLinecap="round" />
          <path d="M10 65 A50 50 0 0 1 110 65" stroke="url(#gauge-grad)" strokeWidth="10" fill="none"
            strokeDasharray={`${(value / 100) * 157} 157`} strokeLinecap="round" />
          <defs>
            <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="60%" stopColor="#10B981" />
            </linearGradient>
          </defs>
        </svg>
        <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#10B981", fontFamily: "JetBrains Mono, monospace" }}>{value}%</div>
        </div>
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginTop: 4 }}>Forecast Accuracy</div>
    </div>
  );
}

export default function AIInsightsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* AI Banner */}
      <div style={{
        background: "linear-gradient(135deg, #1E3A8A 0%, #2D4FA3 50%, #10B981 100%)",
        borderRadius: 14, padding: "20px 28px", color: "white",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <Brain size={22} />
            <span style={{ fontSize: 20, fontWeight: 800 }}>AI Intelligence Hub</span>
          </div>
          <div style={{ fontSize: 14, opacity: 0.85 }}>
            Powered by scikit-learn linear regression · Trained on 18 months hospital data
          </div>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {[
            { label: "Model Accuracy", value: "91.4%" },
            { label: "Drugs Monitored", value: "847" },
            { label: "Predictions Today", value: "156" },
          ].map(m => (
            <div key={m.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "JetBrains Mono, monospace" }}>{m.value}</div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Row: Accuracy Gauge + Reorder Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 16 }}>
        {/* Gauge Card */}
        <div className="chart-container" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <AccuracyGauge value={91.4} />
          <div style={{ marginTop: 16, width: "100%" }}>
            {[
              { label: "Demand Forecast", acc: "91.4%" },
              { label: "Stockout Prediction", acc: "88.7%" },
              { label: "Waste Prediction", acc: "85.2%" },
            ].map(m => (
              <div key={m.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "5px 0", borderBottom: "1px solid #F8FAFC" }}>
                <span style={{ color: "var(--text-muted)" }}>{m.label}</span>
                <span style={{ fontWeight: 700, color: "var(--accent)" }}>{m.acc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Reorder Cards */}
        <div className="chart-container">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <Zap size={16} color="var(--accent)" />
            <span style={{ fontSize: 15, fontWeight: 700 }}>Smart Reorder Suggestions</span>
            <span className="badge badge-success" style={{ marginLeft: "auto" }}>Auto-Order Ready</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {mockDemandPredictions.map(pred => (
              <div key={pred.medicineId} style={{
                display: "flex", alignItems: "center", gap: 14, padding: "12px 14px",
                border: pred.daysUntilStockout <= 10 ? "1px solid #FECACA" : "1px solid var(--border)",
                borderRadius: 10,
                background: pred.daysUntilStockout <= 10 ? "#FFF5F5" : "var(--bg)",
              }}>
                <div style={{ fontSize: 22 }}>💊</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{pred.medicineName}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", gap: 12, marginTop: 2 }}>
                    <span>Stock: <b style={{ color: "var(--text)" }}>{pred.currentStock}</b></span>
                    <span>Demand: <b style={{ color: "var(--text)" }}>{pred.predictedDemand}/mo</b></span>
                    <span>Confidence: <b style={{ color: "var(--accent)" }}>{Math.round(pred.confidenceScore * 100)}%</b></span>
                  </div>
                </div>
                <div style={{ textAlign: "center", padding: "6px 12px", background: pred.daysUntilStockout <= 10 ? "#FEE2E2" : "#DCFCE7", borderRadius: 8 }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: pred.daysUntilStockout <= 10 ? "#DC2626" : "#15803D", fontFamily: "JetBrains Mono, monospace" }}>{pred.daysUntilStockout}d</div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600 }}>STOCKOUT</div>
                </div>
                <button className="btn-primary" style={{ fontSize: 13 }}>
                  Order {pred.reorderSuggested}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Forecast Chart */}
      <div className="chart-container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Demand Forecast — Actual vs Predicted</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Insulin Glargine · Last 5 months + 3-month forecast</div>
          </div>
          <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 12, height: 3, background: "#1E3A8A", borderRadius: 2 }} />Actual</span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 12, height: 3, background: "#10B981", borderRadius: 2, borderStyle: "dashed" }} />Predicted</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={forecastChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--border)", fontSize: 13 }} />
            <Line type="monotone" dataKey="actual" stroke="#1E3A8A" strokeWidth={2.5} dot={{ r: 4 }} connectNulls={false} name="Actual" />
            <Line type="monotone" dataKey="predicted" stroke="#10B981" strokeWidth={2.5} strokeDasharray="5 3" dot={{ r: 4, fill: "#10B981" }} connectNulls name="Predicted" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stockout Prediction Table + Waste Prediction */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Stockout */}
        <div className="chart-container">
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <Package size={16} color="var(--danger)" /> Stockout Timeline
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {stockoutData.map(s => (
              <div key={s.medicine} style={{ padding: "10px 12px", borderRadius: 8, background: "var(--bg)", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{s.medicine}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999,
                    background: s.urgency === "critical" ? "#FEE2E2" : "#DCFCE7",
                    color: s.urgency === "critical" ? "#DC2626" : "#15803D",
                  }}>{s.daysLeft}d left</span>
                </div>
                <div style={{ width: "100%", height: 5, background: "#E2E8F0", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{
                    width: `${Math.min((s.daysLeft / 90) * 100, 100)}%`, height: "100%",
                    background: s.urgency === "critical" ? "#EF4444" : "#10B981", borderRadius: 3,
                  }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                  <span>Stock: {s.current} · Usage: {s.dailyUsage}/day</span>
                  {s.urgency === "critical" && <span style={{ color: "#DC2626", fontWeight: 700 }}>⚠️ Reorder Now</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Waste Prediction */}
        <div className="chart-container">
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <AlertTriangle size={16} color="#F59E0B" /> Waste Prediction
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {wastePredictions.map(w => (
              <div key={w.name} style={{
                padding: "12px 14px", borderRadius: 10,
                background: w.risk === "high" ? "#FEF2F2" : w.risk === "medium" ? "#FFFBEB" : "var(--bg)",
                border: `1px solid ${w.risk === "high" ? "#FECACA" : w.risk === "medium" ? "#FCD34D" : "var(--border)"}`,
                borderLeft: `4px solid ${w.risk === "high" ? "#EF4444" : w.risk === "medium" ? "#F59E0B" : "#10B981"}`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{w.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#EF4444", fontFamily: "JetBrains Mono, monospace" }}>
                    {formatCurrency(w.value)}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  {w.qty} units · Batch {w.batch} · Expires in {w.expiry}
                </div>
                <div style={{ marginTop: 8 }}>
                  <button className="btn-primary" style={{ fontSize: 11, padding: "4px 10px" }}>Transfer / Discount</button>
                </div>
              </div>
            ))}
            <div style={{ padding: "12px 14px", borderRadius: 10, background: "#FEF2F2", border: "1px solid #FECACA", textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#DC2626", fontFamily: "JetBrains Mono, monospace" }}>
                {formatCurrency(wastePredictions.reduce((s, w) => s + w.value, 0))}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Predicted waste value this month</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
