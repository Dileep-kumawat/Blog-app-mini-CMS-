/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: {
          50:  '#f4f3f0',
          100: '#e8e6e0',
          200: '#d4cfc5',
          300: '#bab3a5',
          400: '#9e9485',
          500: '#887d6d',
          600: '#726759',
          700: '#5d544a',
          800: '#4d453d',
          900: '#433b35',
          950: '#241f1a',
        },
        cream: {
          50:  '#fdfcf8',
          100: '#faf8f2',
          200: '#f5f1e6',
          300: '#ede6d3',
          400: '#e2d8bc',
          500: '#d4c8a4',
        },
        accent: {
          DEFAULT: '#c9622f',
          light:   '#e07a4a',
          dark:    '#a04d22',
        },
      },
      typography: (theme) => ({
        ink: {
          css: {
            '--tw-prose-body': theme('colors.ink.700'),
            '--tw-prose-headings': theme('colors.ink.950'),
            '--tw-prose-links': theme('colors.accent.DEFAULT'),
            '--tw-prose-bold': theme('colors.ink.900'),
            '--tw-prose-counters': theme('colors.ink.500'),
            '--tw-prose-bullets': theme('colors.ink.400'),
            '--tw-prose-hr': theme('colors.ink.200'),
            '--tw-prose-quotes': theme('colors.ink.900'),
            '--tw-prose-quote-borders': theme('colors.accent.DEFAULT'),
            '--tw-prose-captions': theme('colors.ink.500'),
            '--tw-prose-code': theme('colors.ink.900'),
            '--tw-prose-pre-code': theme('colors.cream.100'),
            '--tw-prose-pre-bg': theme('colors.ink.900'),
            '--tw-prose-th-borders': theme('colors.ink.300'),
            '--tw-prose-td-borders': theme('colors.ink.200'),
          },
        },
      }),
      animation: {
        'fade-in':    'fadeIn 0.5s ease forwards',
        'slide-up':   'slideUp 0.5s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
