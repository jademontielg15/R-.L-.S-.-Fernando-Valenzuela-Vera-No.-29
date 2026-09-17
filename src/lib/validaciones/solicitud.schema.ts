import { z } from 'zod';

export const solicitudIngresoSchema = z.object({
  nombre_completo: z
    .string()
    .min(5, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),

  fecha_nacimiento: z
    .string()
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 18;
      }
      return age >= 18;
    }, 'Debes ser mayor de 18 años'),

  profesion: z
    .string()
    .min(2, 'La profesión es requerida')
    .max(50, 'La profesión no puede exceder 50 caracteres'),

  estado_residencia: z
    .string()
    .min(1, 'Debes seleccionar un estado'),

  interes_ingreso: z
    .string()
    .min(20, 'Por favor, explica con más detalle tu interés (mínimo 20 caracteres)')
    .max(1000, 'La respuesta no puede exceder 1000 caracteres'),

  conocimiento_institucion: z
    .string()
    .min(10, 'Por favor, cuéntanos qué sabes (mínimo 10 caracteres)')
    .max(1000, 'La respuesta no puede exceder 1000 caracteres'),

  email: z
    .string()
    .email('Ingresa un email válido')
    .max(100, 'El email no puede exceder 100 caracteres'),

  telefono: z
    .string()
    .regex(/^(\+52|0)?[1-9]\d{1,14}$/, 'Ingresa un número de teléfono válido (formato: +52 555 1234567)'),

  disponible_entre_semana: z.boolean().default(false),
  disponible_sabado: z.boolean().default(false),

  acepta_consentimiento_datos: z
    .boolean()
    .refine((value) => value === true, 'Debes aceptar el aviso de privacidad'),

  declara_hombre_libre: z
    .boolean()
    .refine((value) => value === true, 'Debes confirmar que eres un hombre libre de buenas costumbres'),
});

export type SolicitudIngresoInput = z.infer<typeof solicitudIngresoSchema>;
