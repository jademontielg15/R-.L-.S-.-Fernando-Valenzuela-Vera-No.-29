'use client';

import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Button } from '@/components/ui/Button';

// Configurar worker de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface VisorPDFProps {
  documentoId: string;
  titulo: string;
}

/**
 * Un spinner rápido hace que la carga se perciba más corta aunque el tiempo real
 * sea idéntico. `data-keep-motion` lo exceptúa del corte global de movimiento:
 * es feedback funcional, no decoración.
 */
const Spinner = () => (
  <span
    data-keep-motion
    aria-hidden="true"
    className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-line border-t-navy-800 [animation-duration:600ms]"
  />
);

export const VisorPDF: React.FC<VisorPDFProps> = ({ documentoId, titulo }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener URL firmada
  useEffect(() => {
    const fetchSignedUrl = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/documentos/${documentoId}/signed-url`);

        if (!response.ok) {
          throw new Error('No se pudo cargar el documento');
        }

        const data = await response.json();
        setPdfUrl(data.url);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setPdfUrl(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSignedUrl();
  }, [documentoId]);

  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setCurrentPage(1);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(numPages, prev + 1));
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= numPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div
        role="status"
        className="flex h-96 w-full flex-col items-center justify-center gap-4 rounded-md border border-line-subtle bg-surface-sunken"
      >
        <Spinner />
        <p className="text-sm text-content-secondary">Cargando documento...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="w-full rounded-md border border-danger/30 bg-danger-soft p-6">
        <p className="font-medium text-danger">Error al cargar el documento</p>
        <p className="mt-2 text-sm text-danger/80">{error}</p>
      </div>
    );
  }

  if (!pdfUrl) {
    return (
      <div className="w-full rounded-md border border-dashed border-line p-6">
        <p className="text-content-secondary">No hay URL disponible para este documento</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h2 className="font-serif text-2xl text-navy-800">{titulo}</h2>

      {/* Lienzo del documento. Los grises neutros anteriores (gray-100/200/300)
          chocaban con el crema del sitio; ahora es el mismo neutro cálido. */}
      <div className="overflow-hidden rounded-md border border-line-subtle bg-surface-sunken">
        <div className="flex justify-center p-4 sm:p-6">
          <Document
            file={pdfUrl}
            onLoadSuccess={handleDocumentLoadSuccess}
            loading={<p className="py-12 text-sm text-content-secondary">Preparando documento...</p>}
            error={<p className="py-12 text-sm text-danger">Error al cargar PDF</p>}
          >
            <Page
              pageNumber={currentPage}
              width={600}
              className="shadow-lg [&_canvas]:!h-auto [&_canvas]:!max-w-full"
            />
          </Document>
        </div>
      </div>

      {/* Controles de Navegación */}
      <div className="rounded-md border border-line-subtle bg-surface-raised p-5">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={goToPreviousPage} disabled={currentPage === 1}>
              <span aria-hidden="true">&larr;</span>
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === numPages}
            >
              Siguiente
              <span aria-hidden="true">&rarr;</span>
            </Button>
          </div>

          <p aria-live="polite" className="text-sm tabular-nums text-content-secondary">
            Página <span className="font-medium text-navy-800">{currentPage}</span> de {numPages}
          </p>

          <div className="flex items-center gap-2">
            <label htmlFor="page-input" className="text-sm text-content-secondary">
              Ir a página:
            </label>
            <input
              id="page-input"
              type="number"
              min="1"
              max={numPages}
              value={currentPage}
              onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
              className="w-16 rounded border border-line bg-surface-raised px-2 py-1.5 text-center text-sm tabular-nums transition-[border-color,box-shadow] duration-hover ease-out focus:border-navy-800 focus:shadow-[inset_0_0_0_1px_rgb(var(--navy-800))] focus:outline-none"
            />
          </div>
        </div>

        <p className="mt-5 border-t border-line-subtle pt-4 text-sm leading-relaxed text-content-muted">
          <strong className="font-medium text-navy-800">Modo solo lectura:</strong> este documento no
          puede ser descargado directamente. Si necesitas una copia, contacta a la administración.
        </p>
      </div>
    </div>
  );
};
