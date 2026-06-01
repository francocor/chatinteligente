'use client';

import { useState } from 'react';
import { CreditCard, CheckCircle, Calendar, ArrowUpRight, FileText, X } from 'lucide-react';

export default function DashboardBillingPage() {
  const [currentPlan] = useState({
    name: 'Plan Profesional',
    price: '$99.900',
    period: 'mes',
    status: 'Activo',
    nextBilling: '2024-04-15',
    features: [
      'Hasta 5 agentes',
      '1000 conversaciones/mes',
      'Base de conocimiento ilimitada',
      'Reportes avanzados',
      'Soporte prioritario',
    ],
  });

  const [paymentMethod] = useState({
    type: 'Tarjeta de Crédito',
    last4: '4242',
    brand: 'Visa',
    expiry: '12/25',
  });

  const [billingHistory] = useState([
    { id: 'inv-001', date: '2024-03-15', amount: '$99.900', status: 'Pagado', pdf: true },
    { id: 'inv-002', date: '2024-02-15', amount: '$99.900', status: 'Pagado', pdf: true },
    { id: 'inv-003', date: '2024-01-15', amount: '$99.900', status: 'Pagado', pdf: true },
    { id: 'inv-004', date: '2023-12-15', amount: '$99.900', status: 'Pagado', pdf: true },
  ]);

  const [showPlanModal, setShowPlanModal] = useState(false);
  const [downloadedInvoice, setDownloadedInvoice] = useState<string | null>(null);

  const handleChangePlan = () => {
    setShowPlanModal(true);
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    setDownloadedInvoice(invoiceId);
    setTimeout(() => setDownloadedInvoice(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Facturación</h1>
          <p className="text-neutral-500 mt-1">Gestión de planes, pagos y facturación</p>
        </div>
        <button
          onClick={handleChangePlan}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
        >
          Cambiar Plan
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Plan */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Plan Actual</h3>
                <p className="text-neutral-500 text-sm">{currentPlan.name}</p>
              </div>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                {currentPlan.status}
              </span>
            </div>
            <div className="mb-6">
              <p className="text-4xl font-bold text-neutral-900 dark:text-neutral-100">
                {currentPlan.price}
                <span className="text-lg font-normal text-neutral-500">/{currentPlan.period}</span>
              </p>
            </div>
            <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Incluye:</p>
              <ul className="space-y-2">
                {currentPlan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Payment Method + Next Billing */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Método de Pago</h3>
            <div className="flex items-center gap-3 p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900">
              <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {paymentMethod.brand} terminada en {paymentMethod.last4}
                </p>
                <p className="text-xs text-neutral-500">Vence {paymentMethod.expiry}</p>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-sm">
              Actualizar Método de Pago
            </button>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Próximo Cobro</h3>
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-neutral-500" />
              <span className="text-neutral-600 dark:text-neutral-400">Fecha:</span>
              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                {new Date(currentPlan.nextBilling).toLocaleDateString('es-CL')}
              </span>
            </div>
            <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{currentPlan.price}</p>
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Historial de Facturación</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 dark:bg-neutral-900/50">
              <tr className="border-b border-neutral-200 dark:border-neutral-700">
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Factura</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Monto</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
              {billingHistory.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                  <td className="px-6 py-4 text-sm text-neutral-900 dark:text-neutral-100">{invoice.id}</td>
                  <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                    {new Date(invoice.date).toLocaleDateString('es-CL')}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {invoice.amount}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3" />
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {invoice.pdf && (
                      downloadedInvoice === invoice.id ? (
                        <span className="inline-flex items-center gap-1 text-sm text-green-600 font-medium">
                          <CheckCircle className="w-4 h-4" />
                          Descargada
                        </span>
                      ) : (
                        <button
                          onClick={() => handleDownloadInvoice(invoice.id)}
                          className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-500"
                        >
                          <FileText className="w-4 h-4" />
                          Descargar PDF
                        </button>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Plan Change Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Cambiar Plan</h3>
              <button
                onClick={() => setShowPlanModal(false)}
                className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-neutral-500" />
              </button>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
              En la versión productiva, acá se mostraría el selector de planes con comparación de características y procesamiento de pago.
            </p>
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mb-6">
              <span className="text-xs text-amber-700 font-medium">Plataforma en modo demo — cambio de plan simulado</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPlanModal(false)}
                className="flex-1 px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowPlanModal(false)}
                className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Confirmar cambio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
