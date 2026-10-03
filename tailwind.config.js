/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FFFDF0',
          100: '#FEF9C3',
          200: '#FEF08A',
          300: '#FDE047',
          400: '#FACC15',
          500: '#EAB308',
          600: '#CA8A04',
          700: '#A16207',
          800: '#854D0E',
          900: '#713F12',
          metallic: '#D4AF37',
          light: '#F5E6B3',
          dark: '#997300',
        },
        brown: {
          50: '#FDF8F5',
          100: '#F7EDE4',
          200: '#E8D5C4',
          300: '#D2B397',
          400: '#B88E68',
          500: '#9B6C43',
          600: '#7A502D',
          700: '#5C3A1E',
          800: '#432813',
          900: '#2E190A',
          950: '#1C0E05',
        },
        darkbg: {
          950: '#0B0D0C',
          900: '#121613',
          850: '#181E19',
          800: '#202722',
          750: '#2A332D',
          700: '#354039',
        },
      },
      fontFamily: {
        sans: ['Cairo', 'Tajawal', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 15px rgba(212, 175, 55, 0.3), 0 0 30px rgba(212, 175, 55, 0.1)',
        'dark-card': '0 10px 25px -5px rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(212, 175, 55, 0.15)',
      },
    },
  },
  plugins: [],
}
