/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        brand: "#635bff",
        mint: "#10b981"
      },
      boxShadow: {
        soft: "0 12px 35px rgba(23,32,51,.07)"
      }
    }
  },
  plugins: []
};
