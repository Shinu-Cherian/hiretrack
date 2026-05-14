/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ff6044",
        surface: "#121414",
        "surface-container": "#1e2020",
        "surface-bright": "#37393a",
        "on-surface": "#e2e2e2",
        "on-surface-variant": "#e2beb8",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Barlow Condensed", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      maxWidth: {
        '4xl': '1000px',
        '5xl': '1200px',
        '6xl': '1440px',
        '7xl': '1680px',
      }
    },
  },
  plugins: [],
}
