/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 20px 60px -18px rgba(15, 23, 42, 0.35)',
      },
      backgroundImage: {
        'aurora-soft':
          'radial-gradient(circle at top left, rgba(56, 189, 248, 0.28), transparent 28%), radial-gradient(circle at top right, rgba(244, 114, 182, 0.2), transparent 24%), linear-gradient(180deg, rgba(15, 23, 42, 0.02), rgba(15, 23, 42, 0.08))',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.45s ease-out forwards',
      },
    },
  },
  plugins: [],
};
