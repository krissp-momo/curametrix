"use client";

const stubs = [
  { path: "transfers", icon: "🔄", title: "Inter-Hospital Transfers", desc: "Transfer recommendations are shown in Supply Chain → Inter-Hospital Transfers tab." },
  { path: "compliance", icon: "📋", title: "Compliance Automation Engine", desc: "CDSCO rule auto-checking, price violation flagging, and compliance report generation." },
  { path: "audit", icon: "📝", title: "Audit Trail", desc: "Full activity log of all user actions — who did what and when." },
];

export default function TransfersPage() {
  return (
    <div style={{
      minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{ textAlign: "center", maxWidth: 400 }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🔄</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--primary)" }}>Inter-Hospital Transfers</h2>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 8, lineHeight: 1.7 }}>
          AI-powered transfer recommendations are available in the <b>Supply Chain</b> section under the "Inter-Hospital Transfers" tab.
        </p>
        <a href="/dashboard/supply-chain" className="btn-primary" style={{ display: "inline-flex", marginTop: 20 }}>
          Go to Supply Chain →
        </a>
      </div>
    </div>
  );
}
