import { FormularioDocumento } from '@/components/admin/FormularioDocumento';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarDocumentoPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-institucional-primario mb-2">Editar Documento</h1>
        <p className="text-gray-700">Modifica los datos del documento</p>
      </div>

      <FormularioDocumento documentoId={id} modo="editar" />
    </div>
  );
}
