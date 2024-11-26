/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,html}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#ffffff",
        secondary: "#07505a",
        secondary_dark: "#06424d",
        pink_1: "#e06c7d",
        pink_2: "#ff8fa0"
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      }
    },
    screens: {
      xxxs: "285px",
      xxs: "350px",
      xs: "480px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1200px",
      xl: "1700px",
    },
  },
  plugins: [],
}