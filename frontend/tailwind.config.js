/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Garante que Tailwind escaneie todos os arquivos em src
  ],
  theme: {
    extend: {
      colors: {
        fundo: "#000000",
        destaque: "#5CE1E6",
        complementar: "#FFFFFF", // Corrigido para 'complementar'
        cinza: "#F5F5F5",
      },
    },
  },
  plugins: [],
}