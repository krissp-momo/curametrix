"use client";

import { useEffect, useState } from "react";
import { Search, Plus, Minus, Trash2, Printer, CreditCard, Banknote, Smartphone, User } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Medicine } from "@/types";
import { fetchWithAuth } from "@/lib/api";
import { mockMedicines } from "@/lib/mockData";

interface CartItem {
  id: string;
  name: string;
  batchId?: string;
  price: number;
  qty: number;
}

export default function BillingPage() {
  const [medicines, setMedicines] = useState<Medicine[]>(mockMedicines);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [patientName, setPatientName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchMedicines() {
      try {
        const res = await fetchWithAuth('/api/medicines');
        const data = await res.json();
        if (data.medicines?.length > 0) setMedicines(data.medicines);
      } catch (err) {
        console.error("Using demo data: API unavailable", err);
      }
    }
    fetchMedicines();
  }, []);

  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) && m.totalQuantity > 0
  ).slice(0, 5);

  const addToCart = (med: Medicine) => {
    const existing = cart.find(c => c.id === med.id);
    if (existing) {
      setCart(cart.map(c => c.id === med.id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { 
        id: med.id, 
        name: med.name, 
        price: med.unitPrice || 150, 
        qty: 1,
        batchId: (med as any).currentBatchId 
      }]);
    }
    setSearch("");
  };

  const updateQty = (id: string, delta: number) => {
    setCart(cart.map(c => {
      if (c.id === id) {
        const newQty = Math.max(1, c.qty + delta);
        return { ...c, qty: newQty };
      }
      return c;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(c => c.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.12; 
  const discount = subtotal > 1000 ? subtotal * 0.10 : 0; 
  const total = subtotal + tax - discount;

  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Cart is empty.");
    if (!patientName) return alert("Please enter patient name.");
    
    try {
      const res = await fetchWithAuth('/api/billing', {
        method: 'POST',
        body: JSON.stringify({
          patientName,
          doctorName,
          items: cart.map(item => ({
            medicineId: item.id,
            batchId: item.batchId || "",
            quantity: item.qty,
            price: item.price
          })),
          subtotal,
          tax,
          discount,
          total,
          paymentMethod
        })
      });

      const result = await res.json();
      if (result.bill) {
        alert(`Bill Generated Successfully!\nInvoice ID: ${result.bill.id}\nTotal: ₹${total.toFixed(2)}`);
        setCart([]);
        setPatientName("");
        setDoctorName("");
      } else {
        alert("Billing failed: " + result.error);
      }
    } catch (err) {
      alert("Error generating bill.");
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20, height: "calc(100vh - 120px)" }}>
      
      {/* Left: POS / Cart */}
      <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        
        {/* Search Bar */}
        <div style={{ padding: 20, borderBottom: "1px solid var(--border)", background: "#F8FAFC" }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>Pharmacy Point of Sale</div>
          <div style={{ position: "relative" }}>
            <Search size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input 
              className="input" 
              placeholder="Search medicines, scan barcode... (e.g. Insulin, Amoxicillin)" 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 42, fontSize: 15, padding: "14px 14px 14px 42px", height: "auto" }}
            />
            {search && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4, background: "white", borderRadius: 8, border: "1px solid var(--border)", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)", zIndex: 10 }}>
                {filteredMedicines.length > 0 ? (
                  filteredMedicines.map(med => (
                    <div key={med.id} onClick={() => addToCart(med)} style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{med.name}</div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Stock: {med.totalQuantity}</div>
                      </div>
                      <div style={{ fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>₹{med.mrp || 150}</div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: "16px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>No medicines found in stock.</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Cart Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
          {cart.length === 0 ? (
            <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>Cart is empty</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>Search and add medicines to bill.</div>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th style={{ width: 120 }}>Qty</th>
                    <th style={{ textAlign: "right", width: 100 }}>Price</th>
                    <th style={{ textAlign: "right", width: 120 }}>Total</th>
                    <th style={{ width: 50 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{item.name}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>{item.batchId || "No Batch"}</div>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <button onClick={() => updateQty(item.id, -1)} style={{ width: 24, height: 24, borderRadius: 4, border: "1px solid var(--border)", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Minus size={12} /></button>
                          <span style={{ fontWeight: 700, width: 20, textAlign: "center", fontFamily: "JetBrains Mono, monospace" }}>{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} style={{ width: 24, height: 24, borderRadius: 4, border: "1px solid var(--border)", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Plus size={12} /></button>
                        </div>
                      </td>
                      <td style={{ textAlign: "right", fontFamily: "JetBrains Mono, monospace" }}>₹{item.price}</td>
                      <td style={{ textAlign: "right", fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>₹{(item.price * item.qty).toFixed(2)}</td>
                      <td>
                        <button onClick={() => removeFromCart(item.id)} style={{ color: "#EF4444", background: "none", border: "none", cursor: "pointer", padding: 4 }}><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Right: Checkout Sidebar */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Patient Info */}
        <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", padding: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <User size={18} color="var(--accent)" /> Patient Details
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Patient Name / Mobile *</label>
              <input className="input" placeholder="e.g. Rahul Sharma" value={patientName} onChange={e => setPatientName(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Prescribing Doctor (Optional)</label>
              <input className="input" placeholder="e.g. Dr. Ramesh" value={doctorName} onChange={e => setDoctorName(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", padding: 20, display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Bill Summary</div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
              <span style={{ color: "var(--text-muted)" }}>Subtotal</span>
              <span style={{ fontWeight: 600, fontFamily: "JetBrains Mono, monospace" }}>₹{subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#10B981" }}>
                <span>Discount (10%)</span>
                <span style={{ fontWeight: 600, fontFamily: "JetBrains Mono, monospace" }}>-₹{discount.toFixed(2)}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
              <span style={{ color: "var(--text-muted)" }}>GST (12%)</span>
              <span style={{ fontWeight: 600, fontFamily: "JetBrains Mono, monospace" }}>+₹{tax.toFixed(2)}</span>
            </div>
            
            <div style={{ height: 1, background: "url(\"data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23E2E8F0' stroke-width='2' stroke-dasharray='6%2c 6' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e\")", margin: "8px 0" }} />
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 16, fontWeight: 800 }}>Grand Total</span>
              <span style={{ fontSize: 24, fontWeight: 800, color: "var(--accent)", fontFamily: "JetBrains Mono, monospace" }}>₹{total.toFixed(2)}</span>
            </div>

            {/* Payment Methods */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: "auto" }}>
              {[
                { id: "cash", icon: Banknote, label: "Cash" },
                { id: "card", icon: CreditCard, label: "Card" },
                { id: "upi", icon: Smartphone, label: "UPI" },
              ].map(pm => (
                <button 
                  key={pm.id} 
                  onClick={() => setPaymentMethod(pm.id)}
                  style={{ 
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "12px 8px", 
                    borderRadius: 8, border: paymentMethod === pm.id ? "2px solid var(--accent)" : "1px solid var(--border)",
                    background: paymentMethod === pm.id ? "rgba(16,185,129,0.05)" : "white",
                    cursor: "pointer", transition: "all 0.1s"
                  }}
                >
                  <pm.icon size={20} color={paymentMethod === pm.id ? "var(--accent)" : "var(--text-muted)"} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: paymentMethod === pm.id ? "var(--accent)" : "var(--text)" }}>{pm.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleCheckout} className="btn-primary" style={{ marginTop: 20, padding: 16, fontSize: 15, width: "100%", justifyContent: "center", gap: 8 }}>
            <Printer size={18} /> Generate Bill & Print
          </button>
        </div>
      </div>
    </div>
  );
}
