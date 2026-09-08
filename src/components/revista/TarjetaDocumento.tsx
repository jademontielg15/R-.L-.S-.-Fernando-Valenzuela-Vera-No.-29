import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface TarjetaDocumentoProps {
  id: string;
  titulo: string;
  descripcion?: string;
  fecha_publicacion: string;
  numero_edicion?: number;
  paginas?: number;
  categoria?: string;
}

export const TarjetaDocumento: React.FC<TarjetaDocumentoProps> = ({
  id,
  titulo,
  descripcion,
  fecha_publicacion,
  numero_edicion,
  paginas,
  categoria,
}) => (
  // El enlace es ahora el propio contenedor con `group`: antes el hover del
  // título estaba declarado en el <h3>, así que solo se activaba al pasar por
  // encima del texto y no al pasar por la tarjeta.
  <Link
    href={`/revista/${id}`}
    className="group flex h-full flex-col rounded-md border border-line-subtle bg-surface-raised p-6 transition-[transform,border-color,box-shadow] duration-hover ease-out hover:-translate-y-0.5 hover:border-line hover:shadow-lg active:translate-y-0 active:scale-[0.995] active:duration-press"
  >
    {categoria && <p className="text-eyebrow uppercase text-gold-700">{categoria}</p>}

    <h3 className="mt-3 line-clamp-2 font-serif text-lg text-navy-800 transition-colors duration-hover ease-out group-hover:text-gold-700">
      {titulo}
    </h3>

    {descripcion && (
      <p className="mt-3 line-clamp-3 flex-grow text-sm leading-relaxed text-content-secondary">
        {descripcion}
      </p>
    )}

    <dl className="mt-6 space-y-1.5 border-t border-line-subtle pt-4 text-sm text-content-muted">
      <div className="flex justify-between gap-4">
        <dt className="sr-only">Fecha de publicación</dt>
        <dd>{formatDate(fecha_publicacion)}</dd>
        {paginas && (
          <>
            <dt className="sr-only">Páginas</dt>
            <dd className="tabular-nums">{paginas} págs</dd>
          </>
        )}
      </div>
      {numero_edicion && (
        <div>
          <dt className="sr-only">Edición</dt>
          <dd className="tabular-nums">Edición #{numero_edicion}</dd>
        </div>
      )}
    </dl>

    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-navy-800 transition-colors duration-hover ease-out group-hover:text-gold-700">
      Ver documento
      {/* La flecha avanza un par de píxeles en hover: confirma la dirección del
          gesto sin mover la tarjeta entera. */}
      <span
        aria-hidden="true"
        className="transition-transform duration-hover ease-out group-hover:translate-x-0.5"
      >
        &rarr;
      </span>
    </span>
  </Link>
);
