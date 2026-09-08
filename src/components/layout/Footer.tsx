import Link from 'next/link';
import { ORG_NAME, ORG_SHORTNAME, ORG_ADDRESS, SOCIAL_LINKS } from '@/lib/constants';

const ENLACES = [
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/revista', label: 'Revista' },
  { href: '/ingresa', label: 'Solicitar Ingreso' },
  { href: '/aviso-de-privacidad', label: 'Aviso de Privacidad' },
] as const;

/**
 * Antes los iconos eran los caracteres sueltos "f", "📷", "𝕏", "▶" como texto
 * del enlace: un lector de pantalla anunciaba «enlace, f». Ahora son SVG
 * decorativos con el nombre de la red en un `sr-only`.
 */
const SOCIALES = [
  { href: SOCIAL_LINKS.facebook, label: 'Facebook', path: 'M13.5 9H11V7.5c0-.6.4-.75.7-.75h1.8V4.5h-2C9.3 4.5 8.75 6.1 8.75 7.1V9H7v2.5h1.75V19h2.25v-7.5h1.9L13.5 9Z' },
  { href: SOCIAL_LINKS.instagram, label: 'Instagram', path: 'M12 4.5c-2.04 0-2.3.01-3.1.05-.8.04-1.34.16-1.82.35a3.67 3.67 0 0 0-1.33.86c-.41.42-.67.84-.86 1.33-.19.48-.31 1.02-.35 1.82C4.51 9.7 4.5 9.96 4.5 12s.01 2.3.05 3.1c.04.8.16 1.34.35 1.82.19.49.45.91.86 1.33.42.41.84.67 1.33.86.48.19 1.02.31 1.82.35.8.04 1.06.05 3.1.05s2.3-.01 3.1-.05c.8-.04 1.34-.16 1.82-.35a3.67 3.67 0 0 0 1.33-.86c.41-.42.67-.84.86-1.33.19-.48.31-1.02.35-1.82.04-.8.05-1.06.05-3.1s-.01-2.3-.05-3.1c-.04-.8-.16-1.34-.35-1.82a3.67 3.67 0 0 0-.86-1.33 3.67 3.67 0 0 0-1.33-.86c-.48-.19-1.02-.31-1.82-.35-.8-.04-1.06-.05-3.1-.05Zm0 1.35c2 0 2.24.01 3.03.05.73.03 1.13.15 1.39.25.35.14.6.3.86.56.26.26.42.51.56.86.1.26.22.66.25 1.39.04.79.05 1.03.05 3.03s-.01 2.24-.05 3.03c-.03.73-.15 1.13-.25 1.39-.14.35-.3.6-.56.86-.26.26-.51.42-.86.56-.26.1-.66.22-1.39.25-.79.04-1.03.05-3.03.05s-2.24-.01-3.03-.05c-.73-.03-1.13-.15-1.39-.25a2.32 2.32 0 0 1-.86-.56 2.32 2.32 0 0 1-.56-.86c-.1-.26-.22-.66-.25-1.39-.04-.79-.05-1.03-.05-3.03s.01-2.24.05-3.03c.03-.73.15-1.13.25-1.39.14-.35.3-.6.56-.86.26-.26.51-.42.86-.56.26-.1.66-.22 1.39-.25.79-.04 1.03-.05 3.03-.05Zm0 2.3a3.85 3.85 0 1 0 0 7.7 3.85 3.85 0 0 0 0-7.7Zm0 6.35a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Zm4.9-6.5a.9.9 0 1 1-1.8 0 .9.9 0 0 1 1.8 0Z' },
  { href: SOCIAL_LINKS.twitter, label: 'X', path: 'M13.9 10.6 19.4 4.5h-1.3l-4.8 5.3-3.8-5.3H5l5.8 8.1L5 19h1.3l5-5.6 4 5.6h4.5l-6-8.4Zm-1.8 2-.6-.8-4.6-6.4h2l3.7 5.2.6.8 4.9 6.8h-2l-4-5.6Z' },
  { href: SOCIAL_LINKS.youtube, label: 'YouTube', path: 'M19.6 8.2a2 2 0 0 0-1.4-1.4C17 6.5 12 6.5 12 6.5s-5 0-6.2.3A2 2 0 0 0 4.4 8.2C4.1 9.4 4.1 12 4.1 12s0 2.6.3 3.8a2 2 0 0 0 1.4 1.4c1.2.3 6.2.3 6.2.3s5 0 6.2-.3a2 2 0 0 0 1.4-1.4c.3-1.2.3-3.8.3-3.8s0-2.6-.3-3.8ZM10.4 14.4V9.6l4.2 2.4-4.2 2.4Z' },
] as const;

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="on-inverse mt-24 bg-navy-900 text-content-inverse">
      {/* Hairline dorada: el único uso de color de acento a todo lo ancho. */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold-700 to-transparent" />

      <div className="container mx-auto grid grid-cols-1 gap-10 px-4 py-14 md:grid-cols-3 md:gap-8">
        <div>
          <h3 className="font-serif text-xl font-semibold tracking-[-0.015em] text-content-inverse">
            {ORG_SHORTNAME}
          </h3>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-navy-200">
            {ORG_NAME}. Preservando la tradición masónica desde 1934.
          </p>
        </div>

        <div>
          <h4 className="text-eyebrow uppercase text-gold-400">Enlaces</h4>
          <ul className="mt-4 space-y-3 text-sm">
            {ENLACES.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-navy-200 underline-offset-4 transition-colors duration-hover ease-out hover:text-content-inverse hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-eyebrow uppercase text-gold-400">Contacto</h4>
          <p className="mt-4 text-sm text-navy-200">
            <span className="text-content-inverse">Dirección:</span> {ORG_ADDRESS}
          </p>
          <ul className="mt-6 flex gap-1">
            {SOCIALES.map((red) => (
              <li key={red.label}>
                <a
                  href={red.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded text-navy-200 transition-[color,background-color,transform] duration-hover ease-out hover:bg-white/10 hover:text-content-inverse active:scale-95"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d={red.path} />
                  </svg>
                  <span className="sr-only">{red.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* La barra inferior no tenía contenedor ni padding lateral: el texto
          quedaba pegado a los bordes del viewport. */}
      <div className="border-t border-navy-700/60">
        <div className="container mx-auto px-4 py-6">
          <p className="text-sm text-navy-300">
            &copy; {currentYear} {ORG_NAME}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
