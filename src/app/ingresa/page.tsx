import { Metadata } from 'next';
import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { Card } from '@/components/ui/Card';
import { buttonStyles } from '@/components/ui/Button';
import { FormularioSolicitud } from '@/components/FormularioSolicitud/FormularioSolicitud';

export const metadata: Metadata = {
  title: 'Solicitar Ingreso | FVV29',
  description: 'Formulario para solicitar ingreso a la R:.L:.S:. Fernando Valenzuela Vera No. 29.',
  openGraph: {
    title: 'Solicitar Ingreso | FVV29',
  },
};

const REQUISITOS = [
  'Ser un hombre libre de buenas costumbres',
  'Ser mayor de 18 años',
  'Tener interés genuino en la masonería',
  'Residir en el Cárdenas, Tabasco o sus alrededores',
  'Estar dispuesto a cumplir con nuestros principios y rituales',
];

export default function IngresaPage() {
  return (
    <>
      <Hero title="Solicita tu Ingreso" subtitle="Comienza tu viaje masónico con nosotros" />

      <section className="container mx-auto px-4 py-20 md:py-24">
        <div className="max-w-3xl">
          <div>
            <h2 className="rule-accent font-serif">Requisitos para Ingresar</h2>
            <ul className="mt-10 divide-y divide-line-subtle border-y border-line-subtle">
              {REQUISITOS.map((req, idx) => (
                <li key={req} className="flex gap-5 py-4">
                  <span className="font-serif text-sm tabular-nums text-gold-700">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-content-secondary">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-16">
            <h2 className="rule-accent font-serif">Solicitud de Ingreso</h2>
            <p className="measure mt-7 leading-relaxed text-content-secondary">
              Completa el siguiente formulario con tus datos personales. Un representante nuestro se pondrá en contacto
              contigo para programar una entrevista personal. Todos tus datos serán tratados con total confidencialidad.
            </p>

            <div className="mt-10">
              <FormularioSolicitud />
            </div>
          </div>

          <Card className="mt-16 flex flex-col items-start gap-5 bg-surface-sunken sm:flex-row sm:items-center sm:justify-between">
            <p className="text-content-secondary">
              <strong className="font-medium text-navy-800">¿Preguntas?</strong> Si tienes dudas sobre el proceso, no dudes en contactarnos.
            </p>
            <Link href="/contacto" className={buttonStyles({ variant: 'outline', size: 'sm', className: 'shrink-0' })}>
              Contactar
            </Link>
          </Card>
        </div>
      </section>
    </>
  );
}
