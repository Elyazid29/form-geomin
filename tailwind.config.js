/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        geomin: {
          DEFAULT: '#00875A',
          dark: '#006B46',
        },
      },
    },
  },
  plugins: [],
};