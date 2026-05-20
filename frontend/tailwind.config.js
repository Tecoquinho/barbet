/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#08110d",
        field: "#0d3b2a",
        gold: "#f3c74f",
        lime: "#7ddf64",
        foam: "#f8ecd2",
      },
      boxShadow: {
        glow: "0 20px 45px rgba(125, 223, 100, 0.18)",
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
