/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Kita tambahkan palet warna Anda di sini
      colors: {
        brand: {
          blue: '#1364FF',   // Warna Utama (Tombol, Highlight)
          light: '#C5D7FF',  // Warna Aksen (Background tipis, variasi)
          white: '#FFFFFF',  // Warna Dasar
        }
      },
      fontFamily: {
        // Opsional: Jika nanti ada font khusus, kita set di sini
        sans: ['Inter', 'sans-serif'], 
      }
    },
  },
  plugins: [],
}