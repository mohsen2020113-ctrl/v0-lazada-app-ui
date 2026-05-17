/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B00',
          50: '#FFF3E8',
          100: '#FFE0C2',
          200: '#FFC894',
          300: '#FFB066',
          400: '#FF9838',
          500: '#FF6B00',
          600: '#E05E00',
          700: '#B84D00',
          800: '#903C00',
          900: '#682B00',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      screens: {
        'xs': '375px',
      },
    },
  },
  plugins: [],
}
