import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "bg-base": "#0d1117",
        "bg-surface": "#161b22",
        "bg-raised": "#111820",
        "bg-hover": "#1c2128",
        accent: "#f0b429",
        "accent-bg": "#2d2a16",
        "border-default": "#21262d",
        "border-subtle": "#30363d",
        "text-primary": "#e6edf3",
        "text-secondary": "#8b949e",
        "text-muted": "#484f58",
        green: "#3fb950",
        "green-bg": "#122118",
        red: "#f85149",
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Sora", "sans-serif"],
      },
      boxShadow: {
        phone: "0 36px 80px rgba(0, 0, 0, 0.45)",
        card: "0 14px 30px rgba(0, 0, 0, 0.22)",
      },
    },
  },
  plugins: [],
} satisfies Config;
