/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          deep: '#050914',
          card: '#08111F',
          surface: '#0B1424',
          elevated: '#111E35',
        },
        primary: {
          DEFAULT: '#00E5FF',
          hover: '#33EBFF',
          dark: '#00B4D8',
          glow: 'rgba(0, 229, 255, 0.25)',
        },
        electric: '#00B4D8',
        violet: {
          accent: '#8B5CF6',
          glow: 'rgba(139, 92, 246, 0.25)',
        },
        risk: {
          low: '#10B981',      // safe green
          moderate: '#F59E0B', // warning amber
          high: '#EF4444',     // critical red
          border: 'rgba(239, 68, 68, 0.3)',
        },
        border: {
          subtle: 'rgba(255, 255, 255, 0.08)',
          glow: 'rgba(0, 229, 255, 0.2)',
          highlight: 'rgba(255, 255, 255, 0.16)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px rgba(0, 229, 255, 0.25)',
        'glow-cyan-sm': '0 0 12px rgba(0, 229, 255, 0.18)',
        'glow-violet': '0 0 25px rgba(139, 92, 246, 0.25)',
        'glow-red': '0 0 25px rgba(239, 68, 68, 0.25)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
