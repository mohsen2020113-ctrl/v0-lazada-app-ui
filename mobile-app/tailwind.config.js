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
          DEFAULT: '#C2185B',
          dark:    '#880E4F',
          50:  '#FCE4EC',
          100: '#F8BBD9',
          200: '#F48FB1',
          300: '#F06292',
          400: '#EC407A',
          500: '#E91E63',
          600: '#D81B60',
          700: '#C2185B',
          800: '#AD1457',
          900: '#880E4F',
        },
        success:     '#4CAF50',
        warning:     '#FFA000',
        error:       '#F44336',
        rating:      '#FFC107',
        priceDiscount: '#D32F2F',
      },
      fontFamily: {
        sans: ['Roboto', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        'h1':      ['1.5rem',   { fontWeight: '700', lineHeight: '1.3' }],
        'product': ['0.875rem', { fontWeight: '400', lineHeight: '1.4' }],
        'price':   ['1.125rem', { fontWeight: '700', lineHeight: '1.2' }],
        'desc':    ['0.75rem',  { fontWeight: '400', lineHeight: '1.5' }],
      },
      screens: {
        'xs': '375px',
      },
    },
  },
  plugins: [],
}
