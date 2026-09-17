'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { buttonStyles } from '@/components/ui/Button';
import { ORG_SHORTNAME } from '@/lib/constants';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/historia', label: 'Historia' },
  { href: '/masoneria', label: 'Masonería' },
  { href: '/revista', label: 'Revista' },
  { href: '/knights-builders', label: 'Knights' },
  { href: '/contacto', label: 'Contacto' },
] as const;

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // El panel móvil no debe sobrevivir a una navegación.
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="on-inverse sticky top-0 z-50 border-b border-navy-700/60 bg-navy-900 text-content-inverse">
      <div className="container mx-auto flex h-[4.5rem] items-center justify-between gap-6 px-4">
        <Link
          href="/"
          className="flex items-center gap-3 font-serif text-[1.375rem] font-semibold tracking-[-0.02em] transition-colors duration-hover ease-out hover:text-gold-300"
        >
          <Image
            src="/images/logo.png"
            alt="R:.L:.S:. Fernando Valenzuela Vera No. 29"
            width={40}
            height={40}
            priority
            className="h-10 w-10 shrink-0"
          />
          {ORG_SHORTNAME}
        </Link>

        {/* Navegación de escritorio */}
        <nav aria-label="Principal" className="hidden lg:flex lg:items-center lg:gap-1.5">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative rounded border border-transparent px-3 py-2 text-[0.9375rem] font-medium transition-[background-color,border-color,color] duration-hover ease-out',
                  // navy-200 sobre navy-900 da 10.1:1. El dorado de marca sobre
                  // el azul solo daba 2.82:1 y fallaba AA como estado hover.
                  active
                    ? 'border-gold-400/50 bg-navy-800/70 text-gold-200'
                    : 'text-navy-200 hover:border-navy-700 hover:bg-navy-800/60 hover:text-gold-200',
                  // La regla dorada marca la sección activa: acento como señal,
                  // no como decoración.
                  'after:absolute after:inset-x-3 after:-bottom-px after:h-px after:bg-gold-400',
                  'after:origin-left after:transition-transform after:duration-enter after:ease-out',
                  active ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/ingresa"
            className={buttonStyles({
              variant: 'secondary',
              size: 'sm',
              className:
                'hidden border border-gold-400/60 shadow-xs hover:border-gold-300 hover:shadow-sm sm:inline-flex',
            })}
          >
            Ingresa
          </Link>

          {/* Disparador del menú móvil */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="nav-movil"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded text-content-inverse transition-[background-color,transform] duration-press ease-out hover:bg-white/10 active:scale-95 lg:hidden"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? (
                <>
                  <line x1="5" y1="5" x2="15" y2="15" />
                  <line x1="15" y1="5" x2="5" y2="15" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="17" y2="6" />
                  <line x1="3" y1="10" x2="17" y2="10" />
                  <line x1="3" y1="14" x2="17" y2="14" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Panel móvil. Antes los 6 enlaces vivían en un flex sin breakpoint y se
          desbordaban por debajo de ~900px. */}
      {open && (
        <nav
          id="nav-movil"
          aria-label="Principal móvil"
          className="animate-fade-up border-t border-navy-700/60 bg-navy-900 lg:hidden"
        >
          <ul className="container mx-auto px-4 py-2">
            {NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-3 border-l-2 py-3 pl-4 text-base font-medium transition-[background-color,border-color,color] duration-hover ease-out',
                      active
                        ? 'border-l-gold-400 bg-navy-800/70 text-gold-200'
                        : 'border-l-transparent text-navy-200 hover:border-l-gold-300 hover:bg-navy-800/60 hover:text-gold-200'
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li className="py-3 sm:hidden">
              <Link
                href="/ingresa"
                className={buttonStyles({ variant: 'secondary', className: 'w-full' })}
              >
                Ingresa
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
