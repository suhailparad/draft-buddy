/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F766E',
          hover: '#115E59',
        },
        background: '#F8FAFC',
        surface: '#FFFFFF',
        border: '#E2E8F0',
        'primary-text': '#0F172A',
        'secondary-text': '#64748B',
        success: '#DCFCE7',
      },
      fontFamily: {
        inter: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '18px',
        '3xl': '32px',
      },
      boxShadow: {
        'auth-card': '0 -8px 40px -8px rgba(15, 23, 42, 0.08), 0 -2px 10px -2px rgba(15, 23, 42, 0.04)',
        'btn-primary': '0 4px 14px 0 rgba(15, 118, 110, 0.35)',
        'btn-primary-hover': '0 6px 20px 0 rgba(15, 118, 110, 0.45)',
        'input-focus': '0 0 0 4px rgba(15, 118, 110, 0.12)',
      },
      transitionDuration: {
        '200': '200ms',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'float-1': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'float-2': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'float-3': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'slide-up': 'slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float-1': 'float-1 4s ease-in-out infinite',
        'float-2': 'float-2 5s ease-in-out infinite',
        'float-3': 'float-3 3.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
