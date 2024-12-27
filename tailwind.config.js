/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      gridTemplateColumns: {
        'auto-fit': 'repeat(auto-fit, minmax(4rem, 1fr))',
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'spin-slow': 'spin 8s linear infinite',
        'bounce': 'bounce 3s ease-in-out infinite',
        'breathe': 'breathe 3s ease-in-out',
        'fade-in': 'fadeIn 1s ease-in forwards',
        'fade-in-delayed': 'fadeIn 1s ease-in 0.5s forwards',
        'flash': 'flash 2s ease-out forwards',
        'glitch': 'glitch 0.5s forwards',
        'glitch-2': 'glitch-2 0.5s forwards',
        'progress': 'progress 2s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 3s ease-in-out infinite'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        breathe: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        flash: {
          '0%': { opacity: '1' },
          '10%': { opacity: '0' },
          '100%': { opacity: '0' }
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '100%': { transform: 'translate(0)', filter: 'none' }
        },
        'glitch-2': {
          '0%': { transform: 'translate(0)', filter: 'hue-rotate(0deg)' },
          '100%': { transform: 'translate(0)', filter: 'none' }
        },
        'progress': {
          '0%': { width: '0%', opacity: 0.5 },
          '50%': { width: '100%', opacity: 1 },
          '100%': { width: '0%', opacity: 0.5 }
        },
        'pulse-slow': {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 1 }
        }
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('tailwind-scrollbar')
  ],
};