import { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { Card } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'Qué es la Masonería | MRGLVM',
  description: 'Descubre los principios, símbolos y valores de la masonería.',
  openGraph: {
    title: 'Qué es la Masonería | MRGLVM',
  },
};

const PRINCIPIOS = [
  {
    titulo: 'Fraternidad',
    descripcion: 'Unidad y solidaridad entre todos nuestros hermanos, más allá de diferencias.',
  },
  {
    titulo: 'Tolerancia',
    descripcion: 'Respeto absoluto a las diferentes perspectivas, religiones y creencias.',
  },
  {
    titulo: 'Verdad',
    descripcion: 'Búsqueda constante del conocimiento, la autenticidad y la razón.',
  },
];

const SIMBOLOS = [
  {
    nombre: 'Escuadra y Compás',
    descripcion:
      'Representan la rectitud y la precisión en nuestros actos. La escuadra simboliza la honestidad, el compás la verdad.',
  },
  {
    nombre: 'Letra G',
    descripcion: 'Representa a Dios (en sus múltiples interpretaciones) y la Geometría, base del conocimiento.',
  },
  {
    nombre: 'Templo',
    descripcion:
      'Nuestro espacio sagrado, simbolizando el templo interior que cada masón debe construir en su ser.',
  },
  {
    nombre: 'Tres Grados',
    descripcion:
      'Aprendiz, Compañero y Maestro. Representan tres niveles de iniciación y conocimiento masónico.',
  },
];

const ASAMBLEAS = [
  { nombre: 'Asamblea Madre', descripcion: 'Primera asamblea y base de nuestras operaciones.' },
  { nombre: 'Asamblea Luz', descripcion: 'Dedicada a la educación y difusión de la masonería.' },
  { nombre: 'Asamblea Progreso', descripcion: 'Enfocada en proyectos de beneficencia comunitaria.' },
  { nombre: 'Asamblea Verdad', descripcion: 'Dedicada a la investigación masónica y filosofía.' },
];

export default function MasoneriaPage() {
  return (
    <>
      <Hero
        title="Qué es la Masonería"
        subtitle="Una fraternidad de hombres libres en búsqueda de la verdad"
      />

      <section className="container mx-auto px-4 py-20 md:py-24">
        <div className="measure space-y-6 text-lg leading-relaxed text-content-secondary">
          <p>
            La masonería es una fraternidad mundial de hombres, unidos por sentimientos de amor fraternal, verdad y
            beneficencia mutua. Es una institución filosófica, filantrópica y progresista.
          </p>
          <p>
            Fundada sobre los principios de libertad, igualdad y fraternidad, la masonería ha influido en el desarrollo
            de las sociedades modernas, promoviendo la educación, la caridad y el respeto a los derechos humanos.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {PRINCIPIOS.map((item) => (
            <Card key={item.titulo}>
              <h3 className="font-serif text-xl text-navy-800">{item.titulo}</h3>
              <p className="mt-3 text-content-secondary">{item.descripcion}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="on-inverse bg-navy-900 py-20 text-content-inverse md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="rule-accent font-serif text-content-inverse">Símbolos Masónicos</h2>
          <div className="mt-12 grid max-w-4xl grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2">
            {SIMBOLOS.map((item) => (
              <div key={item.nombre} className="border-l border-gold-400/70 pl-6">
                <h3 className="font-serif text-xl text-content-inverse">{item.nombre}</h3>
                <p className="mt-2 leading-relaxed text-navy-200">{item.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20 md:py-24">
        <h2 className="rule-accent font-serif">Nuestras Asambleas (AJEF&apos;s)</h2>
        <div className="mt-12 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2">
          {ASAMBLEAS.map((item) => (
            <Card key={item.nombre} variant="elevated">
              <h3 className="font-serif text-lg text-navy-800">{item.nombre}</h3>
              <p className="mt-2 text-content-secondary">{item.descripcion}</p>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
