import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Página no encontrada | MRGLVM',
  description: 'La página que buscas no existe o ha sido movida.',
};

export default function NotFound() {
  const sugerencias = [
    { href: '/', label: '🏠 Inicio' },
    { href: '/nosotros', label: '👥 Nosotros' },
    { href: '/revista', label: '📚 Revista' },
    { href: '/ingresa', label: '✍️ Solicitar Ingreso' },
    { href: '/contacto', label: '📧 Contacto' },
  ];

  return (
    <div className="min-h-screen bg-institucional-fondo flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="font-serif text-8xl font-bold text-institucional-primario mb-4">404</h1>
        <h2 className="font-serif text-3xl font-bold text-institucional-primario mb-4">
          Página no encontrada
        </h2>
        <p className="text-gray-700 mb-8">
          La página que buscas no existe o ha sido movida a una nueva dirección.
          Te invitamos a explorar nuestro sitio o regresar al inicio.
        </p>

        {/* CTA Principal */}
        <Link
          href="/"
          className="inline-block bg-institucional-primario text-white px-8 py-3 rounded font-semibold hover:bg-opacity-90 transition mb-8"
        >
          Volver a Inicio
        </Link>

        {/* Sugerencias de navegación */}
        <div className="border-t border-institucional-borde pt-8">
          <p className="text-sm text-gray-600 mb-4">O explora estas páginas populares:</p>
          <div className="grid grid-cols-2 gap-2">
            {sugerencias.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-institucional-primario hover:text-institucional-secundario font-semibold transition"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contacto */}
        <div className="mt-8 pt-8 border-t border-institucional-borde">
          <p className="text-xs text-gray-600">
            ¿Crees que esto es un error?{' '}
            <Link href="/contacto" className="text-institucional-primario font-semibold hover:underline">
              Contacta con nosotros
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
