'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Inbox,
  Search,
  Filter,
  Users,
  Clock,
  AlertCircle,
  Check,
  X,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  MessageSquare,
  Phone,
  Mail,
  Globe,
  Tag,
  Layers,
  ChevronDown,
  Zap,
  UserCheck,
  Send,
  RefreshCw,
} from 'lucide-react';
import { mockConversations, conversationStats, mockMessages } from '@/data/mocks/conversations';

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  ACTIVE: { label: 'Activa', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', icon: Zap },
  WAITING: { label: 'En espera', color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20', icon: Clock },
  IN_PROGRESS: { label: 'En proceso', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20', icon: RefreshCw },
  RESOLVED: { label: 'Resuelta', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', icon: Check },
  CLOSED: { label: 'Cerrada', color: 'text-neutral-500', bg: 'bg-neutral-50 dark:bg-neutral-700', icon: X },
  ESCALATED: { label: 'Escalada', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20', icon: ArrowUp },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  LOW: { label: 'Baja', color: 'text-neutral-500' },
  NORMAL: { label: 'Normal', color: 'text-blue-500' },
  HIGH: { label: 'Alta', color: 'text-orange-500' },
  CRITICAL: { label: 'Crítica', color: 'text-red-600' },
};

const channelIcons: Record<string, any> = {
  WHATSAPP: Phone,
  WEB: Globe,
  INSTAGRAM: Layers,
  FACEBOOK: Layers,
  TELEGRAM: Send,
  EMAIL: Mail,
};

const departments = [
  { id: 'all', label: 'Todos los departamentos' },
  { id: 'atencion', label: 'Atención al Cliente' },
  { id: 'turnos', label: 'Turnos' },
  { id: 'laboratorio', label: 'Laboratorio' },
  { id: 'urgencias', label: 'Urgencias' },
  { id: 'cobranzas', label: 'Cobranzas' },
];

const statuses = [
  { id: 'all', label: 'Todos los estados' },
  { id: 'ACTIVE', label: 'Activas' },
  { id: 'WAITING', label: 'En espera' },
  { id: 'IN_PROGRESS', label: 'En proceso' },
  { id: 'RESOLVED', label: 'Resueltas' },
  { id: 'CLOSED', label: 'Cerradas' },
];

const priorities = [
  { id: 'all', label: 'Todas las prioridades' },
  { id: 'CRITICAL', label: 'Crítica' },
  { id: 'HIGH', label: 'Alta' },
  { id: 'NORMAL', label: 'Normal' },
  { id: 'LOW', label: 'Baja' },
];

export default function ConversationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  const [department, setDepartment] = useState('all');
  const [selectedConversations, setSelectedConversations] = useState<string[]>([]);

  const filteredConversations = mockConversations.filter((conv) => {
    const matchesSearch = searchQuery === '' ||
      conv.contact?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.firstMessage?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.conversationNumber.toString().includes(searchQuery);
    
    const matchesStatus = status === 'all' || conv.status === status;
    const matchesPriority = priority === 'all' || conv.priority === priority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleSelectAll = () => {
    if (selectedConversations.length === filteredConversations.length) {
      setSelectedConversations([]);
    } else {
      setSelectedConversations(filteredConversations.map(c => c.id));
    }
  };

  const handleSelectConversation = (id: string) => {
    setSelectedConversations(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {[
          { label: 'Total', value: conversationStats.total, color: 'text-neutral-900' },
          { label: 'Activas', value: conversationStats.active, color: 'text-blue-600', icon: Zap },
          { label: 'Esperando', value: conversationStats.waiting, color: 'text-yellow-600', icon: Clock },
          { label: 'En Proceso', value: conversationStats.inProgress, color: 'text-purple-600', icon: RefreshCw },
          { label: 'Escaladas', value: conversationStats.escalated, color: 'text-red-600', icon: ArrowUp },
          { label: 'Resueltas', value: conversationStats.resolved, color: 'text-green-600', icon: Check },
          { label: 'Cerradas', value: conversationStats.closed, color: 'text-neutral-500', icon: X },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4"
          >
            <div className="flex items-center gap-2 mb-1">
              {stat.icon && (
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              )}
              <span className="text-xs text-neutral-500 dark:text-neutral-400">{stat.label}</span>
            </div>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px] max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por contacto, mensaje o número..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-neutral-400" />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-1.5 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300"
            >
              {statuses.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-neutral-400" />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-1.5 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300"
            >
              {priorities.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-neutral-400" />
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-1.5 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300"
            >
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.label}</option>
              ))}
            </select>
          </div>

          {/* Results count */}
          <div className="ml-auto text-sm text-neutral-500">
            {filteredConversations.length} conversaciones
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedConversations.length === filteredConversations.length && filteredConversations.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Prioridad
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Conversation
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Canal
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Asignado
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Actualizado
                </th>
                <th className="w-16 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
              {filteredConversations.map((conv) => {
                const StatusIcon = statusConfig[conv.status]?.icon || Inbox;
                const ChannelIcon = channelIcons[conv.channel] || MessageSquare;

                return (
                  <tr
                    key={conv.id}
                    className={`hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors cursor-pointer ${
                      conv.priority === 'CRITICAL' ? 'bg-red-50/50 dark:bg-red-900/10' : ''
                    } ${conv.priority === 'HIGH' ? 'bg-orange-50/50 dark:bg-orange-900/10' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedConversations.includes(conv.id)}
                        onChange={() => handleSelectConversation(conv.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[conv.status]?.bg || ''} ${statusConfig[conv.status]?.color || ''}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig[conv.status]?.label || conv.status}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {conv.priority !== 'NORMAL' && (
                        <span className={`inline-flex items-center gap-1 text-xs font-medium ${priorityConfig[conv.priority]?.color}`}>
                          {conv.priority === 'CRITICAL' && <ArrowUp className="w-3 h-3" />}
                          {conv.priority === 'HIGH' && <ArrowUp className="w-3 h-3" />}
                          {priorityConfig[conv.priority]?.label}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          #{conv.conversationNumber}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 max-w-[200px]">
                          {conv.firstMessage}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          {conv.contact?.name || 'Anónimo'}
                        </p>
                        {conv.contact?.phone && (
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            {conv.contact.phone}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        <ChannelIcon className="w-3.5 h-3.5" />
                        {conv.channel}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {conv.assignedAgent ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-xs font-medium text-primary-600 dark:text-primary-300">
                            {conv.assignedAgent.user.displayName.charAt(0)}
                          </div>
                          <span className="text-xs text-neutral-600 dark:text-neutral-400">
                            {conv.assignedAgent.user.displayName.split(' ')[0]}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-neutral-400">Sin asignar</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {formatTime(conv.lastMessageAt || conv.updatedAt)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/conversations/${conv.id}`}
                        className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredConversations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
              <Inbox className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
              No se encontraron conversaciones
            </h3>
            <p className="text-neutral-500 dark:text-neutral-400 text-center">
              Prueba con otros filtros o espera nuevas conversaciones
            </p>
          </div>
        )}
      </motion.div>

      {/* Bulk Actions */}
      {selectedConversations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-neutral-900 dark:bg-neutral-800 text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-4 z-50"
        >
          <span className="text-sm font-medium">
            {selectedConversations.length} conversación{selectedConversations.length > 1 ? 'es' : ''} seleccionada{selectedConversations.length > 1 ? 's' : ''}
          </span>
          <div className="h-6 w-px bg-neutral-700" />
          <button className="text-sm font-medium hover:text-primary-400">
            Asignar
          </button>
          <button className="text-sm font-medium hover:text-primary-400">
            Cerrar
          </button>
          <button className="text-sm font-medium text-danger-400 hover:text-danger-300">
            Eliminar
          </button>
          <button
            onClick={() => setSelectedConversations([])}
            className="p-1 hover:bg-neutral-800 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
