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
    title: 'Desarrollo',
    description: 'Crecimiento institucional y reconocimiento nacional e internacional.',
  },
] as const;

const IDEALES = [
  { ideal: 'Fraternidad', description: 'Unidad y solidaridad entre nuestros miembros.' },
  { ideal: 'Tolerancia', description: 'Respeto por las diferentes perspectivas y creencias.' },
  { ideal: 'Verdad', description: 'Búsqueda constante de conocimiento y autenticidad.' },
  { ideal: 'Progreso', description: 'Mejora continua del individuo y la sociedad.' },
] as const;

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="on-inverse border-b border-navy-700/60 bg-navy-900 text-content-inverse">
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-display font-serif text-content-inverse">
              Muy Respetable Gran Logia Valle de México 2
            </h1>
            <div className="mt-7 h-px w-16 bg-gold-400" />
            <p className="measure mt-7 text-lg leading-relaxed text-navy-200 md:text-xl">
              Preservando la tradición masónica, los ideales de fraternidad y la búsqueda de la
              verdad desde 2026.
            </p>
            <Link
              href="/ingresa"
              className={buttonStyles({ variant: 'secondary', size: 'lg', className: 'mt-10' })}
            >
              Solicitar Ingreso
            </Link>
          </div>
        </div>
      </section>

      {/* Historia */}
      <section className="container mx-auto px-4 py-20 md:py-24">
        <h2 className="rule-accent font-serif">Nuestra Historia</h2>

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-md border border-line-subtle bg-line-subtle md:grid-cols-3">
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

      {/* CTA de cierre */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <div className="max-w-2xl">
          <h2 className="font-serif">¿Interesado en ingresar?</h2>
          <p className="measure mt-6 text-lg leading-relaxed text-content-secondary">
            Si eres un hombre libre de buenas costumbres y te interesa conocer más sobre nuestros
            principios, te invitamos a solicitar ingreso.
          </p>
          <Link
            href="/ingresa"
            className={buttonStyles({ variant: 'default', size: 'lg', className: 'mt-9' })}
          >
            Completar Solicitud
          </Link>
        </div>
      </section>
    </>
  );
}
