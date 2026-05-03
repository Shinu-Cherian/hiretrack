/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
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
