/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'umbc-blue': '#0047AB',
        'umbc-gold': '#FFC20E',
        'umbc-dark-gold': '#E6A800',
      },
      fontFamily: {
        'sans': ['Roboto', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}