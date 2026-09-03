import { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { Card, CardBody } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'Qué es la Masonería | MRGLVM',
  description: 'Descubre los principios, símbolos y valores de la masonería.',
  openGraph: {
    title: 'Qué es la Masonería | MRGLVM',
  },
};

export default function MasoneriaPage() {
  return (
    <>
      <Hero
        title="Qué es la Masonería"
        subtitle="Una fraternidad de hombres libres en búsqueda de la verdad"
      />

      <section className="py-16 container mx-auto px-4">
        <div className="max-w-3xl mx-auto mb-12">
          <p className="text-lg text-gray-700 mb-6">
            La masonería es una fraternidad mundial de hombres, unidos por sentimientos de amor fraternal, verdad y
            beneficencia mutua. Es una institución filosófica, filantrópica y progresista.
          </p>
          <p className="text-lg text-gray-700">
            Fundada sobre los principios de libertad, igualdad y fraternidad, la masonería ha influido en el desarrollo
            de las sociedades modernas, promoviendo la educación, la caridad y el respeto a los derechos humanos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
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
          ].map((item, idx) => (
            <Card key={idx} variant="bordered">
              <h3 className="font-serif text-2xl font-bold text-institucional-primario mb-3">
                {item.titulo}
              </h3>
              <p className="text-gray-700">{item.descripcion}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-16 bg-institucional-primario text-white">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-4xl font-bold text-center mb-12">Símbolos Masónicos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {[
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
            ].map((item, idx) => (
              <div key={idx} className="border-l-4 border-institucional-secundario pl-6">
                <h3 className="font-serif text-2xl font-bold mb-3">{item.nombre}</h3>
                <p className="text-gray-100">{item.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 container mx-auto px-4">
        <h2 className="font-serif text-4xl font-bold text-center text-institucional-primario mb-12">
          Nuestras Asambleas (AJEF's)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {[
            { nombre: 'Asamblea Madre', descripcion: 'Primera asamblea y base de nuestras operaciones.' },
            { nombre: 'Asamblea Luz', descripcion: 'Dedicada a la educación y difusión de la masonería.' },
            { nombre: 'Asamblea Progreso', descripcion: 'Enfocada en proyectos de beneficencia comunitaria.' },
            { nombre: 'Asamblea Verdad', descripcion: 'Dedicada a la investigación masónica y filosofía.' },
          ].map((item, idx) => (
            <Card key={idx} variant="elevated">
              <h3 className="font-semibold text-lg text-institucional-primario mb-2">{item.nombre}</h3>
              <p className="text-gray-700">{item.descripcion}</p>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
