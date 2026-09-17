import Link from 'next/link';
import { Metadata } from 'next';
import { buttonStyles } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Página no encontrada | FVV29',
  description: 'La página que buscas no existe o ha sido movida.',
};

const SUGERENCIAS = [
  { href: '/', label: 'Inicio' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/revista', label: 'Revista' },
  { href: '/ingresa', label: 'Solicitar Ingreso' },
  { href: '/contacto', label: 'Contacto' },
];

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-surface-page px-4 py-20">
      <div className="w-full max-w-lg">
        <p className="text-eyebrow uppercase text-gold-700">Error 404</p>
        <h1 className="mt-4 font-serif">Página no encontrada</h1>
        <div className="mt-6 h-px w-16 bg-gold-700" />
        <p className="mt-6 leading-relaxed text-content-secondary">
          La página que buscas no existe o ha sido movida a una nueva dirección.
          Te invitamos a explorar nuestro sitio o regresar al inicio.
        </p>

        <Link href="/" className={buttonStyles({ className: 'mt-8' })}>
          Volver a Inicio
        </Link>

        <div className="mt-12 border-t border-line-subtle pt-8">
          <p className="text-sm text-content-muted">O explora estas páginas populares:</p>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
            {SUGERENCIAS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm font-medium text-navy-800 underline-offset-4 transition-colors duration-hover ease-out hover:text-gold-700 hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 border-t border-line-subtle pt-6">
          <p className="text-sm text-content-muted">
            ¿Crees que esto es un error? <Link href="/contacto" className="font-medium text-navy-800 underline underline-offset-4 transition-colors duration-hover ease-out hover:text-gold-700">Contacta con nosotros</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
