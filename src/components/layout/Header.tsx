import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-institucional-primario text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="font-serif text-2xl font-bold hover:text-institucional-secundario transition">
          MRGLVM
        </Link>

        {/* Navigation */}
        <nav className="flex gap-6 items-center">
          <Link href="/nosotros" className="hover:text-institucional-secundario transition">
            Nosotros
          </Link>
          <Link href="/historia" className="hover:text-institucional-secundario transition">
            Historia
          </Link>
          <Link href="/masoneria" className="hover:text-institucional-secundario transition">
            Masonería
          </Link>
          <Link href="/revista" className="hover:text-institucional-secundario transition">
            Revista
          </Link>
          <Link href="/knights-builders" className="hover:text-institucional-secundario transition">
            Knights
          </Link>
          <Link href="/contacto" className="hover:text-institucional-secundario transition">
            Contacto
          </Link>
        </nav>

        {/* CTA Button */}
        <Link
          href="/ingresa"
          className="bg-institucional-secundario text-white px-6 py-2 rounded hover:bg-opacity-90 transition font-semibold"
        >
          Ingresa
        </Link>
      </div>
    </header>
  );
}
