import type { Metadata } from 'next';
import GenerarCodigoRegistroAdmin from '@/components/admin/GenerarCodigoRegistroAdmin';

export const metadata: Metadata = {
  title: 'Códigos privados de acceso | FVV29',
  robots: { index: false, follow: false },
};

export default function CodigosAccesoPage() {
  return <GenerarCodigoRegistroAdmin />;
}
