'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Ticket,
  Search,
  Filter,
  Users,
  Clock,
  AlertCircle,
  Check,
  X,
  ChevronRight,
  MoreHorizontal,
  Tag,
  Layers,
  ChevronDown,
  ArrowUpCircle,
  Send,
  CheckCircle,
  XCircle,
  UserCheck,
} from 'lucide-react';

import { mockTickets, ticketStats, alertStats } from '@/data/mocks/tickets';

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  OPEN: { label: 'Abierto', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  IN_PROGRESS: { label: 'En Proceso', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  WAITING: { label: 'En Espera', color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
  RESOLVED: { label: 'Resuelto', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
  CLOSED: { label: 'Cerrado', color: 'text-neutral-500', bg: 'bg-neutral-50 dark:bg-neutral-700' },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  LOW: { label: 'Baja', color: 'text-neutral-500' },
  NORMAL: { label: 'Normal', color: 'text-blue-500' },
  HIGH: { label: 'Alta', color: 'text-orange-500' },
  CRITICAL: { label: 'Crítica', color: 'text-red-600' },
};

const departmentFilter = [
  { id: 'all', label: 'Todos' },
  { id: 'atencion', label: 'Atención' },
  { id: 'soporte', label: 'Soporte' },
  { id: 'cobranzas', label: 'Cobranzas' },
  { id: 'urgencias', label: 'Urgencias' },
];

const statusFilter = [
  { id: 'all', label: 'Todos' },
  { id: 'OPEN', label: 'Abiertos' },
  { id: 'IN_PROGRESS', label: 'En Proceso' },
  { id: 'WAITING', label: 'Espera' },
  { id: 'RESOLVED', label: 'Resueltos' },
  { id: 'CLOSED', label: 'Cerrados' },
];

const priorityFilter = [
  { id: 'all', label: 'Todas' },
  { id: 'CRITICAL', label: 'Crítica' },
  { id: 'HIGH', label: 'Alta' },
  { id: 'NORMAL', label: 'Normal' },
  { id: 'LOW', label: 'Baja' },
];

export default function TicketsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  const [department, setDepartment] = useState('all');

  const filteredTickets = mockTickets.filter(ticket => {
    const matchesSearch = searchQuery === '' ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.ticketNumber.toString().includes(searchQuery);
    const matchesStatus = status === 'all' || ticket.status === status;
    const matchesPriority = priority === 'all' || ticket.priority === priority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {[
          { label: 'Total', value: ticketStats.total },
          { label: 'Abiertos', value: ticketStats.open, color: 'text-blue-600' },
          { label: 'En Proceso', value: ticketStats.inProgress, color: 'text-purple-600' },
          { label: 'Espera', value: ticketStats.waiting, color: 'text-yellow-600' },
          { label: 'SLA Incumplido', value: ticketStats.slaBreached, color: 'text-red-600' },
          { label: 'Resueltos', value: ticketStats.resolved, color: 'text-green-600' },
          { label: 'Cerrados', value: ticketStats.closed, color: 'text-neutral-500' },
        ].map(stat => (
          <div key={stat.label} className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4">
            <p className={`text-xs ${stat.color || 'text-neutral-500'}`}>{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color || 'text-neutral-900 dark:text-neutral-100'}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px] max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar tickets..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900"
              />
            </div>
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="text-sm border rounded-lg px-3 py-2">
            {statusFilter.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="text-sm border rounded-lg px-3 py-2">
            {priorityFilter.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <select value={department} onChange={(e) => setDepartment(e.target.value)} className="text-sm border rounded-lg px-3 py-2">
            {departmentFilter.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
          </select>
          <div className="ml-auto text-sm text-neutral-500">{filteredTickets.length} tickets</div>
        </div>
      </div>

      {/* Tickets Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Prioridad</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Ticket</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Cliente</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Asignado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">SLA</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Creado</th>
                <th className="w-16 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
              {filteredTickets.map(ticket => (
                <tr key={ticket.id} className={`hover:bg-neutral-50 dark:hover:bg-neutral-700/50 ${ticket.priority === 'CRITICAL' ? 'bg-red-50/50' : ''} ${ticket.priority === 'HIGH' ? 'bg-orange-50/50' : ''}`}>
                  <td className="px-4 py-3 text-sm text-neutral-500">#{ticket.ticketNumber}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusConfig[ticket.status]?.bg} ${statusConfig[ticket.status]?.color}`}>
                      {statusConfig[ticket.status]?.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${priorityConfig[ticket.priority]?.color}`}>
                      {ticket.priority === 'CRITICAL' && <ArrowUpCircle className="w-3 h-3" />}
                      {priorityConfig[ticket.priority]?.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 line-clamp-1">{ticket.subject}</p>
                    <p className="text-xs text-neutral-500 line-clamp-1">{ticket.description}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-600">{ticket.contact?.name || 'N/A'}</td>
                  <td className="px-4 py-3">
                    {ticket.assignedAgent ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-xs text-primary-600">
                          {ticket.assignedAgent.user.displayName.charAt(0)}
                        </div>
                        <span className="text-xs text-neutral-500">{ticket.assignedAgent.user.displayName.split(' ')[0]}</span>
                      </div>
                    ) : <span className="text-xs text-neutral-400">Sin asignar</span>}
                  </td>
                  <td className="px-4 py-3">
                    {ticket.slaBreached ? (
                      <span className="text-xs text-red-600 font-medium">Incumplido</span>
                    ) : (
                      <span className="text-xs text-green-600">OK</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-500">{formatTimeAgo(ticket.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/ticket/${ticket.id}`} className="p-2 hover:bg-neutral-100 rounded-lg">
                      <ChevronRight className="w-4 h-4 text-neutral-400" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTickets.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <Ticket className="w-10 h-10 text-neutral-300 mb-3" />
            <p className="text-neutral-500">No se encontraron tickets</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}