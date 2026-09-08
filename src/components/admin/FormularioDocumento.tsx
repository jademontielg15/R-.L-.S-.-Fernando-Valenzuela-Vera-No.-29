'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { STORAGE_BUCKET_PDFS } from '@/lib/constants';

// Nota: aquí se importaba `createAdminClient` sin llegar a usarlo nunca. Este es
// un componente `'use client'`, así que arrastraba al bundle del navegador un
// módulo que su propio comentario declara «NEVER exposed to the browser».

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
    <div className="rounded-md border border-line-subtle bg-surface-raised p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Título del Documento *"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ej: 9a. Edición Noviembre/Diciembre 2025"
          required
          disabled={loading}
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Select
            label="Categoría"
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            disabled={loading}
          >
            <option value="">-- Seleccionar categoría --</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </Select>

          <Input
            label="Número de Edición"
            type="number"
            value={numeroEdicion}
            onChange={(e) => setNumeroEdicion(e.target.value)}
            placeholder="Ej: 9"
            disabled={loading}
          />
        </div>

        <Input
          label="Fecha de Publicación *"
          type="date"
          value={fechaPublicacion}
          onChange={(e) => setFechaPublicacion(e.target.value)}
          required
          disabled={loading}
        />

        <Textarea
          label="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción opcional del documento"
          rows={4}
          disabled={loading}
        />

        <div>
          <label
            htmlFor="archivo-pdf"
            className="mb-1.5 block text-sm font-medium text-navy-800"
          >
            Archivo PDF {modo === 'crear' ? '*' : '(opcional para actualizar)'}
          </label>
          {/* El input de archivo nativo no acepta los estilos del resto de
              campos: se estiliza su botón interno con file:* para que al menos
              comparta tipografía, alto y radio con el sistema. */}
          <input
            id="archivo-pdf"
            type="file"
            accept=".pdf"
            onChange={(e) => setArchivo(e.target.files?.[0] || null)}
            className="w-full cursor-pointer rounded border border-line bg-surface-raised text-sm text-content-secondary transition-colors duration-hover ease-out hover:border-line-strong/40 file:mr-4 file:cursor-pointer file:border-0 file:border-r file:border-line file:bg-surface-sunken file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-navy-800 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
            required={modo === 'crear'}
          />
          {archivoExistente && (
            <p className="mt-2 break-all text-sm text-content-muted">
              Archivo actual: {archivoExistente}
            </p>
          )}
        </div>

        <div className="border-t border-line-subtle pt-6">
          <Checkbox
            label="Publicar (visible en sitio público)"
            checked={visible}
            onChange={(e) => setVisible(e.target.checked)}
            disabled={loading}
          />
        </div>

        {error && (
          <div
            role="alert"
            className="rounded border border-danger/30 bg-danger-soft p-4 text-sm text-danger"
          >
            {error}
          </div>
        )}

        <div className="flex gap-3 border-t border-line-subtle pt-6">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Guardando...' : modo === 'crear' ? 'Subir Documento' : 'Guardar Cambios'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};
