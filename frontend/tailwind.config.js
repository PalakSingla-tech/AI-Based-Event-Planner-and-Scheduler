/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#020617', // Slate 950 (Deep, premium dark)
          card: '#0f172a', // Slate 900 (Slightly lighter for contrast)
          text: '#f8fafc', // Slate 50
          muted: '#94a3b8', // Slate 400
        }
      }
    },
  },
  plugins: [],
};
