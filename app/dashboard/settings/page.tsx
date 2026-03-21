"use client";

import { useState } from "react";
import { Settings, Key, Bell, Hospital, Save } from "lucide-react";

const tabs = ["Hospital Profile", "Firebase Setup", "Notification APIs", "Thresholds & Alerts"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Hospital Profile");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden" }}>
        <div style={{ display: "flex", borderBottom: "1px solid var(--border)", padding: "0 16px" }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              padding: "12px 18px", border: "none", background: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 600, whiteSpace: "nowrap",
              color: activeTab === t ? "var(--accent)" : "var(--text-muted)",
              borderBottom: activeTab === t ? "2px solid var(--accent)" : "2px solid transparent",
              transition: "all 0.15s",
            }}>{t}</button>
          ))}
        </div>

        <div style={{ padding: 24 }}>

          {activeTab === "Hospital Profile" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 600 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Hospital Information</h3>
              {[
                { label: "Hospital Name", placeholder: "City General Hospital", type: "text" },
                { label: "License Number", placeholder: "MH-PH-2024-001", type: "text" },
                { label: "Address", placeholder: "123 Medical Road, Mumbai, Maharashtra", type: "text" },
                { label: "Contact Phone", placeholder: "+91 22 1234 5678", type: "tel" },
                { label: "Contact Email", placeholder: "admin@hospital.com", type: "email" },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 5 }}>{f.label}</label>
                  <input className="input" type={f.type} placeholder={f.placeholder} />
                </div>
              ))}
              <button className="btn-primary" onClick={handleSave} style={{ alignSelf: "flex-start" }}>
                {saved ? "✅ Saved!" : <><Save size={14} /> Save Changes</>}
              </button>
            </div>
          )}

          {activeTab === "Firebase Setup" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 700 }}>
              <div style={{ padding: "14px 18px", background: "#EFF6FF", borderRadius: 10, border: "1px solid #BFDBFE" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1E3A8A", marginBottom: 6 }}>🔧 Firebase Setup Instructions</div>
                <ol style={{ fontSize: 13, color: "#1D4ED8", margin: 0, paddingLeft: 18, lineHeight: 2 }}>
                  <li>Go to <a href="https://console.firebase.google.com" target="_blank" style={{ fontWeight: 700 }}>console.firebase.google.com</a></li>
                  <li>Click <b>"Add Project"</b> → name it "curametrix"</li>
                  <li>Go to <b>Project Settings → Your Apps → Web</b></li>
                  <li>Copy the config values below into your <code>.env.local</code> file</li>
                  <li>Enable <b>Authentication</b> (Email/Password) and <b>Firestore Database</b></li>
                </ol>
              </div>
              <div style={{ background: "#0F172A", borderRadius: 10, padding: "16px 20px", fontFamily: "JetBrains Mono, monospace", fontSize: 13, color: "#E2E8F0", lineHeight: 1.8 }}>
                <div style={{ color: "#64748B", marginBottom: 8 }}># .env.local — paste your Firebase values here</div>
                <div><span style={{ color: "#10B981" }}>NEXT_PUBLIC_FIREBASE_API_KEY</span>=your_api_key</div>
                <div><span style={{ color: "#10B981" }}>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN</span>=your_project.firebaseapp.com</div>
                <div><span style={{ color: "#10B981" }}>NEXT_PUBLIC_FIREBASE_PROJECT_ID</span>=your_project_id</div>
                <div><span style={{ color: "#10B981" }}>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET</span>=your_project.appspot.com</div>
                <div><span style={{ color: "#10B981" }}>NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID</span>=your_sender_id</div>
                <div><span style={{ color: "#10B981" }}>NEXT_PUBLIC_FIREBASE_APP_ID</span>=your_app_id</div>
              </div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                ⚠️ Never commit <code>.env.local</code> to Git. The file is already in <code>.gitignore</code>.
              </div>
            </div>
          )}

          {activeTab === "Notification APIs" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 700 }}>

              {/* Twilio */}
              <div style={{ padding: "18px 20px", borderRadius: 12, border: "1px solid #E2E8F0", background: "var(--bg)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 22 }}>📱</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>Twilio SMS Setup</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Free trial: $15 credit · ~200+ SMS messages</div>
                  </div>
                </div>
                <ol style={{ fontSize: 13, color: "var(--text-muted)", paddingLeft: 18, marginBottom: 14, lineHeight: 1.9 }}>
                  <li>Sign up at <a href="https://twilio.com" target="_blank" style={{ color: "var(--accent)", fontWeight: 600 }}>twilio.com</a> (free)</li>
                  <li>Go to Console → get Account SID, Auth Token, Phone Number</li>
                  <li>Paste below and in your .env.local file</li>
                </ol>
                {[
                  { label: "Account SID", key: "TWILIO_ACCOUNT_SID", placeholder: "ACxxxxxxxx..." },
                  { label: "Auth Token", key: "TWILIO_AUTH_TOKEN", placeholder: "your_auth_token" },
                  { label: "From Phone Number", key: "TWILIO_PHONE", placeholder: "+1 415 555 0100" },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: 10 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 5 }}>{f.label}</label>
                    <input className="input" type="text" placeholder={f.placeholder} />
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>env: {f.key}</div>
                  </div>
                ))}
              </div>

              {/* Resend */}
              <div style={{ padding: "18px 20px", borderRadius: 12, border: "1px solid #E2E8F0", background: "var(--bg)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 22 }}>📧</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>Resend Email Setup</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Free: 3,000 emails/month · 100/day</div>
                  </div>
                </div>
                <ol style={{ fontSize: 13, color: "var(--text-muted)", paddingLeft: 18, marginBottom: 14, lineHeight: 1.9 }}>
                  <li>Sign up at <a href="https://resend.com" target="_blank" style={{ color: "var(--accent)", fontWeight: 600 }}>resend.com</a> (free)</li>
                  <li>Create an API key from the dashboard</li>
                  <li>Paste below</li>
                </ol>
                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 5 }}>Resend API Key</label>
                  <input className="input" type="text" placeholder="re_xxxxxxxxxxxxxxxxxxxx" />
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>env: RESEND_API_KEY</div>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 5 }}>From Email</label>
                  <input className="input" type="email" placeholder="alerts@curametrix.com" />
                </div>
              </div>

              <button className="btn-primary" onClick={handleSave} style={{ alignSelf: "flex-start" }}>
                {saved ? "✅ Saved!" : <><Save size={14} /> Save API Keys</>}
              </button>
            </div>
          )}

          {activeTab === "Thresholds & Alerts" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 600 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Alert Trigger Settings</h3>
              {[
                { label: "Low Stock Alert Threshold (%)", placeholder: "20", hint: "Send alert when stock < X% of max level" },
                { label: "Expiry Alert (days before expiry)", placeholder: "30", hint: "Send alert when drug expires within X days" },
                { label: "Critical Expiry Alert (days)", placeholder: "7", hint: "Send urgent SMS for drugs expiring within X days" },
                { label: "Fraud Detection Threshold (units)", placeholder: "3", hint: "Flag dispense if quantity is > X× daily average" },
                { label: "Temperature Breach Tolerance (°C)", placeholder: "1.5", hint: "Alert if temp deviates by more than X°C" },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 5 }}>{f.label}</label>
                  <input className="input" type="number" placeholder={f.placeholder} style={{ maxWidth: 200 }} />
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{f.hint}</div>
                </div>
              ))}
              <button className="btn-primary" onClick={handleSave} style={{ alignSelf: "flex-start" }}>
                {saved ? "✅ Saved!" : <><Save size={14} /> Save Thresholds</>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
