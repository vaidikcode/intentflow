import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: { center: true, padding: '1.5rem' },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        // Neo-brutalism palette
        neo: {
          yellow: '#F5E642',
          black: '#0A0A0A',
          white: '#FAFAFA',
          green: '#00C853',
          red: '#FF3B3B',
          blue: '#2563EB',
          orange: '#FF6B35',
        },
      },
      borderRadius: {
        lg: '4px',
        md: '2px',
        sm: '2px',
        DEFAULT: '2px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      boxShadow: {
        neo: '4px 4px 0px #0A0A0A',
        'neo-sm': '2px 2px 0px #0A0A0A',
        'neo-lg': '6px 6px 0px #0A0A0A',
        'neo-yellow': '4px 4px 0px #F5E642',
        'neo-inset': 'inset 2px 2px 0px #0A0A0A',
      },
      keyframes: {
        'fade-in': { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'slide-right': { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(0)' } },
        wiggle: { '0%,100%': { transform: 'rotate(-1deg)' }, '50%': { transform: 'rotate(1deg)' } },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-right': 'slide-right 0.3s ease-out',
        wiggle: 'wiggle 0.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
