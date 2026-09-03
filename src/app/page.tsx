import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-institucional-fondo">
      {/* Hero Section */}
      <section className="bg-institucional-primario text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-5xl font-bold mb-6">
            Muy Respetable Gran Logia Valle de México
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Preservando la tradición masónica, los ideales de fraternidad y la búsqueda de la verdad desde 1934.
          </p>
          <Link
            href="/ingresa"
            className="inline-block bg-institucional-secundario text-white px-8 py-3 rounded font-semibold hover:bg-opacity-90 transition"
          >
            Solicitar Ingreso
          </Link>
        </div>
      </section>

      {/* Historical Overview */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="font-serif text-4xl font-bold text-center mb-12">
          Nuestra Historia
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
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
          ].map((item) => (
            <div key={item.year} className="bg-white p-6 rounded-lg shadow-md border-t-4 border-institucional-secundario">
              <h3 className="font-serif text-2xl font-bold text-institucional-primario mb-2">
                {item.year}
              </h3>
              <h4 className="font-semibold text-lg mb-3">{item.title}</h4>
              <p className="text-gray-700">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ideals Section */}
      <section className="bg-institucional-primario text-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-4xl font-bold text-center mb-12">
            Nuestros Ideales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {[
              {
                ideal: 'Fraternidad',
                description: 'Unidad y solidaridad entre nuestros miembros.',
              },
              {
                ideal: 'Tolerancia',
                description: 'Respeto por las diferentes perspectivas y creencias.',
              },
              {
                ideal: 'Verdad',
                description: 'Búsqueda constante de conocimiento y autenticidad.',
              },
              {
                ideal: 'Progreso',
                description: 'Mejora continua del individuo y la sociedad.',
              },
            ].map((item) => (
              <div key={item.ideal} className="border-l-4 border-institucional-secundario pl-6">
                <h3 className="font-serif text-2xl font-bold mb-3">{item.ideal}</h3>
                <p className="text-gray-100">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 container mx-auto px-4 text-center">
        <h2 className="font-serif text-4xl font-bold mb-6">¿Interesado en ingresar?</h2>
        <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
          Si eres un hombre libre de buenas costumbres y te interesa conocer más sobre nuestros principios, te invitamos a solicitar ingreso.
        </p>
        <Link
          href="/ingresa"
          className="inline-block bg-institucional-primario text-white px-8 py-3 rounded font-semibold hover:bg-opacity-90 transition"
        >
          Completar Solicitud
        </Link>
      </section>
    </div>
  );
}
