import { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { Card } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'Aviso de Privacidad | MRGLVM',
  description: 'Aviso de privacidad y protección de datos de la Muy Respetable Gran Logia Valle de México.',
  openGraph: {
    title: 'Aviso de Privacidad | MRGLVM',
  },
};

export default function PrivacidadPage() {
  return (
    <>
      <Hero
        title="Aviso de Privacidad"
        subtitle="Conoce cómo protegemos tu información personal"
      />

      <section className="py-16 container mx-auto px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          <Card variant="bordered">
            <h3 className="font-serif text-2xl font-bold text-institucional-primario mb-4">
              1. Responsable del Tratamiento
            </h3>
            <p className="text-gray-700">
              La Muy Respetable Gran Logia Valle de México (MRGLVM) es responsable del tratamiento de tus datos
              personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares
              (LFPDPPP).
            </p>
          </Card>

          <Card variant="bordered">
            <h3 className="font-serif text-2xl font-bold text-institucional-primario mb-4">
              2. Datos que Recopilamos
            </h3>
            <p className="text-gray-700 mb-4">Recopilamos los siguientes datos personales:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Nombre completo</li>
              <li>Fecha de nacimiento</li>
              <li>Correo electrónico</li>
              <li>Teléfono</li>
              <li>Domicilio</li>
              <li>Profesión u ocupación</li>
              <li>Información sobre interés en la masonería</li>
            </ul>
          </Card>

          <Card variant="bordered">
            <h3 className="font-serif text-2xl font-bold text-institucional-primario mb-4">
              3. Finalidad del Tratamiento
            </h3>
            <p className="text-gray-700">
              Utilizamos tus datos para procesar solicitudes de ingreso, mantener comunicación, y gestionar tu
              participación en nuestras actividades e iniciativas. Los datos se tratarán de conformidad con la ley.
            </p>
          </Card>

          <Card variant="bordered">
            <h3 className="font-serif text-2xl font-bold text-institucional-primario mb-4">
              4. Seguridad de la Información
            </h3>
            <p className="text-gray-700">
              Implementamos medidas técnicas y administrativas para proteger tus datos contra daño, pérdida, alteración,
              acceso no autorizado o cualquier otra forma de tratamiento ilícito.
            </p>
          </Card>

          <Card variant="bordered">
            <h3 className="font-serif text-2xl font-bold text-institucional-primario mb-4">
              5. Derechos del Titular
            </h3>
            <p className="text-gray-700 mb-4">Conforme a la LFPDPPP, tienes derecho a:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Conocer qué datos tenemos sobre ti (Derecho de Acceso)</li>
              <li>Corregir datos inexactos (Derecho de Rectificación)</li>
              <li>Solicitar la eliminación de datos (Derecho de Cancelación)</li>
              <li>Oponerme al tratamiento de mis datos (Derecho de Oposición)</li>
            </ul>
          </Card>

          <Card variant="bordered">
            <h3 className="font-serif text-2xl font-bold text-institucional-primario mb-4">
              6. Ejercicio de Derechos
            </h3>
            <p className="text-gray-700">
              Para ejercer cualquiera de los derechos mencionados, contacta a nuestro Oficial de Privacidad escribiendo
              a contacto@mrglvm.com.mx, indicando claramente tu solicitud y proporcionando prueba de identidad.
            </p>
          </Card>

          <Card variant="bordered">
            <h3 className="font-serif text-2xl font-bold text-institucional-primario mb-4">
              7. Cambios a esta Política
            </h3>
            <p className="text-gray-700">
              Nos reservamos el derecho de actualizar este aviso de privacidad. Cualquier cambio será publicado en esta
              página con una nueva fecha de vigencia.
            </p>
          </Card>

          <Card variant="bordered">
            <h3 className="font-serif text-2xl font-bold text-institucional-primario mb-4">
              8. Contacto
            </h3>
            <p className="text-gray-700">
              Si tienes preguntas sobre esta política de privacidad, contacta a: contacto@mrglvm.com.mx
            </p>
          </Card>
        </div>

        <div className="mt-12 p-6 bg-institucional-fondo rounded-lg text-center">
          <p className="text-sm text-gray-600">
            Última actualización: {new Date().toLocaleDateString('es-MX')}
          </p>
        </div>
      </section>
    </>
  );
}
