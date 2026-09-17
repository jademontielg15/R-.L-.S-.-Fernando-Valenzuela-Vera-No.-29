import { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { ORG_ADDRESS, ORG_PHONE, ORG_EMAIL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Contacto | FVV29',
  description: 'Ponte en contacto con la R:.L:.S:. Fernando Valenzuela Vera No. 29.',
  openGraph: {
    title: 'Contacto | FVV29',
  },
};

const DATOS = [
  { etiqueta: 'Dirección', valor: ORG_ADDRESS },
  { etiqueta: 'Teléfono', valor: ORG_PHONE },
  { etiqueta: 'Email', valor: ORG_EMAIL },
];

const HORARIOS = [
  { dia: 'Lunes a Viernes', horario: '09:00 - 18:00' },
  { dia: 'Sábado', horario: '10:00 - 14:00' },
  { dia: 'Domingo', horario: 'Cerrado' },
];

export default function ContactoPage() {
  return (
    <>
      <Hero title="Contacto" subtitle="Nos encantaría saber de ti. Envíanos tu mensaje." />

      <section className="container mx-auto px-4 py-20 md:py-24">
        {/* Los tres datos de contacto pasan a ser una tira de definiciones con
            separadores hairline: son metadatos, no tres tarjetas de peso igual
            al formulario. */}
        <dl className="grid max-w-5xl grid-cols-1 divide-y divide-line-subtle overflow-hidden rounded-md border border-line-subtle bg-surface-raised sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {DATOS.map((item) => (
            <div key={item.etiqueta} className="p-6">
              <dt className="text-eyebrow uppercase text-gold-700">{item.etiqueta}</dt>
              <dd className="mt-3 text-content-secondary">{item.valor}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-14 max-w-2xl">
          <Card>
            <h2 className="font-serif text-2xl text-navy-800">Envíanos tu Mensaje</h2>
            <div className="mt-6 h-px w-12 bg-gold-700" />

            <form className="mt-8 space-y-5">
              <Input label="Nombre" name="nombre" placeholder="Tu nombre" required />
              <Input label="Email" name="email" type="email" placeholder="tu@email.com" required />
              <Input label="Asunto" name="asunto" placeholder="Asunto de tu mensaje" required />
              <Textarea label="Mensaje" name="mensaje" rows={6} placeholder="Tu mensaje..." required />
              <Button type="submit" className="w-full">
                Enviar Mensaje
              </Button>
            </form>
          </Card>
        </div>
      </section>

      <section className="border-t border-line-subtle bg-surface-sunken py-20 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="rule-accent font-serif">Horarios de Atención</h2>
          <div className="mt-12 max-w-2xl">
            <table className="w-full overflow-hidden rounded-md border border-line-subtle bg-surface-raised text-left">
              <tbody>
                {HORARIOS.map((item) => (
                  <tr key={item.dia} className="border-b border-line-subtle last:border-b-0">
                    <th scope="row" className="px-6 py-4 font-medium text-navy-800">
                      {item.dia}
                    </th>
                    <td className="px-6 py-4 text-right tabular-nums text-content-secondary">
                      {item.horario}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
