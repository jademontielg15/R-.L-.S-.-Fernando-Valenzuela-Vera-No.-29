'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { solicitudIngresoSchema, type SolicitudIngresoInput } from '@/lib/validaciones/solicitud.schema';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Card } from '@/components/ui/Card';

const ESTADOS_MEXICO = [
  'Aguascalientes',
  'Baja California',
  'Baja California Sur',
  'Campeche',
  'Chiapas',
  'Chihuahua',
  'Ciudad de México',
  'Coahuila',
  'Colima',
  'Durango',
  'Estado de México',
  'Guanajuato',
  'Guerrero',
  'Hidalgo',
  'Jalisco',
  'Michoacán',
  'Morelos',
  'Nayarit',
  'Nuevo León',
  'Oaxaca',
  'Puebla',
  'Querétaro',
  'Quintana Roo',
  'San Luis Potosí',
  'Sinaloa',
  'Sonora',
  'Tabasco',
  'Tamaulipas',
  'Tlaxcala',
  'Veracruz',
  'Yucatán',
  'Zacatecas',
];

/**
 * Bloque de sección del formulario. Antes cada sección era una caja de fondo
 * crema apilada sobre otra caja de fondo crema: cuatro contenedores anidados
 * del mismo color, sin jerarquía. Ahora es un `fieldset` con regla superior.
 */
function Bloque({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-t border-line-subtle pt-7">
      <legend className="text-eyebrow uppercase text-gold-700">{titulo}</legend>
      <div className="mt-6 space-y-5">{children}</div>
    </fieldset>
  );
}

export const FormularioSolicitud = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SolicitudIngresoInput>({
    resolver: zodResolver(solicitudIngresoSchema),
    mode: 'onChange',
  });

  const onSubmit = async (datos: SolicitudIngresoInput) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/solicitudes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al enviar la solicitud');
      }

      setSubmitSuccess(true);
      reset();

      // Auto-scroll a mensaje de éxito
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <Card variant="elevated" className="animate-fade-up border-success/25">
        <div className="flex gap-4">
          <span
            aria-hidden="true"
            className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success/10 text-success"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 8.5 3.5 3.5L13 5" />
            </svg>
          </span>
          <div>
            <h3 className="font-serif text-xl text-navy-800">¡Gracias por tu solicitud!</h3>
            <p className="mt-3 leading-relaxed text-content-secondary">
              Hemos recibido tu solicitud de ingreso. Un miembro del Alto Cuerpo se pondrá en contacto contigo
              en los próximos días para continuar con el proceso.
            </p>
            <p className="mt-3 text-sm text-content-muted">
              Si tienes preguntas, puedes escribirnos a contacto@mrglvm.com.mx
            </p>
            <Button variant="link" className="mt-5 px-0" onClick={() => setSubmitSuccess(false)}>
              Volver
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Error General */}
      {submitError && (
        <div
          role="alert"
          className="rounded border border-danger/30 bg-danger-soft p-4 text-sm text-danger"
        >
          {submitError}
        </div>
      )}

      <Bloque titulo="Datos Personales">
        <Input
          label="Nombre Completo *"
          placeholder="Juan Pérez García"
          {...register('nombre_completo')}
          error={errors.nombre_completo?.message}
          disabled={isSubmitting}
        />

        <Input
          label="Fecha de Nacimiento *"
          type="date"
          {...register('fecha_nacimiento')}
          error={errors.fecha_nacimiento?.message}
          disabled={isSubmitting}
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input
            label="Profesión/Ocupación *"
            placeholder="Ej: Ingeniero, Abogado, etc."
            {...register('profesion')}
            error={errors.profesion?.message}
            disabled={isSubmitting}
          />

          <Select
            label="Estado de Residencia *"
            {...register('estado_residencia')}
            error={errors.estado_residencia?.message}
            disabled={isSubmitting}
          >
            <option value="">-- Seleccionar estado --</option>
            {ESTADOS_MEXICO.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </Select>
        </div>
      </Bloque>

      <Bloque titulo="Tu Interés en la Masonería">
        <Textarea
          label="¿Por qué te interesa ingresar a la masonería? *"
          placeholder="Cuéntanos sobre tus motivaciones..."
          rows={5}
          {...register('interes_ingreso')}
          error={errors.interes_ingreso?.message}
          disabled={isSubmitting}
        />

        <Textarea
          label="¿Qué sabes de la masonería? *"
          placeholder="Comparte lo que conoces sobre nuestra institución..."
          rows={5}
          {...register('conocimiento_institucion')}
          error={errors.conocimiento_institucion?.message}
          disabled={isSubmitting}
        />
      </Bloque>

      <Bloque titulo="Información de Contacto">
        <Input
          label="Email *"
          type="email"
          placeholder="tu@email.com"
          {...register('email')}
          error={errors.email?.message}
          disabled={isSubmitting}
        />

        <Input
          label="Teléfono/WhatsApp *"
          placeholder="+52 555 123 4567"
          {...register('telefono')}
          error={errors.telefono?.message}
          disabled={isSubmitting}
        />
      </Bloque>

      <Bloque titulo="Disponibilidad">
        <p className="text-sm text-content-secondary">
          ¿Cuándo tienes disponibilidad para reuniones?
        </p>
        <Checkbox
          label="Lunes a Viernes"
          {...register('disponible_entre_semana')}
          disabled={isSubmitting}
        />
        <Checkbox label="Sábados" {...register('disponible_sabado')} disabled={isSubmitting} />
      </Bloque>

      {/*
        Antes este bloque iba en rojo (bg-red-50 / border-red-200), exactamente
        el mismo color que los mensajes de error de validación: parecía que algo
        había fallado antes de tocar nada. Son declaraciones obligatorias, no un
        error, así que llevan el acento dorado del sistema.
      */}
      <fieldset className="rounded-md border border-gold-300 bg-gold-50 p-6">
        <legend className="text-eyebrow uppercase text-gold-800">
          Declaraciones Obligatorias
        </legend>

        <div className="mt-6 space-y-4">
          <Checkbox
            label="Soy un hombre libre de buenas costumbres *"
            {...register('declara_hombre_libre')}
            error={errors.declara_hombre_libre?.message}
            disabled={isSubmitting}
          />

          <Checkbox
            label="Acepto el Aviso de Privacidad y Protección de Datos *"
            {...register('acepta_consentimiento_datos')}
            error={errors.acepta_consentimiento_datos?.message}
            disabled={isSubmitting}
          />

          <p className="text-sm text-content-muted">
            Por favor, revisa nuestro{' '}
            <a
              href="/aviso-de-privacidad"
              className="font-medium text-navy-800 underline underline-offset-4 transition-colors duration-hover ease-out hover:text-gold-700"
            >
              aviso de privacidad
            </a>{' '}
            antes de continuar.
          </p>
        </div>
      </fieldset>

      <div>
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
        </Button>
        <p className="mt-4 text-center text-sm text-content-muted">
          * Campos obligatorios. Todos tus datos serán tratados con confidencialidad.
        </p>
      </div>
    </form>
  );
};
