import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function getDaysToExpiry(expiryDate: Date | string): number {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getExpiryStatus(daysToExpiry: number): "expired" | "critical" | "near" | "safe" {
  if (daysToExpiry <= 0) return "expired";
  if (daysToExpiry <= 7) return "critical";
  if (daysToExpiry <= 30) return "near";
  return "safe";
}

export function getExpiryBadgeClass(daysToExpiry: number): string {
  const status = getExpiryStatus(daysToExpiry);
  switch (status) {
    case "expired": return "badge badge-danger";
    case "critical": return "badge badge-danger";
    case "near": return "badge badge-warning";
    case "safe": return "badge badge-success";
  }
}

export function getHazardWarning(type: string): string {
  switch (type) {
    case "hazardous": return "⚠️ Hazardous – Use gloves";
    case "hormonal": return "⚠️ Hormonal – Avoid direct contact";
    case "controlled": return "⚠️ Controlled – Prescription required";
    default: return "";
  }
}

export function formatLargeNumber(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

export function getStockStatusColor(status: string): string {
  switch (status) {
    case "in_stock": return "badge-success";
    case "low_stock": return "badge-warning";
    case "critical": return "badge-danger";
    case "out_of_stock": return "badge-danger";
    default: return "badge-info";
  }
}
