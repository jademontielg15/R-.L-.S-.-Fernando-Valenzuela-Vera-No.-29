import Image from 'next/image';
import Link from 'next/link';
import { buttonStyles } from '@/components/ui/Button';

const HITOS = [
  {
    year: 1934,
    title: 'Fundación',
    description: 'Establecimiento de la MRGLVM con los principios fundamentales de la masonería.',
  },
  {
    year: 1947,
    title: 'Consolidación',
    description: 'Expansión y fortalecimiento de nuestras logias en el Valle de México.',
  },
  {
    year: 1955,
    title: 'Crecimiento institucional',
    description: 'Fortalecimiento de nuestra presencia y compromiso con la sociedad.',
  },
  {
    year: 'Hoy',
    title: 'Tradición viva',
    description: 'Continuamos formando, sirviendo y construyendo fraternidad.',
  },
] as const;

const IDEALES = [
  { ideal: 'Fraternidad', description: 'Unidad y solidaridad entre nuestros miembros.' },
  { ideal: 'Tolerancia', description: 'Respeto por las diferentes perspectivas y creencias.' },
  { ideal: 'Conocimiento', description: 'Búsqueda constante de la verdad y el desarrollo personal.' },
  { ideal: 'Servicio', description: 'Compromiso activo con nuestra comunidad y su bienestar.' },
] as const;

const ACCESOS = [
  {
    numero: '01',
    titulo: 'Nuestra historia',
    descripcion: 'Conoce el camino que hemos construido desde 1934.',
    href: '/historia',
    accion: 'Explorar historia',
  },
  {
    numero: '02',
    titulo: 'La masonería',
    descripcion: 'Descubre nuestros principios, símbolos y valores.',
    href: '/masoneria',
    accion: 'Conocer más',
  },
  {
    numero: '03',
    titulo: 'Revista institucional',
    descripcion: 'Consulta nuestras publicaciones y memoria documental.',
    href: '/revista',
    accion: 'Ver publicaciones',
  },
  {
    numero: '04',
    titulo: 'Knights Builders',
    descripcion: 'Formación, liderazgo y fraternidad para nuevas generaciones.',
    href: '/knights-builders',
    accion: 'Conocer Knights',
  },
] as const;

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="on-inverse border-b border-navy-700/60 bg-navy-900 text-content-inverse">
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="flex flex-col items-center gap-8 text-center md:flex-row md:items-center md:gap-14 md:text-left">
            <div className="relative h-48 w-48 shrink-0 rounded-full border border-transparent bg-transparent p-0 md:h-72 md:w-72 lg:h-80 lg:w-80">
              <Image
                src="/images/logo.png"
                alt="Logo de la R:.L:.S:. Fernando Valenzuela Vera No. 29"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 192px, (max-width: 1024px) 288px, 320px"
                quality={100}
                style={{ mixBlendMode: 'screen', backgroundColor: 'transparent' }}
              />
            </div>

            <div className="max-w-3xl">
              <p className="text-eyebrow uppercase tracking-[0.16em] text-gold-400">
                R:.L:.S:. Fernando Valenzuela Vera No. 29
              </p>
              <h1 className="text-display font-serif text-content-inverse">
                Tradición, fraternidad y búsqueda de la verdad
              </h1>
              <div className="mx-auto mt-7 h-px w-16 bg-gold-400 md:mx-0" />
              <p className="measure mt-7 text-lg leading-relaxed text-navy-200 md:text-xl">
                Una institución masónica dedicada al desarrollo moral, intelectual y social de sus
                miembros, preservando una tradición viva desde 1934.
              </p>
              <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row md:items-start">
                <Link
                  href="/historia"
                  className={buttonStyles({ variant: 'secondary', size: 'lg' })}
                >
                  Conoce nuestra historia
                </Link>
                <Link
                  href="/ingresa"
                  className={buttonStyles({ variant: 'ghost', size: 'lg', className: 'text-content-inverse hover:bg-white/10 hover:text-content-inverse' })}
                >
                  Solicitar ingreso
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rutas principales */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-2xl">
          <p className="text-eyebrow uppercase text-gold-700">Descubre MRGLVM</p>
          <h2 className="mt-3 font-serif">Un punto de entrada para conocer nuestra institución</h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-md border border-line-subtle bg-line-subtle sm:grid-cols-2 lg:grid-cols-4">
          {ACCESOS.map((acceso) => (
            <Link
              key={acceso.numero}
              href={acceso.href}
              className="group flex min-h-56 flex-col bg-surface-raised p-6 transition-colors duration-hover ease-out hover:bg-sand-50"
            >
              <span className="font-serif text-2xl text-gold-700">{acceso.numero}</span>
              <h3 className="mt-8 font-serif text-xl text-navy-800">{acceso.titulo}</h3>
              <p className="mt-3 text-sm leading-relaxed text-content-secondary">{acceso.descripcion}</p>
              <span className="mt-auto pt-6 text-sm font-medium text-navy-800 underline-offset-4 group-hover:text-gold-700 group-hover:underline">
                {acceso.accion} <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Historia */}
      <section className="container mx-auto px-4 py-20 md:py-24">
        <h2 className="rule-accent font-serif">Nuestra Historia</h2>

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-md border border-line-subtle bg-line-subtle md:grid-cols-2 lg:grid-cols-4">
          {/* El gap de 1px sobre fondo de borde produce separadores hairline
              entre celdas: sustituye a las tres sombras sueltas anteriores, que
              sobre el crema se leían como suciedad y no como elevación. */}
          {HITOS.map((item) => (
            <article
              key={item.year}
              className="group bg-surface-raised p-8 transition-colors duration-hover ease-out hover:bg-sand-50"
            >
              <p className="font-serif text-3xl font-semibold text-gold-700">{item.year}</p>
              <h3 className="mt-3 font-serif text-xl text-navy-800">{item.title}</h3>
              <p className="mt-3 text-content-secondary">{item.description}</p>
            </article>
          ))}
        </div>
        <Link href="/historia" className={buttonStyles({ variant: 'link', className: 'mt-8' })}>
          Explorar la historia completa <span aria-hidden="true">→</span>
        </Link>
      </section>

      {/* Presentación institucional */}
      <section className="border-y border-line-subtle bg-surface-sunken py-20 md:py-24">
        <div className="container mx-auto grid gap-10 px-4 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-center md:gap-20">
          <div>
            <p className="text-eyebrow uppercase text-gold-700">Una tradición viva</p>
            <h2 className="mt-3 font-serif">Formación, reflexión y servicio</h2>
          </div>
          <div>
            <p className="text-lg leading-relaxed text-content-secondary">
              La R:.L:.S:. Fernando Valenzuela Vera No. 29 reúne a hombres comprometidos con el trabajo interior, el aprendizaje y la
              construcción de una sociedad más justa. Nuestra institución ofrece un espacio de
              fraternidad, diálogo y crecimiento responsable.
            </p>
            <Link href="/nosotros" className={buttonStyles({ variant: 'outline', className: 'mt-8' })}>
              Conocer quiénes somos
            </Link>
          </div>
        </div>
      </section>

      {/* Ideales */}
      <section className="on-inverse bg-navy-900 py-20 text-content-inverse md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="rule-accent font-serif text-content-inverse">Nuestros Ideales</h2>

          <div className="mt-12 grid max-w-4xl grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2">
            {IDEALES.map((item) => (
              <div key={item.ideal} className="border-l border-gold-400/70 pl-6">
                <h3 className="font-serif text-xl text-content-inverse">{item.ideal}</h3>
                <p className="mt-2 leading-relaxed text-navy-200">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Revista */}
      <section className="container mx-auto px-4 py-20 md:py-24">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-eyebrow uppercase text-gold-700">Memoria institucional</p>
            <h2 className="mt-3 font-serif">Nuestra revista</h2>
            <p className="mt-5 text-lg leading-relaxed text-content-secondary">
              Consulta las publicaciones institucionales y conoce parte del pensamiento, la historia
              y el trabajo de nuestra comunidad.
            </p>
          </div>
          <Link href="/revista" className={buttonStyles({ variant: 'outline' })}>
            Ver hemeroteca <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* CTA de cierre */}
      <section className="border-t border-line-subtle bg-surface-sunken py-20 md:py-28">
        <div className="container mx-auto grid gap-10 px-4 md:grid-cols-2 md:items-end md:gap-16">
          <div>
            <p className="text-eyebrow uppercase text-gold-700">Da el siguiente paso</p>
            <h2 className="mt-3 font-serif">Conoce, reflexiona y participa</h2>
          </div>
          <div>
            <p className="text-lg leading-relaxed text-content-secondary">
              Si eres un hombre libre de buenas costumbres y deseas conocer más sobre nuestros
              principios, estamos disponibles para orientarte.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/ingresa" className={buttonStyles({ variant: 'default', size: 'lg' })}>
                Solicitar ingreso
              </Link>
              <Link href="/contacto" className={buttonStyles({ variant: 'outline', size: 'lg' })}>
                Contactarnos
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
