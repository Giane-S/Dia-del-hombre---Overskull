/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        overskull: {
          DEFAULT: '#172536',
          dark: '#111C29',
          border: '#334155',
          muted: '#94A3B8',
          light: '#F8FAFC',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        brand: ['Pacifico', 'cursive'],
      }
    },
  },
  plugins: [],
}
