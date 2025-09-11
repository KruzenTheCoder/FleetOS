/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: "#0A84FF",
        iosGray: "#8E8E93",
        iosGreen: "#34C759",
        iosRed: "#FF3B30",
        iosOrange: "#FF9500",
        iosYellow: "#FFCC00",
        iosIndigo: "#5856D6",
        iosTeal: "#30B0C7"
      },
      boxShadow: {
        soft: "0 8px 30px rgba(0,0,0,0.06)",
        soft2: "0 12px 50px rgba(0,0,0,0.08)"
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"]
      }
    }
  },
  plugins: []
};