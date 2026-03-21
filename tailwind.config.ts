import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1E3A8A",
          50: "#EFF4FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E3A8A",
          900: "#1E3A8A",
        },
        secondary: {
          DEFAULT: "#0EA5E9",
          light: "#E0F2FE",
        },
        accent: {
          DEFAULT: "#10B981",
          light: "#D1FAE5",
          dark: "#059669",
        },
        curametrix: {
          primary: "#1E3A8A",
          secondary: "#0EA5E9",
          accent: "#10B981",
          bg: "#F0FDF4",
          card: "#FFFFFF",
          text: "#0F172A",
          border: "#E2E8F0",
          muted: "#64748B",
          success: "#22C55E",
          warning: "#F59E0B",
          danger: "#EF4444",
          "sidebar-hover": "#2D4FA3",
          "accent-hover": "#059669",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)",
        "sidebar": "4px 0 24px rgba(30,58,138,0.08)",
        "alert": "0 0 0 3px rgba(239,68,68,0.15)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "slide-in-up": "slideInUp 0.3s ease-out",
        "fade-in": "fadeIn 0.2s ease-out",
        "count-up": "countUp 1s ease-out",
      },
      keyframes: {
        slideInRight: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        countUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
