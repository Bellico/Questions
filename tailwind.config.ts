import type { Config } from 'tailwindcss'

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      screens: {
        // sm: '600px',
        // md: '1284px',
        lg: '1284px',
        xl: '1675px',
        '2xl': '2000px'
      },
      padding: {
        DEFAULT: '1rem',
        // sm: '2rem',
        // lg: '4rem',
        // xl: '5rem',
        // '2xl': '6rem',
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        success: 'hsl(var(--success))',
        spinner: 'hsl(var(--primary)) hsl(var(--primary)) transparent',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        wiggle: {
          from: { 'opacity': '0' },
          to: { 'opacity': '1' },
        },
        spinner: {
          '0%': { 'transform': 'rotate(0deg) scale(1)' },
          '50%': { 'transform': 'rotate(180deg) scale(0.8)' },
          '100%': { 'transform': 'rotate(360deg) scale(1)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'zoomIn': {
          from: { opacity: '0', 'transform': 'scale3d(0.3, 0.3, 0.3)' },
          '100%': { opacity: '1' },
        },
        'zoomInEditor': {
          from: { translateY: '20', opacity: '0' },
          to: { translateY: '0', opacity: '1'},
        },
        'moveToLeft': {
          from: { 'transform': 'translateX(100%)' },
          to: { 'transform': 'translateX(0)' },
        },
      },
      animation: {
        'wiggle': 'wiggle 0.1s ease-in-out',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'spinner': '0.75s linear 0s infinite normal both running spinner',
        'zoomIn': 'zoomIn 0.2s ease-in-out',
        'zoomInEditor': 'zoomInEditor 0.75s ease-in-out',
        'moveToLeft': 'moveToLeft .6s ease both',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config

export default config
