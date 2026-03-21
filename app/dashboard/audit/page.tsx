"use client";

const auditLogs = [
  { id: "a1", action: "Medicine Added", detail: "Added Paracetamol 650mg (500 strips)", user: "Admin Priya", time: "Today, 3:14 PM", type: "create" },
  { id: "a2", action: "Stock Dispensed", detail: "10 units Insulin Glargine to Patient Kumar", user: "Pharmacist Sunita", time: "Today, 2:45 PM", type: "dispense" },
  { id: "a3", action: "PO Approved", detail: "Purchase Order PO-2026-089 approved (₹2.48L)", user: "Store Manager Amit", time: "Today, 1:30 PM", type: "approve" },
  { id: "a4", action: "Alert Acknowledged", detail: "Acknowledged: Insulin Glargine Expiry Alert", user: "Admin Priya", time: "Today, 12:15 PM", type: "acknowledge" },
  { id: "a5", action: "User Login", detail: "Login from IP 192.168.1.45", user: "Pharmacist Ravi", time: "Today, 11:00 AM", type: "auth" },
  { id: "a6", action: "Batch Received", detail: "GRN-2026-042: 200 vials Insulin Glargine received", user: "Store Manager Amit", time: "Yesterday, 4:20 PM", type: "receive" },
  { id: "a7", action: "⚠️ Fraud Flagged", detail: "Suspicious: 10 units Morphine removed without billing", user: "System", time: "Yesterday, 2:15 PM", type: "fraud" },
];

const typeColors: Record<string, string> = {
  create: "#10B981", dispense: "#0EA5E9", approve: "#1E3A8A",
  acknowledge: "#F59E0B", auth: "#64748B", receive: "#8B5CF6", fraud: "#EF4444",
};

const typeIcons: Record<string, string> = {
  create: "➕", dispense: "💊", approve: "✅", acknowledge: "🔔", auth: "🔐", receive: "📦", fraud: "🚨",
};

export default function AuditPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 12 }}>
        {[
          { label: "Actions Today", value: "47", color: "#1E3A8A", bg: "#EFF6FF" },
          { label: "Unique Users Active", value: "5", color: "#10B981", bg: "#F0FDF4" },
          { label: "Suspicious Actions", value: "1", color: "#DC2626", bg: "#FEF2F2" },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: s.bg, borderRadius: 10, padding: "14px 18px", border: `1px solid ${s.color}20` }}>
            <div style={{ fontSize: 26, fontWeight: 800, fontFamily: "JetBrains Mono, monospace", color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div className="table-container">
        <table>
          <thead><tr><th>Action</th><th>Details</th><th>User</th><th>Time</th></tr></thead>
          <tbody>
            {auditLogs.map(log => (
              <tr key={log.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{typeIcons[log.type]}</span>
                    <span style={{ fontWeight: 700, fontSize: 13, color: typeColors[log.type] }}>{log.action}</span>
                  </div>
                </td>
                <td style={{ fontSize: 13, color: "var(--text-muted)" }}>{log.detail}</td>
                <td style={{ fontWeight: 600, fontSize: 13 }}>{log.user}</td>
                <td style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>{log.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
