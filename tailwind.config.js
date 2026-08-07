/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#050507',
        'dark-card': '#0a0a0a',
        'dark-border': 'rgba(255,255,255,0.05)',
        'gold-primary': '#FFD700',
        'gold-secondary': '#FFA500',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'scroll-dot': 'scrollDot 2s infinite',
      },
      keyframes: {
        scrollDot: {
          '0%': { transform: 'translateY(0)', opacity: 1 },
          '100%': { transform: 'translateY(16px)', opacity: 0 },
        },
      },
    },
  },
  plugins: [],
}
