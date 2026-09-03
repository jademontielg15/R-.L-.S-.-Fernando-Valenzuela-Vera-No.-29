import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { solicitudIngresoSchema } from '@/lib/validaciones/solicitud.schema';

// Rate limiting simple (en producción, usar Redis)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function getRateLimitKey(request: NextRequest): string {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  return ip.split(',')[0].trim();
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const data = requestCounts.get(key);

  if (!data || now > data.resetTime) {
    // Reset si pasó 1 hora
    requestCounts.set(key, { count: 1, resetTime: now + 60 * 60 * 1000 });
    return true;
  }

  if (data.count >= 5) {
    // Máximo 5 solicitudes por hora por IP
    return false;
  }

  data.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitKey = getRateLimitKey(request);
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Intenta más tarde.' },
        { status: 429 }
      );
    }

    // Parsear JSON
    const body = await request.json();

    // Validar con Zod (server-side, nunca confiar solo en cliente)
    const datosValidados = solicitudIngresoSchema.parse(body);

    // Conectar a Supabase
    const supabase = await createClient();

    // Insertar en BD (usa anon key, RLS permite insert público)
    const { data, error } = await supabase
      .from('solicitudes_ingreso')
      .insert([
        {
          nombre_completo: datosValidados.nombre_completo,
          fecha_nacimiento: datosValidados.fecha_nacimiento,
          profesion: datosValidados.profesion,
          estado_residencia: datosValidados.estado_residencia,
          interes_ingreso: datosValidados.interes_ingreso,
          conocimiento_institucion: datosValidados.conocimiento_institucion,
          email: datosValidados.email,
          telefono: datosValidados.telefono,
          disponible_entre_semana: datosValidados.disponible_entre_semana,
          disponible_sabado: datosValidados.disponible_sabado,
          acepta_consentimiento_datos: datosValidados.acepta_consentimiento_datos,
          declara_hombre_libre: datosValidados.declara_hombre_libre,
        },
      ])
      .select();

    if (error) {
      console.error('Error al insertar solicitud:', error);
      return NextResponse.json(
        { error: 'Error al procesar tu solicitud. Por favor, intenta más tarde.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Solicitud recibida. Te contactaremos pronto.',
        id: data?.[0]?.id,
      },
      { status: 201 }
    );
  } catch (error) {
    // Error de validación Zod
    if (error instanceof Error && error.name === 'ZodError') {
      const zodError = error as any;
      const fieldErrors = zodError.errors.reduce((acc: any, err: any) => {
        const field = err.path[0];
        acc[field] = err.message;
        return acc;
      }, {});

      return NextResponse.json(
        { error: 'Errores de validación', fieldErrors },
        { status: 400 }
      );
    }

    console.error('Error en solicitudes route:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
