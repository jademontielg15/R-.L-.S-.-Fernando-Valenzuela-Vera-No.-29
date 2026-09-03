import { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { Card } from '@/components/ui/Card';
import { FormularioSolicitud } from '@/components/FormularioSolicitud/FormularioSolicitud';

export const metadata: Metadata = {
  title: 'Solicitar Ingreso | MRGLVM',
  description: 'Formulario para solicitar ingreso a la Muy Respetable Gran Logia Valle de México.',
  openGraph: {
    title: 'Solicitar Ingreso | MRGLVM',
  },
};

export default function IngresaPage() {
  return (
    <>
      <Hero
        title="Solicita tu Ingreso"
        subtitle="Comienza tu viaje masónico con nosotros"
      />

      <section className="py-16 container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Requisitos */}
          <Card variant="bordered" className="mb-8">
            <h2 className="font-serif text-3xl font-bold text-institucional-primario mb-6">
              Requisitos para Ingresar
            </h2>
            <ul className="space-y-4">
              {[
                'Ser un hombre libre de buenas costumbres',
                'Ser mayor de 18 años',
                'Tener interés genuino en la masonería',
                'Residir en el Valle de México',
                'Estar dispuesto a cumplir con nuestros principios y rituales',
              ].map((req, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="text-institucional-secundario font-bold">✓</span>
                  <span className="text-gray-700">{req}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Formulario */}
          <Card variant="bordered">
            <h2 className="font-serif text-3xl font-bold text-institucional-primario mb-6">
              Solicitud de Ingreso
            </h2>
            <p className="text-gray-700 mb-8">
              Completa el siguiente formulario con tus datos personales. Un representante nuestro se pondrá en contacto
              contigo para programar una entrevista personal. Todos tus datos serán tratados con total confidencialidad.
            </p>

            <FormularioSolicitud />
          </Card>

          {/* Nota adicional */}
          <div className="mt-8 p-6 bg-institucional-fondo rounded-lg border border-institucional-borde text-center">
            <p className="text-gray-700 mb-4">
              <strong>¿Preguntas?</strong> Si tienes dudas sobre el proceso, no dudes en contactarnos.
            </p>
            <a
              href="/contacto"
              className="inline-block bg-institucional-primario text-white px-6 py-2 rounded font-semibold hover:bg-opacity-90 transition"
            >
              Contactar
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
