/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        foreground: '#f4f4f5',
        card: {
          DEFAULT: '#111114',
          foreground: '#f4f4f5',
        },
        popover: {
          DEFAULT: '#141418',
          foreground: '#f4f4f5',
        },
        primary: {
          DEFAULT: '#ffffff',
          foreground: '#09090b',
          accent: '#3b82f6',
        },
        secondary: {
          DEFAULT: '#1c1c21',
          foreground: '#f4f4f5',
        },
        muted: {
          DEFAULT: '#18181b',
          foreground: '#a1a1aa',
        },
        accent: {
          DEFAULT: '#27272a',
          foreground: '#f4f4f5',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        border: '#222227',
        input: '#1a1a1f',
        ring: '#3b82f6',
        surface: {
          50: '#18181b',
          100: '#131316',
          200: '#0f0f12',
          300: '#09090b',
          border: '#222227',
          hover: '#1a1a20',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif'
        ],
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'Menlo',
          'monospace'
        ]
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
        elevated: '0 8px 30px rgba(0, 0, 0, 0.45)',
        card: '0 0 0 1px rgba(255, 255, 255, 0.07), 0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        'card-hover': '0 0 0 1px rgba(255, 255, 255, 0.12), 0 8px 28px -4px rgba(0, 0, 0, 0.65)',
      }
    },
  },
  plugins: [],
};
