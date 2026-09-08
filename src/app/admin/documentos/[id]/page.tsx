import { FormularioDocumento } from '@/components/admin/FormularioDocumento';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarDocumentoPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-navy-800">Editar Documento</h1>
        <p className="mt-2 text-content-secondary">Modifica los datos del documento</p>
      </div>

      <FormularioDocumento documentoId={id} modo="editar" />
    </div>
  );
}
