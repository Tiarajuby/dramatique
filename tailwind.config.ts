import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#E8001D', redHover: '#C8001A', redDark: '#9A0014',
          // Deeper, moodier blacks for a more cinematic base
          black: '#060609', dark: '#0B0B11', card: '#101018',
          cardHover: '#16161F', border: '#1C1C28', borderLight: '#26263440',
          muted: '#3A3A48', subtle: '#6E6E80', text: '#C4C4D0',
          bright: '#E8E8F0', white: '#FFFFFF',
          gold: '#F5C451', vip: '#F5C451',
        },
      },
      fontFamily: {
        display: ['Anton', 'Impact', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        // Shared easing curves — everything uses these for consistency
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'out-back': 'cubic-bezier(0.34, 1.4, 0.64, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      boxShadow: {
        'card-hover': '0 20px 50px -12px rgba(0,0,0,0.85), 0 0 0 1px rgba(232,0,29,0.15)',
        'lift': '0 12px 32px -8px rgba(0,0,0,0.7)',
        'glow-red': '0 0 24px -4px rgba(232,0,29,0.4)',
        'glow-gold': '0 0 24px -4px rgba(245,196,81,0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.4,0,0.2,1)',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16,1,0.3,1)',
        'slide-up-sm': 'slideUpSm 0.35s cubic-bezier(0.16,1,0.3,1)',
        'shimmer': 'shimmer 1.6s infinite',
        'scale-in': 'scaleIn 0.28s cubic-bezier(0.34,1.4,0.64,1)',
        'ken-burns': 'kenBurns 18s ease-out infinite alternate',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(24px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        slideUpSm: { '0%': { transform: 'translateY(10px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        scaleIn: { '0%': { transform: 'scale(0.94)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        kenBurns: { '0%': { transform: 'scale(1) transl-y(0)' }, '100%': { transform: 'scale(1.08) translateY(-1.5%)' } },
      },
    },
  },
  plugins: [],
}
export default config
