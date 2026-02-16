import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'uta-orange': '#f97316',
        'uta-orange-dark': '#ea580c',
        'uta-orange-light': '#fff7ed',
        'uta-blue': '#3e84f6',
        'uta-blue-dark': '#2563eb',
        'uta-blue-light': '#dbeafe',
        'uta-blue-soft': '#eff6ff',
        'cream': '#fafaf9',
        'cream-dark': '#0c0a09',
        'warm': {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'medium': '0 8px 24px rgba(0, 0, 0, 0.08)',
        'orange': '0 4px 16px rgba(249, 115, 22, 0.2)',
        'blue': '0 4px 16px rgba(93, 99, 112, 0.15)',
      },
      animation: {
        'drift-1': 'drift-1 8s ease-in-out infinite',
        'drift-2': 'drift-2 10s ease-in-out infinite',
        'drift-3': 'drift-3 12s ease-in-out infinite',
        'drift-4': 'drift-4 9s ease-in-out infinite',
        'drift-5': 'drift-5 11s ease-in-out infinite',
      },
      keyframes: {
        'drift-1': {
          '0%, 100%': { transform: 'translate(0, 0) rotate(-5deg)' },
          '25%': { transform: 'translate(20px, -30px) rotate(5deg)' },
          '50%': { transform: 'translate(-10px, 20px) rotate(-3deg)' },
          '75%': { transform: 'translate(30px, 10px) rotate(8deg)' },
        },
        'drift-2': {
          '0%, 100%': { transform: 'translate(0, 0) rotate(10deg)' },
          '33%': { transform: 'translate(-25px, 20px) rotate(-5deg)' },
          '66%': { transform: 'translate(15px, -25px) rotate(15deg)' },
        },
        'drift-3': {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '20%': { transform: 'translate(30px, 30px) rotate(10deg)' },
          '40%': { transform: 'translate(-20px, 15px) rotate(-10deg)' },
          '60%': { transform: 'translate(10px, -30px) rotate(5deg)' },
          '80%': { transform: 'translate(-30px, -10px) rotate(-5deg)' },
        },
        'drift-4': {
          '0%, 100%': { transform: 'translate(0, 0) rotate(-8deg)' },
          '50%': { transform: 'translate(-20px, -20px) rotate(12deg)' },
        },
        'drift-5': {
          '0%, 100%': { transform: 'translate(0, 0) rotate(5deg)' },
          '25%': { transform: 'translate(25px, 15px) rotate(-8deg)' },
          '50%': { transform: 'translate(-15px, -25px) rotate(12deg)' },
          '75%': { transform: 'translate(20px, -10px) rotate(-5deg)' },
        },
      },
    },
  },
  plugins: [],
}

export default config