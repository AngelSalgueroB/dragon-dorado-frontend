/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta oficial del Dragon Dorado
        chifa: {
          red: '#b30000',      // Rojo profundo tradicional
          dark: '#660000',     // Rojo oscuro para gradientes
          gold: '#d4af37',     // Dorado premium para botones
          light: '#f1c40f',    // Dorado claro para hovers (interacción)
          black: '#1a1a1a',    // Oscuro elegante para el fondo del sistema
        }
      },
      fontFamily: {
        sans: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      }
    },
  },
  plugins: [],
}