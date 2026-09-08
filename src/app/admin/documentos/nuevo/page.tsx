import { FormularioDocumento } from '@/components/admin/FormularioDocumento';

export default function NuevoDocumentoPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-navy-800">Subir Documento</h1>
        <p className="mt-2 text-content-secondary">Carga un nuevo PDF a la revista institucional</p>
      </div>

      <FormularioDocumento modo="crear" />
    </div>
  );
}
