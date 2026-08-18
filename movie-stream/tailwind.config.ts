import type { Config } from 'tailwindcss'

const ink = (name: string) => `rgb(var(--ink-${name}) / <alpha-value>)`

const config: Config = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: { 50: ink('accent'), 100: ink('accent'), 200: ink('accent'), 300: ink('accent'), 400: ink('accent'), 500: ink('accent'), 600: ink('accent'), 700: ink('accent'), 800: ink('accent'), 900: ink('accent'), 950: ink('accent'), contrast: ink('accent-text') },
        surface: { dark: ink('page'), light: ink('page'), card: { dark: ink('card'), light: ink('card') }, border: { dark: ink('border'), light: ink('border') } },
        text: { primary: { dark: ink('text'), light: ink('text') }, secondary: { dark: ink('secondary'), light: ink('secondary') }, muted: { dark: ink('muted'), light: ink('muted') } },
      },
      fontFamily: { display: ['Outfit', 'system-ui', 'sans-serif'], body: ['Inter', 'system-ui', 'sans-serif'] },
      fontSize: { 'display-2xl': ['clamp(4rem, 10vw, 7rem)', { lineHeight: '1', letterSpacing: '-.04em' }], 'display-xl': ['clamp(3.5rem, 8vw, 6rem)', { lineHeight: '1.05', letterSpacing: '-.03em' }], 'display-lg': ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-.02em' }], 'display-md': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.15', letterSpacing: '-.01em' }], 'display-sm': ['clamp(1.5rem, 3vw, 2.25rem)', { lineHeight: '1.2', letterSpacing: '-.01em' }], 'heading-lg': ['1.875rem', { lineHeight: '1.25' }], 'heading-md': ['1.5rem', { lineHeight: '1.3' }], 'heading-sm': ['1.25rem', { lineHeight: '1.35' }], 'body-lg': ['1.125rem', { lineHeight: '1.6' }], body: ['1rem', { lineHeight: '1.6' }], 'body-sm': ['.875rem', { lineHeight: '1.5' }], caption: ['.75rem', { lineHeight: '1.5', letterSpacing: '.02em' }] },
      spacing: { 'space-0': '0', 'space-1': '.25rem', 'space-2': '.5rem', 'space-3': '.75rem', 'space-4': '1rem', 'space-5': '1.25rem', 'space-6': '1.5rem', 'space-8': '2rem', 'space-10': '2.5rem', 'space-12': '3rem', 'space-16': '4rem', 'space-20': '5rem', 'space-24': '6rem' },
      boxShadow: { 'shadow-sm': '0 1px 2px 0 rgb(0 0 0 / .05)', 'shadow-md': '0 4px 6px -1px rgb(0 0 0 / .1)', 'shadow-lg': '0 10px 15px -3px rgb(0 0 0 / .1)', 'shadow-xl': '0 20px 25px -5px rgb(0 0 0 / .1)', 'shadow-card': '0 4px 20px -4px rgb(0 0 0 / .14)', 'shadow-card-hover': '0 12px 40px -8px rgb(0 0 0 / .2)', 'shadow-glow': '0 0 0 1px rgb(var(--ink-accent) / .25), 0 12px 24px -4px rgb(var(--ink-accent) / .22)' },
      animation: { 'fade-in': 'fadeIn .4s ease-out forwards', 'slide-up': 'slideUp .5s ease-out forwards', 'slide-down': 'slideDown .3s ease-out forwards', 'scale-in': 'scaleIn .3s ease-out forwards', shimmer: 'shimmer 2s ease-in-out infinite', 'pulse-soft': 'pulseSoft 2s ease-in-out infinite' },
      keyframes: { fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } }, slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } }, slideDown: { '0%': { opacity: '0', transform: 'translateY(-10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } }, scaleIn: { '0%': { opacity: '0', transform: 'scale(.95)' }, '100%': { opacity: '1', transform: 'scale(1)' } }, shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } }, pulseSoft: { '0%,100%': { opacity: '1' }, '50%': { opacity: '.6' } } },
    },
  },
  plugins: [],
}
export default config
