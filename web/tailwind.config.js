/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  safelist: [
    'bg-primary',
    'text-primary',
    'bg-primary/90',
    'text-primary-foreground',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#C6E0FF',
          foreground: '#0A2540', // Dark foreground for contrast on light primary
        },
      },
    },
  },
  plugins: [],
};

export default config;

