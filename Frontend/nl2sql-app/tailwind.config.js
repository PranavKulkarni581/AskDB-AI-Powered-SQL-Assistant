/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'ui-sans-serif', 'system-ui'],
        poppins: ['Poppins', 'ui-sans-serif', 'system-ui'],
        manrope: ['Manrope', 'ui-sans-serif', 'system-ui'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem'
      },
      boxShadow: {
        glass: '0 10px 40px -12px rgba(0,0,0,0.15)'
      },
      backgroundImage: {
        'grad-accent': 'linear-gradient(90deg, #3b82f6, #6366f1, #8b5cf6)'
      },
      animation: {
        'float-slow': 'float 12s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2.5s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-12px) scale(1.01)' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.75 }
        }
      }
    }
  },
  plugins: []
}
