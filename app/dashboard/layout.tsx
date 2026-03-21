"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/inventory": "Medicines & Stock",
  "/dashboard/expiry": "Expiry Management",
  "/dashboard/dispensing": "Dispensing Logs",
  "/dashboard/alerts": "Notification Center",
  "/dashboard/ai-insights": "AI Insights Hub",
  "/dashboard/analytics": "Analytics & Reports",
  "/dashboard/supply-chain": "Supply Chain",
  "/dashboard/transfers": "Hospital Transfers",
  "/dashboard/cold-chain": "Cold Chain Monitoring",
  "/dashboard/compliance": "Compliance Engine",
  "/dashboard/fraud": "Fraud Detection",
  "/dashboard/audit": "Audit Trail",
  "/dashboard/users": "Users & Roles",
  "/dashboard/settings": "Settings",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "Curametrix";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      <Sidebar />
      <div className="main-content" style={{ flex: 1 }}>
        <Header pageTitle={title} />
        <main style={{ padding: "24px", maxWidth: 1400 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
