import type { Config } from 'tailwindcss';
import flowbite from 'flowbite-react/tailwind';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    flowbite.content(),
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F4C81',
          50: '#E6F0F9',
          100: '#CCE1F3',
          200: '#99C3E7',
          300: '#66A5DB',
          400: '#3387CF',
          500: '#0F4C81',
          600: '#1E6BA5',
          700: '#0A3459',
          800: '#072438',
          900: '#04141F',
          950: '#020A10',
        },
      },
      fontFamily: {
        sans: ['Source Sans 3', 'sans-serif'],
        heading: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Monaco', 'Cascadia Code', 'Courier New', 'monospace'],
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out both',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [flowbite.plugin()],
};

export default config;
