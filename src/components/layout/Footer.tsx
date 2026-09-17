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
  { href: SOCIAL_LINKS.whatsapp, label: 'WhatsApp', path: 'M13.9 10.6 19.4 4.5h-1.3l-4.8 5.3-3.8-5.3H5l5.8 8.1L5 19h1.3l5-5.6 4 5.6h4.5l-6-8.4Zm-1.8 2-.6-.8-4.6-6.4h2l3.7 5.2.6.8 4.9 6.8h-2l-4-5.6Z' },
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
