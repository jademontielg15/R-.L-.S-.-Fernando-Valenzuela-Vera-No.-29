import { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { Card } from '@/components/ui/Card';
import { ORG_ADDRESS, ORG_PHONE, ORG_EMAIL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Contacto | MRGLVM',
  description: 'Ponte en contacto con la Muy Respetable Gran Logia Valle de México.',
  openGraph: {
    title: 'Contacto | MRGLVM',
  },
};

export default function ContactoPage() {
  return (
    <>
      <Hero
        title="Contacto"
        subtitle="Nos encantaría saber de ti. Envíanos tu mensaje."
      />

      <section className="py-16 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          <Card variant="bordered" className="text-center">
            <h3 className="font-semibold text-lg text-institucional-primario mb-3">Dirección</h3>
            <p className="text-gray-700">{ORG_ADDRESS}</p>
          </Card>
          <Card variant="bordered" className="text-center">
            <h3 className="font-semibold text-lg text-institucional-primario mb-3">Teléfono</h3>
            <p className="text-gray-700">{ORG_PHONE}</p>
          </Card>
          <Card variant="bordered" className="text-center">
            <h3 className="font-semibold text-lg text-institucional-primario mb-3">Email</h3>
            <p className="text-gray-700">{ORG_EMAIL}</p>
          </Card>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card variant="bordered">
            <h2 className="font-serif text-3xl font-bold text-institucional-primario mb-6">
              Envíanos tu Mensaje
            </h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-institucional-primario mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border-2 border-institucional-borde rounded focus:outline-none focus:border-institucional-primario"
                  placeholder="Tu nombre"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-institucional-primario mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border-2 border-institucional-borde rounded focus:outline-none focus:border-institucional-primario"
                  placeholder="tu@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-institucional-primario mb-2">
                  Asunto
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border-2 border-institucional-borde rounded focus:outline-none focus:border-institucional-primario"
                  placeholder="Asunto de tu mensaje"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-institucional-primario mb-2">
                  Mensaje
                </label>
                <textarea
                  className="w-full px-4 py-2 border-2 border-institucional-borde rounded focus:outline-none focus:border-institucional-primario resize-none"
                  rows={6}
                  placeholder="Tu mensaje..."
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-institucional-primario text-white px-6 py-3 rounded font-semibold hover:bg-opacity-90 transition"
              >
                Enviar Mensaje
              </button>
            </form>
          </Card>
        </div>
      </section>

      <section className="py-16 bg-institucional-fondo">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-4xl font-bold text-center text-institucional-primario mb-12">
            Horarios de Atención
          </h2>
          <div className="max-w-2xl mx-auto">
            <Card variant="bordered">
              <table className="w-full">
                <tbody>
                  {[
                    { dia: 'Lunes a Viernes', horario: '09:00 - 18:00' },
                    { dia: 'Sábado', horario: '10:00 - 14:00' },
                    { dia: 'Domingo', horario: 'Cerrado' },
                  ].map((item, idx) => (
                    <tr key={idx} className="border-b border-institucional-borde last:border-b-0">
                      <td className="py-3 px-4 font-semibold text-institucional-primario">{item.dia}</td>
                      <td className="py-3 px-4 text-gray-700 text-right">{item.horario}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
