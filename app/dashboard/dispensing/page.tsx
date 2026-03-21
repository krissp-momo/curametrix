"use client";
import { FileText, Clock, TrendingUp } from "lucide-react";
import { mockDispensingLogs } from "@/lib/mockData";
import { formatDate } from "@/lib/utils";

export default function DispensingPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 12 }}>
        {[
          { label: "Total Transactions Today", value: "47", color: "#1E3A8A", bg: "#EFF6FF" },
          { label: "Units Dispensed", value: "312", color: "#10B981", bg: "#F0FDF4" },
          { label: "Value Dispensed", value: "₹84,200", color: "#0EA5E9", bg: "#F0F9FF" },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: s.bg, borderRadius: 10, padding: "14px 18px", border: `1px solid ${s.color}20` }}>
            <div style={{ fontSize: 26, fontWeight: 800, fontFamily: "JetBrains Mono, monospace", color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div className="table-container">
        <table>
          <thead><tr><th>Medicine</th><th>Patient</th><th>Dispensed By</th><th>Batch</th><th>Qty</th><th>Time</th></tr></thead>
          <tbody>
            {mockDispensingLogs.map(log => (
              <tr key={log.id}>
                <td><div style={{ fontWeight: 600 }}>{log.medicineName}</div></td>
                <td>{log.patientName}</td>
                <td>{log.dispensedByName}</td>
                <td style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12 }}>{log.batchNumber}</td>
                <td style={{ fontWeight: 700 }}>{log.quantity}</td>
                <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{new Date(log.dispensedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
