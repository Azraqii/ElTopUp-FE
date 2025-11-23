/** @type {import('tailwindcss').Config} */
export default {
  // Beri tahu Tailwind untuk memindai semua file di src/ 
  // yang berakhiran .html, .js, .ts, .jsx, atau .tsx
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}