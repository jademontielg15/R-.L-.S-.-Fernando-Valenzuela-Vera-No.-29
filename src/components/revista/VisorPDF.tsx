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
      <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-institucional-primario"></div>
          <p className="mt-4 text-gray-700">Cargando documento...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 bg-red-50 border border-red-200 rounded">
        <p className="text-red-700 font-semibold">Error al cargar el documento</p>
        <p className="text-red-600 text-sm mt-2">{error}</p>
      </div>
    );
  }

  if (!pdfUrl) {
    return (
      <div className="w-full p-6 bg-gray-50 border border-gray-200 rounded">
        <p className="text-gray-700">No hay URL disponible para este documento</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Título */}
      <h2 className="font-serif text-3xl font-bold text-institucional-primario">{titulo}</h2>

      {/* Visor PDF */}
      <div className="bg-gray-100 rounded-lg overflow-hidden shadow-lg border border-gray-300">
        <div className="flex justify-center p-4 bg-gray-200">
          <Document
            file={pdfUrl}
            onLoadSuccess={handleDocumentLoadSuccess}
            loading={<p className="text-gray-700">Preparando documento...</p>}
            error={<p className="text-red-600">Error al cargar PDF</p>}
          >
            <Page pageNumber={currentPage} width={600} />
          </Document>
        </div>
      </div>

      {/* Controles de Navegación */}
      <div className="bg-white p-6 rounded-lg border border-institucional-borde">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Botones anterior/siguiente */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              ← Anterior
            </Button>
            <Button
              variant="outline"
              onClick={goToNextPage}
              disabled={currentPage === numPages}
            >
              Siguiente →
            </Button>
          </div>

          {/* Indicador de página */}
          <div className="text-center">
            <p className="font-semibold text-institucional-primario">
              Página {currentPage} de {numPages}
            </p>
          </div>

          {/* Input para ir a página específica */}
          <div className="flex gap-2 items-center">
            <label htmlFor="page-input" className="text-sm font-semibold text-gray-700">
              Ir a página:
            </label>
            <input
              id="page-input"
              type="number"
              min="1"
              max={numPages}
              value={currentPage}
              onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
              className="w-16 px-2 py-1 border-2 border-institucional-borde rounded text-center"
            />
          </div>
        </div>

        {/* Nota sobre solo lectura */}
        <div className="mt-4 p-3 bg-institucional-fondo rounded text-sm text-gray-700 border border-institucional-borde">
          <p>
            <strong>ℹ️ Modo solo lectura:</strong> Este documento no puede ser descargado directamente. Si necesitas
            una copia, contacta a la administración.
          </p>
        </div>
      </div>
    </div>
  );
};
