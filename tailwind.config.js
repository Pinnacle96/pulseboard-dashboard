/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#18202f",
        muted: "#64748b",
        canvas: "#f6f8fb",
        panel: "#ffffff",
        brand: "#275efe",
        teal: "#0e9f8f",
        amber: "#f6c85f",
        coral: "#e85d75"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(24, 32, 47, 0.08)"
      }
    }
  },
  plugins: []
};
