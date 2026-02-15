import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          orange: '#f97316',
          'orange-dark': '#ea580c',
          'orange-light': '#ffedd5',
          'orange-soft': '#fff7ed',
          blue: '#3b82f6',
          'blue-dark': '#2563eb',
          'blue-light': '#dbeafe',
          'blue-soft': '#eff6ff',
          yellow: '#fbbf24',
          'yellow-light': '#fef3c7',
          purple: '#a855f7',
          'purple-light': '#f3e8ff',
          teal: '#14b8a6',
          'teal-light': '#ccfbf1',
          rose: '#f43f5e',
          'rose-light': '#ffe4e6',
        },
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        soft: '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
        medium: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
        colored: '0 4px 14px 0 rgb(249 115 22 / 0.25)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slight': 'bounce-slight 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'bounce-slight': {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config