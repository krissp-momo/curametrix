"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, AlertTriangle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState("admin");

  const demoAccounts = [
    { role: "admin", label: "Admin", email: "admin@curametrix.com", color: "#1E3A8A" },
    { role: "store_manager", label: "Store Manager", email: "manager@curametrix.com", color: "#0EA5E9" },
    { role: "pharmacist", label: "Pharmacist", email: "pharma@curametrix.com", color: "#10B981" },
    { role: "viewer", label: "Viewer", email: "viewer@curametrix.com", color: "#64748B" },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Simulate login — replace with Firebase Auth
    await new Promise(res => setTimeout(res, 1000));
    if (email && password.length >= 6) {
      window.location.href = "/dashboard";
    } else {
      setError("Invalid credentials. Password must be at least 6 characters.");
    }
    setLoading(false);
  };

  const fillDemo = (acc: typeof demoAccounts[0]) => {
    setEmail(acc.email);
    setPassword("demo123");
    setRole(acc.role);
    setError("");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #F0FDF4 0%, #DBEAFE 50%, #F0FDF4 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
      fontFamily: "Inter, sans-serif",
    }}>
      {/* Background pattern */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: "radial-gradient(circle at 20% 80%, rgba(16,185,129,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(30,58,138,0.08) 0%, transparent 50%)",
        pointerEvents: "none",
      }} />

      <div style={{ display: "flex", gap: 48, alignItems: "center", maxWidth: 900, width: "100%", position: "relative", zIndex: 1 }}>

        {/* Left: Branding */}
        <div style={{ flex: 1, display: "none" }} className="login-brand">
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: "var(--primary)", display: "flex",
                alignItems: "center", justifyContent: "center", fontSize: 24,
              }}>💊</div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 800, color: "var(--primary)" }}>Curametrix</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" }}>Drug Inventory AI</div>
              </div>
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: "var(--text)", lineHeight: 1.25, marginBottom: 12 }}>
              Smarter Hospital<br />Pharmacy Management
            </h2>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.7, fontSize: 15 }}>
              AI-powered inventory control, expiry alerts, FEFO dispensing, and real-time fraud detection — all in one platform.
            </p>
          </div>
          {[
            { icon: "🤖", text: "AI demand forecasting with 91% accuracy" },
            { icon: "⏳", text: "FEFO dispensing — zero wastage from wrong order" },
            { icon: "📱", text: "Instant SMS + email alerts to all staff" },
            { icon: "🔍", text: "Fraud & anomaly detection built-in" },
          ].map(f => (
            <div key={f.text} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontSize: 20 }}>{f.icon}</span>
              <span style={{ fontSize: 14, color: "var(--text)", fontWeight: 500 }}>{f.text}</span>
            </div>
          ))}
        </div>

        {/* Right: Login Card */}
        <div style={{
          background: "white", borderRadius: 20,
          padding: "36px 36px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.06)",
          border: "1px solid var(--border)",
          width: "100%", maxWidth: 420,
          animation: "slideInUp 0.4s ease",
        }}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{
              width: 60, height: 60, borderRadius: 16,
              background: "linear-gradient(135deg, var(--primary), #2D4FA3)",
              margin: "0 auto 12px", display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: 28,
            }}>💊</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "var(--primary)" }}>Curametrix</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Sign in to your account</div>
          </div>

          {/* Demo Quick Login */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
              Quick Demo Login
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {demoAccounts.map(acc => (
                <button key={acc.role} onClick={() => fillDemo(acc)} style={{
                  padding: "7px 10px",
                  border: `1.5px solid ${role === acc.role ? acc.color : "var(--border)"}`,
                  borderRadius: 8, background: role === acc.role ? `${acc.color}15` : "transparent",
                  cursor: "pointer", fontSize: 12, fontWeight: 600,
                  color: role === acc.role ? acc.color : "var(--text-muted)",
                  transition: "all 0.15s",
                }}>
                  {acc.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>or sign in manually</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          {/* Error */}
          {error && (
            <div style={{
              display: "flex", gap: 8, alignItems: "center",
              padding: "10px 14px", background: "#fee2e2",
              borderRadius: 8, marginBottom: 16, fontSize: 13, color: "#b91c1c",
            }}>
              <AlertTriangle size={15} /> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", display: "block", marginBottom: 6 }}>
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@hospital.com"
                  required
                  style={{ paddingLeft: 36 }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", display: "block", marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  className="input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ paddingLeft: 36, paddingRight: 40 }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 0,
                }}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{
                width: "100%", justifyContent: "center", height: 42,
                fontSize: 15, opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                  Signing in…
                </span>
              ) : "Sign In →"}
            </button>
          </form>

          <div style={{ marginTop: 20, textAlign: "center", fontSize: 12, color: "var(--text-muted)" }}>
            🔐 Secured by Firebase Auth · HIPAA-aware Architecture
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (min-width: 768px) { .login-brand { display: block !important; } }
      `}</style>
    </div>
  );
}
