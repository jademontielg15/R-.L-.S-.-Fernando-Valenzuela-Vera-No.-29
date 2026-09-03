import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { Card } from '@/components/ui/Card';

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
}) => {
  return (
    <Link href={`/revista/${id}`}>
      <Card variant="bordered" className="hover:shadow-lg transition h-full cursor-pointer">
        <div className="flex flex-col gap-4 h-full">
          {/* Header */}
          <div>
            <h3 className="font-semibold text-lg text-institucional-primario line-clamp-2 hover:text-institucional-secundario transition">
              {titulo}
            </h3>
            {categoria && (
              <p className="text-sm text-institucional-secundario font-semibold mt-2">
                {categoria}
              </p>
            )}
          </div>

          {/* Descripción */}
          {descripcion && (
            <p className="text-sm text-gray-600 line-clamp-3 flex-grow">{descripcion}</p>
          )}

          {/* Metadatos */}
          <div className="space-y-2 border-t border-institucional-borde pt-4">
            <div className="flex justify-between text-sm text-gray-700">
              <span>📅 {formatDate(fecha_publicacion)}</span>
              {paginas && <span>📄 {paginas} págs</span>}
            </div>
            {numero_edicion && (
              <p className="text-sm text-gray-600">Edición #{numero_edicion}</p>
            )}
          </div>

          {/* CTA */}
          <div className="pt-4 border-t border-institucional-borde">
            <span className="text-sm font-semibold text-institucional-primario hover:text-institucional-secundario transition">
              Ver documento →
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
};
