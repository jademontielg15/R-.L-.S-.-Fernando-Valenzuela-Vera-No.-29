import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-institucional-primario text-white mt-16">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About */}
        <div>
          <h3 className="font-serif text-xl font-bold mb-4">MRGLVM</h3>
          <p className="text-gray-300 text-sm">
            Muy Respetable Gran Logia Valle de México. Preservando la tradición masónica desde 1934.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-serif text-lg font-bold mb-4">Enlaces</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/nosotros" className="text-gray-300 hover:text-institucional-secundario transition">
                Nosotros
              </Link>
            </li>
            <li>
              <Link href="/revista" className="text-gray-300 hover:text-institucional-secundario transition">
                Revista
              </Link>
            </li>
            <li>
              <Link href="/ingresa" className="text-gray-300 hover:text-institucional-secundario transition">
                Solicitar Ingreso
              </Link>
            </li>
            <li>
              <Link href="/aviso-de-privacidad" className="text-gray-300 hover:text-institucional-secundario transition">
                Aviso de Privacidad
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h4 className="font-serif text-lg font-bold mb-4">Contacto</h4>
          <p className="text-gray-300 text-sm mb-4">
            <strong>Dirección:</strong> Valle de México
          </p>
          <div className="flex gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-institucional-secundario transition">
              f
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-institucional-secundario transition">
              📷
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-institucional-secundario transition">
              𝕏
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-institucional-secundario transition">
              ▶
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-8 pt-8 pb-4 flex justify-between items-center text-sm text-gray-400">
        <p>&copy; {currentYear} Muy Respetable Gran Logia Valle de México. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
