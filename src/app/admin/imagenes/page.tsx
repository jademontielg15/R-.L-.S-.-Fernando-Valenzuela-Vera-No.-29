'use client';

import Image from 'next/image';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { createClient } from '@/lib/supabase/client';
import { STORAGE_BUCKET_GALERIA } from '@/lib/constants';

type CategoriaGaleria = 'eventos' | 'fraternidad' | 'convivencias';

interface ImagenGaleria {
  id: string;
  archivo_path: string;
  titulo: string;
  alt: string;
  descripcion: string | null;
  categoria: CategoriaGaleria;
  visible: boolean;
}

const TIPOS_IMAGEN = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
} as const;
const MAX_FILE_SIZE = 8 * 1024 * 1024;

export default function ImagenesAdminPage() {
  const supabase = createClient();
  const [images, setImages] = useState<ImagenGaleria[]>([]);
  const [title, setTitle] = useState('');
  const [alt, setAlt] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoriaGaleria>('fraternidad');
  const [visible, setVisible] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loadImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: loadError } = await supabase
      .from('galeria_imagenes')
      .select('*')
      .order('creado_en', { ascending: false });

    if (loadError) {
      setError('No fue posible cargar las imágenes.');
    } else {
      setImages(data || []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void loadImages();
  }, [loadImages]);

  const uploadImage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setError(null);
    setMessage(null);

    if (!file) {
      setError('Selecciona una imagen.');
      return;
    }
    const extension = Object.prototype.hasOwnProperty.call(TIPOS_IMAGEN, file.type)
      ? TIPOS_IMAGEN[file.type as keyof typeof TIPOS_IMAGEN]
      : null;
    if (!extension) {
      setError('El formato debe ser JPG, PNG o WebP.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('La imagen no debe superar 8 MB.');
      return;
    }

    setSaving(true);
    const path = `${crypto.randomUUID()}.${extension}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET_GALERIA)
        .upload(path, file, { contentType: file.type, upsert: false });

      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase.from('galeria_imagenes').insert({
        archivo_path: path,
        titulo: title.trim(),
        alt: alt.trim(),
        descripcion: description.trim() || null,
        categoria: category,
        visible,
      });

      if (insertError) {
        const { error: cleanupError } = await supabase.storage
          .from(STORAGE_BUCKET_GALERIA)
          .remove([path]);
        if (cleanupError) {
          console.error('No se pudo limpiar una imagen sin registro:', cleanupError.message);
        }
        throw insertError;
      }

      setTitle('');
      setAlt('');
      setDescription('');
      setCategory('fraternidad');
      setVisible(false);
      setFile(null);
      form.reset();
      setMessage(visible ? 'La imagen se publicó en la galería.' : 'La imagen se guardó como borrador.');
      await loadImages();
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'No fue posible guardar la imagen.');
    } finally {
      setSaving(false);
    }
  };

  const toggleVisibility = async (image: ImagenGaleria) => {
    setError(null);
    const { error: updateError } = await supabase
      .from('galeria_imagenes')
      .update({ visible: !image.visible })
      .eq('id', image.id);

    if (updateError) {
      setError('No fue posible actualizar la visibilidad de la imagen.');
      return;
    }

    setImages((current) =>
      current.map((item) => (item.id === image.id ? { ...item, visible: !item.visible } : item))
    );
  };

  const deleteImage = async (image: ImagenGaleria) => {
    if (!confirm(`¿Eliminar la imagen "${image.titulo}"?`)) return;
    setError(null);

    const { error: deleteRowError } = await supabase
      .from('galeria_imagenes')
      .delete()
      .eq('id', image.id);

    if (deleteRowError) {
      setError('No fue posible eliminar la imagen.');
      return;
    }

    setImages((current) => current.filter((item) => item.id !== image.id));
    const { error: deleteFileError } = await supabase.storage
      .from(STORAGE_BUCKET_GALERIA)
      .remove([image.archivo_path]);

    if (deleteFileError) {
      setError('La imagen se retiró de la galería, pero no se pudo eliminar el archivo almacenado.');
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-3xl text-navy-800">Administrar galería</h1>
        <p className="mt-2 text-content-secondary">
          Sube imágenes para la memoria visual. Las imágenes nuevas quedan como borrador hasta que las publiques.
        </p>
      </div>

      <section className="max-w-2xl rounded-md border border-line-subtle bg-surface-raised p-6">
        <h2 className="font-serif text-xl text-navy-800">Agregar imagen</h2>
        <form onSubmit={uploadImage} className="mt-6 space-y-5">
          <Input
            label="Título *"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            disabled={saving}
          />
          <Input
            label="Texto alternativo *"
            value={alt}
            onChange={(event) => setAlt(event.target.value)}
            required
            disabled={saving}
          />
          <Textarea
            label="Descripción"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            disabled={saving}
          />
          <Select
            label="Categoría"
            value={category}
            onChange={(event) => setCategory(event.target.value as CategoriaGaleria)}
            disabled={saving}
          >
            <option value="eventos">Eventos</option>
            <option value="fraternidad">Fraternidad</option>
            <option value="convivencias">Convivencias</option>
          </Select>
          <div>
            <label htmlFor="imagen-galeria" className="mb-1.5 block text-sm font-medium text-navy-800">
              Archivo de imagen * (JPG, PNG o WebP; máximo 8 MB)
            </label>
            <input
              id="imagen-galeria"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
              className="w-full cursor-pointer rounded border border-line bg-surface-raised text-sm text-content-secondary file:mr-4 file:border-0 file:border-r file:border-line file:bg-surface-sunken file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-navy-800"
              required
              disabled={saving}
            />
          </div>
          <Checkbox
            label="Publicar en la galería"
            checked={visible}
            onChange={(event) => setVisible(event.target.checked)}
            disabled={saving}
          />

          {error && (
            <div role="alert" className="rounded border border-danger/30 bg-danger-soft p-4 text-sm text-danger">
              {error}
            </div>
          )}
          {message && (
            <div role="status" className="rounded border border-success/30 bg-success/10 p-4 text-sm text-success">
              {message}
            </div>
          )}

          <Button type="submit" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar imagen'}
          </Button>
        </form>
      </section>

      <section>
        <h2 className="font-serif text-xl text-navy-800">Imágenes cargadas</h2>
        {loading ? (
          <p className="mt-5 py-12 text-center text-sm text-content-secondary">Cargando imágenes...</p>
        ) : images.length === 0 ? (
          <p className="mt-5 rounded-md border border-line-subtle bg-surface-raised py-12 text-center text-sm text-content-secondary">
            No hay imágenes cargadas.
          </p>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {images.map((image) => {
              const { data } = supabase.storage
                .from(STORAGE_BUCKET_GALERIA)
                .getPublicUrl(image.archivo_path);

              return (
                <article key={image.id} className="overflow-hidden rounded-md border border-line-subtle bg-surface-raised">
                  <div className="relative aspect-[4/3]">
                    <Image src={data.publicUrl} alt={image.alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                  </div>
                  <div className="space-y-3 p-4">
                    <div>
                      <h3 className="font-medium text-navy-800">{image.titulo}</h3>
                      <p className="mt-1 text-sm text-content-muted">
                        {image.visible ? 'Publicada' : 'Borrador'} · {image.categoria}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={() => toggleVisibility(image)}>
                        {image.visible ? 'Retirar' : 'Publicar'}
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => deleteImage(image)}>
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
