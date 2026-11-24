/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        game: {
          dark: '#080e1a', // Deep Midnight Navy background
          navy: '#0c1527', // Deep navy surface
          card: '#111c35', // Clean midnight card
          cardElevated: '#162342', // Elevated card
          border: '#1e3056', // Soft navy border
          accent: '#10b981', // Vibrant Emerald
          primary: '#10b981', // Emerald
          secondary: '#0ea5e9', // Sky blue companion
          gold: '#f59e0b', // Amber/gold
          success: '#10b981', // Emerald success
          danger: '#ef4444', // Red
          eleven: '#10b981', // Emerald
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
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
