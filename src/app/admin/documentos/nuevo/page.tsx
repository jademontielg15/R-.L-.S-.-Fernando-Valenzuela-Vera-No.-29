import { FormularioDocumento } from '@/components/admin/FormularioDocumento';

export default function NuevoDocumentoPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-institucional-primario mb-2">Subir Documento</h1>
        <p className="text-gray-700">Carga un nuevo PDF a la revista institucional</p>
      </div>

      <FormularioDocumento modo="crear" />
    </div>
  );
}
