import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PDF_SIGNED_URL_EXPIRY_SECONDS, STORAGE_BUCKET_PDFS } from '@/lib/constants';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // 1. Obtener el documento de la BD
    const { data: documento, error: docError } = await supabase
      .from('documentos')
      .select('id, titulo, archivo_path, visible, paginas')
      .eq('id', id)
      .single();

    if (docError || !documento) {
      return NextResponse.json(
        { error: 'Documento no encontrado' },
        { status: 404 }
      );
    }

    // 2. Verificar que esté visible (o que el usuario sea admin)
    // Por ahora, solo permitimos acceso a documentos visibles
    // Si quieres que los admins vean borradores, necesitarías verificar sesión aquí
    if (!documento.visible) {
      return NextResponse.json(
        { error: 'Documento no disponible' },
        { status: 403 }
      );
    }

    // 3. Generar signed URL de corta duración
    const { data: signedUrl, error: urlError } = await supabase.storage
      .from(STORAGE_BUCKET_PDFS)
      .createSignedUrl(documento.archivo_path, PDF_SIGNED_URL_EXPIRY_SECONDS);

    if (urlError || !signedUrl) {
      console.error('Error generando signed URL:', urlError);
      return NextResponse.json(
        { error: 'Error al generar enlace' },
        { status: 500 }
      );
    }

    // 4. Responder con URL firmada y metadatos
    return NextResponse.json({
      url: signedUrl.signedUrl,
      expiresAt: new Date(Date.now() + PDF_SIGNED_URL_EXPIRY_SECONDS * 1000),
      documento: {
        id: documento.id,
        titulo: documento.titulo,
        paginas: documento.paginas,
      },
    });
  } catch (error) {
    console.error('Error en signed-url route:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
