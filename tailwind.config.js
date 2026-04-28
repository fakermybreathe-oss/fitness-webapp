/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#F97316',
        dark: '#1E293B',
        muted: '#64748B',
        surface: '#F8FAFC',
      },
    },
  },
  plugins: [],
}
