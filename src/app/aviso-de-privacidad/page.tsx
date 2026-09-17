import { Metadata } from 'next';
import { Hero } from '@/components/Hero';

export const metadata: Metadata = {
  title: 'Aviso de Privacidad | FVV29',
  description: 'Aviso de privacidad y protección de datos de la R:.L:.S:. Fernando Valenzuela Vera No. 29.',
  openGraph: {
    title: 'Aviso de Privacidad | FVV29',
  },
};

/**
 * Ocho tarjetas apiladas convertían un documento legal continuo en ocho cajas
 * de igual peso. Un aviso de privacidad se lee como documento: numeración,
 * reglas hairline y una medida de línea cómoda.
 */
function Seccion({
  numero,
  titulo,
  children,
}: {
  numero: number;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line-subtle pt-8">
      <div className="flex items-baseline gap-4">
        <span className="font-serif text-lg tabular-nums text-gold-700">
          {String(numero).padStart(2, '0')}
        </span>
        <h2 className="font-serif text-xl text-navy-800">{titulo}</h2>
      </div>
      <div className="mt-4 space-y-4 leading-relaxed text-content-secondary sm:pl-10">
        {children}
      </div>
    </section>
  );
}

const LISTA = 'list-disc space-y-2 pl-5 marker:text-gold-700';

export default function PrivacidadPage() {
  return (
    <>
      <Hero title="Aviso de Privacidad" subtitle="Conoce cómo protegemos tu información personal" />

      <article className="container mx-auto px-4 py-20 md:py-24">
        <div className="measure space-y-10">
          <Seccion numero={1} titulo="Responsable del Tratamiento">
            <p>
              La R:.L:.S:. Fernando Valenzuela Vera No. 29 (FVV29) es responsable del tratamiento de tus datos
              personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares
              (LFPDPPP).
            </p>
          </Seccion>

          <Seccion numero={2} titulo="Datos que Recopilamos">
            <p>Recopilamos los siguientes datos personales:</p>
            <ul className={LISTA}>
              <li>Nombre completo</li>
              <li>Fecha de nacimiento</li>
              <li>Correo electrónico</li>
              <li>Teléfono</li>
              <li>Domicilio</li>
              <li>Profesión u ocupación</li>
              <li>Información sobre interés en la masonería</li>
            </ul>
          </Seccion>

          <Seccion numero={3} titulo="Finalidad del Tratamiento">
            <p>
              Utilizamos tus datos para procesar solicitudes de ingreso, mantener comunicación, y gestionar tu
              participación en nuestras actividades e iniciativas. Los datos se tratarán de conformidad con la ley.
            </p>
          </Seccion>

          <Seccion numero={4} titulo="Seguridad de la Información">
            <p>
              Implementamos medidas técnicas y administrativas para proteger tus datos contra daño, pérdida, alteración,
              acceso no autorizado o cualquier otra forma de tratamiento ilícito.
            </p>
          </Seccion>

          <Seccion numero={5} titulo="Derechos del Titular">
            <p>Conforme a la LFPDPPP, tienes derecho a:</p>
            <ul className={LISTA}>
              <li>Conocer qué datos tenemos sobre ti (Derecho de Acceso)</li>
              <li>Corregir datos inexactos (Derecho de Rectificación)</li>
              <li>Solicitar la eliminación de datos (Derecho de Cancelación)</li>
              <li>Oponerme al tratamiento de mis datos (Derecho de Oposición)</li>
            </ul>
          </Seccion>

          <Seccion numero={6} titulo="Ejercicio de Derechos">
            <p>
              Para ejercer cualquiera de los derechos mencionados, contacta a nuestro Oficial de Privacidad escribiendo
              a contacto@mrglvm.com.mx, indicando claramente tu solicitud y proporcionando prueba de identidad.
            </p>
          </Seccion>

          <Seccion numero={7} titulo="Cambios a esta Política">
            <p>
              Nos reservamos el derecho de actualizar este aviso de privacidad. Cualquier cambio será publicado en esta
              página con una nueva fecha de vigencia.
            </p>
          </Seccion>

          <Seccion numero={8} titulo="Contacto">
            <p>
              Si tienes preguntas sobre esta política de privacidad, contacta a: contacto@mrglvm.com.mx
            </p>
          </Seccion>

          <p className="border-t border-line-subtle pt-8 text-sm text-content-muted">
            Última actualización: {new Date().toLocaleDateString('es-MX')}
          </p>
        </div>
      </article>
    </>
  );
}
