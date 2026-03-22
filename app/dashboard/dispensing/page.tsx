"use client";

import { useEffect, useState } from "react";
import { FileText, Clock, TrendingUp, X, Plus, Search } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { DispensingLog, Medicine } from "@/types";
import { fetchWithAuth } from "@/lib/api";
import { mockDispensingLogs } from "@/lib/mockData";

function NewDispenseDrawer({ onClose, onSave }: { onClose: () => void, onSave: () => void }) {
  const [formData, setFormData] = useState({
    medicineId: "", batchId: "", quantity: 1, patientName: "", doctorName: "", notes: ""
  });
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchMedicines() {
      const res = await fetchWithAuth('/api/medicines');
      const data = await res.json();
      if (data.medicines) setMedicines(data.medicines);
    }
    fetchMedicines();
  }, []);

  const filteredMeds = medicines.filter(m => m.name.toLowerCase().includes(search.toLowerCase())).slice(0, 5);

  const handleSave = async () => {
    if (!formData.medicineId || !formData.quantity) return alert("Medicine and quantity are required.");
    
    try {
      const res = await fetchWithAuth('/api/dispense', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert("Dispense log created successfully.");
        onSave();
        onClose();
      } else {
        const err = await res.json();
        alert("Error: " + err.error);
      }
    } catch (err) {
      alert("Failed to save log.");
    }
  };

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="drawer" style={{ display: "flex", flexDirection: "column", width: "100%", maxWidth: 450 }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 17, fontWeight: 700 }}>New Dispense Log</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><X size={20} /></button>
        </div>
        
        <div style={{ padding: 24, flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Medicine</label>
            <div style={{ position: "relative" }}>
              <input className="input" placeholder="Search medicine..." value={search} onChange={e => setSearch(e.target.value)} />
              {search && (
                <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 10, background: "white", border: "1px solid var(--border)", borderRadius: 8 }}>
                  {filteredMeds.map(m => (
                    <div key={m.id} onClick={() => { setFormData({...formData, medicineId: m.id}); setSearch(m.name); }} style={{ padding: 10, cursor: "pointer", borderBottom: "1px solid #eee" }}>
                      {m.name} (Stock: {m.totalQuantity})
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Batch, Qty, Patient, etc. */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Batch ID</label>
              <input className="input" placeholder="e.g. B-2024-01" value={formData.batchId} onChange={e => setFormData({ ...formData, batchId: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Quantity</label>
              <input type="number" min="1" className="input" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })} />
            </div>
          </div>
          {/* ... */}
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <button className="btn-primary" onClick={handleSave} style={{ flex: 1, justifyContent: "center" }}>Confirm Dispense</button>
            <button className="btn-secondary" onClick={onClose} style={{ flex: 1, justifyContent: "center" }}>Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function DispensingPage() {
  const [logs, setLogs] = useState<DispensingLog[]>(mockDispensingLogs);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    try {
      const res = await fetchWithAuth('/api/dispense');
      const data = await res.json();
      if (data.logs?.length > 0) setLogs(data.logs);
    } catch (err) {
      console.error("Using demo data: API unavailable", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => 
    log.medicineName.toLowerCase().includes(search.toLowerCase()) || 
    (log.patientName?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

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

      <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "space-between", background: "white", padding: "14px 16px", borderRadius: 12, border: "1px solid var(--border)" }}>
        <div style={{ position: "relative", width: 300 }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input className="input" placeholder="Search logs by medicine, patient or batch..." 
                 value={search} onChange={e => setSearch(e.target.value)} 
                 style={{ paddingLeft: 36, fontSize: 13 }} />
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(true)} style={{ fontSize: 13 }}><Plus size={14} /> New Dispense Log</button>
      </div>

      <div className="table-container">
        <table>
          <thead><tr><th>Medicine</th><th>Patient</th><th>Dispensed By</th><th>Batch</th><th>Qty</th><th>Time</th></tr></thead>
          <tbody>
            {filteredLogs.map(log => (
              <tr key={log.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{log.medicineName}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>{log.batchNumber || "No Batch"}</div>
                </td>
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
      
      {showAdd && <NewDispenseDrawer onClose={() => setShowAdd(false)} onSave={fetchLogs} />}
    </div>
  );
}
