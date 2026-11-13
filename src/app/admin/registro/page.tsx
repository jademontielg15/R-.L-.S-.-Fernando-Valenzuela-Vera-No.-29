import type { Metadata } from 'next';
import RegistroCuentaAdministrativa from '@/components/admin/RegistroCuentaAdministrativa';

export const metadata: Metadata = {
  title: 'Registro administrativo | FVV29',
  robots: { index: false, follow: false },
};

export default function RegistroAdministrativoPage() {
  return <RegistroCuentaAdministrativa />;
}
