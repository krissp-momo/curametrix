import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Curametrix — AI-Powered Drug Inventory System",
  description: "Hospital pharmacy inventory management with AI forecasting, expiry alerts, FEFO dispensing, and real-time monitoring.",
  keywords: "hospital inventory, pharmacy management, drug expiry, FEFO, AI healthcare",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
