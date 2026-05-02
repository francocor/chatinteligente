import Link from 'next/link';

export default function SettingsCompanyPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Empresa</h1>
      <p className="text-neutral-500 mt-2">
        Gestión de datos de la empresa desde la configuración.
      </p>
      <div className="mt-6">
        <Link href="/dashboard/settings" className="text-primary-600 hover:text-primary-500">
          ← Volver a Configuración
        </Link>
      </div>
    </div>
  );
}