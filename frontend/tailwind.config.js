/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        night:   { DEFAULT: '#0F0F1A', 800: '#141428', 700: '#1A1A2E', 600: '#22223B' },
        ink:     { DEFAULT: '#2D2D44', light: '#3D3D5C' },
        violet:  { DEFAULT: '#6C63FF', light: '#8B85FF', dark: '#5548E0' },
        sage:    { DEFAULT: '#00C9A7', light: '#2DDBBF' },
        amber:   { DEFAULT: '#F7B731' },
        rose:    { DEFAULT: '#FC5C7D' },
        slate:   { 50: '#F8FAFC', 200: '#E2E8F0', 400: '#94A3B8', 600: '#475569', 700: '#334155', 800: '#1E293B' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in':    'fadeIn 0.2s ease',
        'slide-up':   'slideUp 0.25s ease',
        'bounce-dot': 'bounceDot 1.2s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: 0 },                  to: { opacity: 1 } },
        slideUp:   { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        bounceDot: { '0%,80%,100%': { transform: 'scale(0.7)', opacity: '0.4' }, '40%': { transform: 'scale(1.2)', opacity: '1' } },
        pulseGlow: { '0%,100%': { boxShadow: '0 0 0 0 rgba(108,99,255,0.4)' }, '50%': { boxShadow: '0 0 0 8px rgba(108,99,255,0)' } },
      },
    },
  },
  plugins: [],
}
