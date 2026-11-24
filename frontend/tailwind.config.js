/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        game: {
          dark: '#080c16',
          card: '#0f172a',
          border: '#1e293b',
          accent: '#06b6d4', // neon cyan
          primary: '#8b5cf6', // purple
          secondary: '#ec4899', // pink
          gold: '#f59e0b', // amber
          success: '#10b981', // emerald
          danger: '#ef4444', // red
          eleven: '#f97316', // neon orange
        },
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        display: ['Fredoka', 'cursive', 'sans-serif'],
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-short': 'bounce 0.6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'neon-cyan': '0 4px 12px 0 rgba(6, 182, 212, 0.25)',
        'neon-purple': '0 4px 12px 0 rgba(139, 92, 246, 0.25)',
        'neon-orange': '0 4px 12px 0 rgba(249, 115, 22, 0.25)',
      },
    },
  },
  plugins: [],
};
