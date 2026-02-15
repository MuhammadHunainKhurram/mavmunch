import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Source Serif 4"', 'Georgia', 'serif'],
      },
      colors: {
        campus: {
          orange: '#F58025',
          'orange-dark': '#D66A15',
          'orange-light': '#FDE8D0',
          'orange-soft': '#FFF5EB',
          blue: '#0064B1',
          'blue-dark': '#004E8C',
          'blue-light': '#D4E8F7',
          'blue-soft': '#EDF5FC',
          amber: '#D97706',
          'amber-light': '#FEF3C7',
          green: '#059669',
          'green-light': '#D1FAE5',
          red: '#DC2626',
          'red-light': '#FEE2E2',
        },
        warm: {
          50: '#FAF7F2',
          100: '#F5F0E8',
          200: '#E8E0D4',
          300: '#D4C9B8',
          400: '#B5A692',
          500: '#96876E',
          600: '#7A6D57',
          700: '#5E5343',
          800: '#433B30',
          900: '#2A2520',
          950: '#1C1917',
        },
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgb(42 37 32 / 0.04)',
        soft: '0 4px 12px -2px rgb(42 37 32 / 0.08)',
        medium: '0 8px 24px -4px rgb(42 37 32 / 0.12)',
        warm: '0 4px 14px 0 rgb(245 128 37 / 0.15)',
        'warm-lg': '0 8px 24px 0 rgb(245 128 37 / 0.2)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-warm': 'pulseWarm 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.5s ease-out both',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseWarm: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
