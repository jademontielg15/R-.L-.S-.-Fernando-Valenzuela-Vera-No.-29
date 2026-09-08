import type { Config } from 'tailwindcss';

/**
 * Los colores se leen desde las variables de `globals.css`. El formato
 * `rgb(var(--x) / <alpha-value>)` es lo que permite seguir usando
 * modificadores de opacidad (`bg-navy-800/60`) sobre un token.
 */
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const scale = (prefix: string, steps: readonly (number | string)[]) =>
  Object.fromEntries(steps.map((s) => [String(s), token(`${prefix}-${s}`)]));

const config: Config = {
  /**
   * Gatea todas las variantes `hover:` tras `@media (hover: hover)`. En tactil,
   * un tap dispara :hover y el estado se queda pegado despues de soltar.
   */
  future: { hoverOnlyWhenSupported: true },
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: scale('navy', [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]),
        gold: scale('gold', [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]),
        sand: scale('sand', [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]),

        surface: {
          page: token('surface-page'),
          raised: token('surface-raised'),
          sunken: token('surface-sunken'),
          inverse: token('surface-inverse'),
        },
        content: {
          primary: token('text-primary'),
          secondary: token('text-secondary'),
          muted: token('text-muted'),
          inverse: token('text-on-inverse'),
          'inverse-soft': token('text-on-inverse-soft'),
        },
        line: {
          subtle: token('border-subtle'),
          DEFAULT: token('border-default'),
          strong: token('border-strong'),
          inverse: token('border-on-inverse'),
        },
        accent: {
          DEFAULT: token('accent'),
          inverse: token('accent-on-inverse'),
        },
        danger: {
          DEFAULT: token('danger'),
          soft: token('danger-soft'),
        },
        success: token('success'),
      },

      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        // Escala fluida para display. El resto hereda la escala de Tailwind.
        display: [
          'clamp(2.5rem, 1.6rem + 3.6vw, 4.25rem)',
          { lineHeight: '1.06', letterSpacing: '-0.028em', fontWeight: '600' },
        ],
        eyebrow: [
          '0.75rem',
          { lineHeight: '1', letterSpacing: '0.14em', fontWeight: '600' },
        ],
      },

      borderRadius: {
        DEFAULT: '0.375rem', // 6px — el radio del sistema
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
      },

      /**
       * Sombras teñidas de navy en vez del negro neutro de Tailwind. Sobre un
       * fondo cálido como el crema, una sombra gris se lee sucia en lugar de
       * elevada. Van en dos capas (contacto + difusión) para tener profundidad.
       */
      boxShadow: {
        xs: '0 1px 2px rgb(var(--navy-800) / 0.04)',
        sm: '0 1px 2px rgb(var(--navy-800) / 0.04), 0 2px 4px rgb(var(--navy-800) / 0.04)',
        DEFAULT:
          '0 1px 2px rgb(var(--navy-800) / 0.04), 0 4px 8px rgb(var(--navy-800) / 0.05)',
        md: '0 2px 4px rgb(var(--navy-800) / 0.04), 0 6px 12px rgb(var(--navy-800) / 0.06)',
        lg: '0 4px 8px rgb(var(--navy-800) / 0.05), 0 12px 28px rgb(var(--navy-800) / 0.08)',
        xl: '0 8px 16px rgb(var(--navy-800) / 0.06), 0 24px 48px rgb(var(--navy-800) / 0.10)',
        none: 'none',
      },

      transitionTimingFunction: {
        out: 'var(--ease-out)',
        'in-out': 'var(--ease-in-out)',
      },

      transitionDuration: {
        press: '140ms',
        hover: '160ms',
        enter: '240ms',
      },

      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },

      animation: {
        'fade-up': 'fade-up 240ms var(--ease-out) both',
      },

      maxWidth: {
        measure: 'var(--measure)',
      },

      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': 'rgb(var(--text-secondary))',
            '--tw-prose-headings': 'rgb(var(--navy-800))',
            '--tw-prose-links': 'rgb(var(--navy-800))',
            '--tw-prose-bold': 'rgb(var(--text-primary))',
            '--tw-prose-quotes': 'rgb(var(--navy-800))',
            '--tw-prose-quote-borders': 'rgb(var(--gold-700))',
            '--tw-prose-hr': 'rgb(var(--border-subtle))',
            maxWidth: 'var(--measure)',
            a: {
              textDecoration: 'none',
              textUnderlineOffset: '0.2em',
              textDecorationThickness: '1px',
              '&:hover': {
                color: 'rgb(var(--gold-700))',
                textDecoration: 'underline',
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
