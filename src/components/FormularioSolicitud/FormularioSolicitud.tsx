'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { solicitudIngresoSchema, type SolicitudIngresoInput } from '@/lib/validaciones/solicitud.schema';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
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

export const FormularioSolicitud = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
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
      <Card variant="elevated" className="bg-green-50 border-2 border-green-200">
        <div className="text-center">
          <h3 className="font-serif text-2xl font-bold text-green-700 mb-2">¡Gracias por tu solicitud!</h3>
          <p className="text-green-700 mb-4">
            Hemos recibido tu solicitud de ingreso. Un miembro del Alto Cuerpo se pondrá en contacto contigo
            en los próximos días para continuar con el proceso.
          </p>
          <p className="text-sm text-green-600">
            Si tienes preguntas, puedes escribirnos a contacto@mrglvm.com.mx
          </p>
          <button
            onClick={() => setSubmitSuccess(false)}
            className="mt-6 text-green-700 font-semibold hover:underline"
          >
            ← Volver
          </button>
        </div>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Error General */}
      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
          {submitError}
        </div>
      )}

      {/* Sección 1: Datos Personales */}
      <div className="bg-institucional-fondo p-6 rounded-lg">
        <h3 className="font-serif text-xl font-bold text-institucional-primario mb-4">
          Datos Personales
        </h3>

        <div className="space-y-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Profesión/Ocupación *"
              placeholder="Ej: Ingeniero, Abogado, etc."
              {...register('profesion')}
              error={errors.profesion?.message}
              disabled={isSubmitting}
            />

            <div>
              <label className="block text-sm font-semibold text-institucional-primario mb-2">
                Estado de Residencia *
              </label>
              <select
                {...register('estado_residencia')}
                className="w-full px-4 py-2 border-2 border-institucional-borde rounded focus:outline-none focus:border-institucional-primario"
                disabled={isSubmitting}
              >
                <option value="">-- Seleccionar estado --</option>
                {ESTADOS_MEXICO.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
              {errors.estado_residencia && (
                <p className="text-red-500 text-sm mt-1">{errors.estado_residencia.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sección 2: Interés en la Masonería */}
      <div className="bg-institucional-fondo p-6 rounded-lg">
        <h3 className="font-serif text-xl font-bold text-institucional-primario mb-4">
          Tu Interés en la Masonería
        </h3>

        <div className="space-y-4">
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
        </div>
      </div>

      {/* Sección 3: Contacto */}
      <div className="bg-institucional-fondo p-6 rounded-lg">
        <h3 className="font-serif text-xl font-bold text-institucional-primario mb-4">
          Información de Contacto
        </h3>

        <div className="space-y-4">
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
        </div>
      </div>

      {/* Sección 4: Disponibilidad */}
      <div className="bg-institucional-fondo p-6 rounded-lg">
        <h3 className="font-serif text-xl font-bold text-institucional-primario mb-4">
          Disponibilidad
        </h3>

        <div className="space-y-3">
          <p className="text-sm text-gray-700 mb-3">¿Cuándo tienes disponibilidad para reuniones?</p>
          <Checkbox
            label="Lunes a Viernes"
            {...register('disponible_entre_semana')}
            disabled={isSubmitting}
          />
          <Checkbox
            label="Sábados"
            {...register('disponible_sabado')}
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Sección 5: Consentimientos */}
      <div className="bg-red-50 p-6 rounded-lg border border-red-200">
        <h3 className="font-serif text-xl font-bold text-red-700 mb-4">
          Declaraciones Obligatorias
        </h3>

        <div className="space-y-3">
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

          <p className="text-xs text-gray-600 mt-2">
            Por favor, revisa nuestro{' '}
            <a href="/aviso-de-privacidad" className="text-institucional-primario hover:underline">
              aviso de privacidad
            </a>{' '}
            antes de continuar.
          </p>
        </div>
      </div>

      {/* Botón Enviar */}
      <div className="flex gap-4">
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
        </Button>
      </div>

      <p className="text-xs text-gray-600 text-center">
        * Campos obligatorios. Todos tus datos serán tratados con confidencialidad.
      </p>
    </form>
  );
};
