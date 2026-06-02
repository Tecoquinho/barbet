/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#0d1117",
        field: "#11161d",
        gold: "#f0b429",
        lime: "#f0b429",
        foam: "#f8fafc",
        panel: "#161b22",
        ink: "#c9d1d9",
      },
      boxShadow: {
        glow: "0 18px 48px rgba(0, 0, 0, 0.38)",
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Sora", "sans-serif"],
      },
      backgroundImage: {
        pitch:
          "radial-gradient(circle at top, rgba(125,223,100,0.2), transparent 34%), linear-gradient(135deg, rgba(6,19,14,0.95), rgba(12,43,28,0.92))",
      },
    },
  },
  plugins: [],
};
