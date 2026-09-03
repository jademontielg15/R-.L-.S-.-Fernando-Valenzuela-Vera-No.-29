import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        institucional: {
          primario: '#1C2B4A',
          secundario: '#8C6A2F',
          fondo: '#F7F5F0',
          texto: '#1A1A1A',
          textoSuave: '#4A4A4A',
          borde: '#D9D2C2',
        },
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#1A1A1A',
            a: {
              color: '#1C2B4A',
              '&:hover': {
                color: '#8C6A2F',
              },
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
