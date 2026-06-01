'use client';

import { useParams, useRouter } from 'next/navigation';
import { mockTickets } from '@/data/mocks/tickets';
import { ArrowLeft, Ticket, User, Clock } from 'lucide-react';

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  OPEN: { label: 'Abierto', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  IN_PROGRESS: { label: 'En Proceso', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  WAITING: { label: 'En Espera', color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
  RESOLVED: { label: 'Resuelto', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
  CLOSED: { label: 'Cerrado', color: 'text-neutral-500', bg: 'bg-neutral-100 dark:bg-neutral-700' },
};

const priorityConfig: Record<string, { label: string; color: string; bg: string }> = {
  LOW: { label: 'Baja', color: 'text-neutral-600', bg: 'bg-neutral-100' },
  NORMAL: { label: 'Normal', color: 'text-blue-600', bg: 'bg-blue-50' },
  HIGH: { label: 'Alta', color: 'text-orange-600', bg: 'bg-orange-50' },
  CRITICAL: { label: 'Crítica', color: 'text-red-600', bg: 'bg-red-50' },
};

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticket = mockTickets.find((t) => t.id === params.id);

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Ticket className="w-12 h-12 text-neutral-300 mb-4" />
        <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">Ticket no encontrado</h2>
        <p className="text-neutral-500 mb-6">El ticket que buscás no existe o fue eliminado.</p>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
      </div>
    );
  }

  const status = statusConfig[ticket.status] ?? statusConfig.OPEN;
  const priority = priorityConfig[ticket.priority] ?? priorityConfig.NORMAL;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a Tickets
      </button>

      {/* Header */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-neutral-400 mb-1">#{ticket.ticketNumber}</p>
            <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{ticket.subject}</h1>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
              {status.label}
            </span>
            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${priority.bg} ${priority.color}`}>
              {priority.label}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Description + History */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Descripción</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {ticket.description || 'Sin descripción disponible.'}
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Historial</h3>
            <div className="space-y-3">
              {[
                { time: 'Hace 2 min', text: 'Ticket asignado al agente.', Icon: User },
                { time: 'Hace 10 min', text: 'Ticket creado desde conversación.', Icon: Ticket },
                { time: formatDate(ticket.createdAt), text: 'Contacto inició la solicitud.', Icon: Clock },
              ].map((event, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0">
                    <event.Icon className="w-3.5 h-3.5 text-neutral-500" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300">{event.text}</p>
                    <p className="text-xs text-neutral-400">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 space-y-5">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Información</h3>

            {ticket.contact && (
              <div>
                <p className="text-xs text-neutral-400 mb-1">Cliente</p>
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{ticket.contact.name}</p>
                {ticket.contact.email && <p className="text-xs text-neutral-500 mt-0.5">{ticket.contact.email}</p>}
                {ticket.contact.phone && <p className="text-xs text-neutral-500">{ticket.contact.phone}</p>}
              </div>
            )}

            {ticket.assignedAgent && (
              <div>
                <p className="text-xs text-neutral-400 mb-1">Agente asignado</p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-xs font-medium text-primary-600 dark:text-primary-300">
                    {ticket.assignedAgent.user.displayName.charAt(0)}
                  </div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {ticket.assignedAgent.user.displayName}
                  </p>
                </div>
              </div>
            )}

            <div>
              <p className="text-xs text-neutral-400 mb-1">SLA</p>
              <span className={`text-xs font-medium ${ticket.slaBreached ? 'text-red-600' : 'text-green-600'}`}>
                {ticket.slaBreached ? 'Incumplido' : 'En tiempo'}
              </span>
            </div>

            <div>
              <p className="text-xs text-neutral-400 mb-1">Creado</p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">{formatDate(ticket.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
