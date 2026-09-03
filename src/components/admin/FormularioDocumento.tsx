'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { createAdminClient } from '@/lib/supabase/admin';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Checkbox } from '@/components/ui/Checkbox';
import { Card } from '@/components/ui/Card';
import { STORAGE_BUCKET_PDFS } from '@/lib/constants';

interface FormularioDocumentoProps {
  documentoId?: string;
  modo?: 'crear' | 'editar';
}

export const FormularioDocumento: React.FC<FormularioDocumentoProps> = ({
  documentoId,
  modo = 'crear',
}) => {
  const router = useRouter();
  const supabase = createClient();

  const [titulo, setTitulo] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [numeroEdicion, setNumeroEdicion] = useState('');
  const [fechaPublicacion, setFechaPublicacion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [visible, setVisible] = useState(false);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [archivoExistente, setArchivoExistente] = useState<string | null>(null);

  // Cargar categorías
  useEffect(() => {
    const fetchCategorias = async () => {
      const { data } = await supabase.from('categorias').select('*').order('nombre');
      setCategorias(data || []);
    };
    fetchCategorias();
  }, [supabase]);

  // Si es editar, cargar documento existente
  useEffect(() => {
    if (documentoId && modo === 'editar') {
      const fetchDocumento = async () => {
        const { data } = await supabase
          .from('documentos')
          .select('*')
          .eq('id', documentoId)
          .single();

        if (data) {
          setTitulo(data.titulo);
          setCategoriaId(data.categoria_id);
          setNumeroEdicion(data.numero_edicion?.toString() || '');
          setFechaPublicacion(data.fecha_publicacion);
          setDescripcion(data.descripcion || '');
          setVisible(data.visible);
          setArchivoExistente(data.archivo_path);
        }
      };
      fetchDocumento();
    }
  }, [documentoId, modo, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let archivoPath = archivoExistente;

      // Si hay archivo nuevo, subirlo
      if (archivo) {
        // Generar nombre único
        const timestamp = Date.now();
        const nombreArchivo = `${timestamp}-${archivo.name}`;
        archivoPath = `${STORAGE_BUCKET_PDFS}/${nombreArchivo}`;

        // Subir a Storage (necesita service_role para este ejemplo)
        // En producción, usarías una API route que maneja esto server-side
        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET_PDFS)
          .upload(nombreArchivo, archivo);

        if (uploadError) throw new Error(`Error al subir archivo: ${uploadError.message}`);
      }

      if (!archivoPath) {
        throw new Error('Se requiere un archivo PDF');
      }

      const datosDocumento = {
        titulo,
        categoria_id: categoriaId || null,
        numero_edicion: numeroEdicion ? parseInt(numeroEdicion) : null,
        fecha_publicacion: fechaPublicacion,
        descripcion: descripcion || null,
        visible,
        archivo_path: archivoPath,
        actualizado_en: new Date().toISOString(),
      };

      if (modo === 'crear') {
        // Insertar nuevo documento
        const { error: insertError } = await supabase
          .from('documentos')
          .insert([datosDocumento]);

        if (insertError) throw insertError;
      } else if (documentoId) {
        // Actualizar documento existente
        const { error: updateError } = await supabase
          .from('documentos')
          .update(datosDocumento)
          .eq('id', documentoId);

        if (updateError) throw updateError;
      }

      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="bordered">
      <h2 className="text-2xl font-bold text-institucional-primario mb-6">
        {modo === 'crear' ? 'Subir Documento' : 'Editar Documento'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Título */}
        <Input
          label="Título del Documento *"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ej: 9a. Edición Noviembre/Diciembre 2025"
          required
          disabled={loading}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Categoría */}
          <div>
            <label className="block text-sm font-semibold text-institucional-primario mb-2">
              Categoría
            </label>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className="w-full px-4 py-2 border-2 border-institucional-borde rounded focus:outline-none focus:border-institucional-primario"
              disabled={loading}
            >
              <option value="">-- Seleccionar categoría --</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Número de Edición */}
          <Input
            label="Número de Edición"
            type="number"
            value={numeroEdicion}
            onChange={(e) => setNumeroEdicion(e.target.value)}
            placeholder="Ej: 9"
            disabled={loading}
          />
        </div>

        {/* Fecha de Publicación */}
        <Input
          label="Fecha de Publicación *"
          type="date"
          value={fechaPublicacion}
          onChange={(e) => setFechaPublicacion(e.target.value)}
          required
          disabled={loading}
        />

        {/* Descripción */}
        <Textarea
          label="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción opcional del documento"
          rows={4}
          disabled={loading}
        />

        {/* Archivo PDF */}
        <div>
          <label className="block text-sm font-semibold text-institucional-primario mb-2">
            Archivo PDF {modo === 'crear' ? '*' : '(opcional para actualizar)'}
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setArchivo(e.target.files?.[0] || null)}
            className="w-full px-4 py-2 border-2 border-institucional-borde rounded focus:outline-none focus:border-institucional-primario"
            disabled={loading}
            required={modo === 'crear'}
          />
          {archivoExistente && (
            <p className="text-sm text-gray-600 mt-2">📄 Archivo actual: {archivoExistente}</p>
          )}
        </div>

        {/* Visible */}
        <Checkbox
          label="Publicar (visible en sitio público)"
          checked={visible}
          onChange={(e) => setVisible(e.target.checked)}
          disabled={loading}
        />

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-4 pt-6 border-t border-institucional-borde">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Guardando...' : modo === 'crear' ? 'Subir Documento' : 'Guardar Cambios'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
};
