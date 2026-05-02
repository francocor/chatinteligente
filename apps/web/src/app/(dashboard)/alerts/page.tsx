'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Search,
  AlertTriangle,
  Check,
  X,
  ChevronRight,
  Clock,
  User,
  MessageSquare,
  Ticket,
  Activity,
  Zap,
  Layers,
  Settings,
  Power,
  Trash2,
} from 'lucide-react';

import { mockAlerts, alertStats as mockAlertStats, mockAlertRules } from '@/data/mocks/tickets';

const alertTypeConfig: Record<string, { label: string; icon: any; color: string }> = {
  ESCALATION: { label: 'Escalación', icon: User, color: 'text-red-500' },
  TICKET: { label: 'Ticket', icon: Ticket, color: 'text-orange-500' },
  CONVERSATION_SLA: { label: 'SLA Conversación', icon: Clock, color: 'text-yellow-500' },
  MESSAGE_SLA: { label: 'SLA Mensaje', icon: MessageSquare, color: 'text-yellow-500' },
  CSAT_DROP: { label: 'CSAT Bajo', icon: Activity, color: 'text-pink-500' },
  QUEUE_SIZE: { label: 'Cola', icon: Layers, color: 'text-purple-500' },
  VOLUME_SPIKE: { label: 'Pico Volumen', icon: Zap, color: 'text-cyan-500' },
};

const urgencyConfig: Record<string, { label: string; color: string; bg: string }> = {
  LOW: { label: 'Baja', color: 'text-neutral-500', bg: 'bg-neutral-50' },
  NORMAL: { label: 'Normal', color: 'text-blue-500', bg: 'bg-blue-50' },
  HIGH: { label: 'Alta', color: 'text-orange-500', bg: 'bg-orange-50' },
  CRITICAL: { label: 'Crítica', color: 'text-red-600', bg: 'bg-red-50' },
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: 'Pendiente', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  ACKNOWLEDGED: { label: 'Reconocida', color: 'text-blue-600', bg: 'bg-blue-50' },
  RESOLVED: { label: 'Resuelta', color: 'text-green-600', bg: 'bg-green-50' },
  DISMISSED: { label: 'Descartada', color: 'text-neutral-500', bg: 'bg-neutral-50' },
};

const filterAlerts = [
  { id: 'all', label: 'Todas' },
  { id: 'PENDING', label: 'Pendientes' },
  { id: 'ACKNOWLEDGED', label: 'Reconocidas' },
  { id: 'RESOLVED', label: 'Resueltas' },
];

export default function AlertsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [showRules, setShowRules] = useState(false);

  const filteredAlerts = mockAlerts.filter(alert => {
    const matchesSearch = searchQuery === '' ||
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || alert.status === filter;
    return matchesSearch && matchesFilter;
  });

  const pendingCount = mockAlerts.filter(a => a.status === 'PENDING').length;

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Alertas</h1>
          <p className="text-neutral-500">{pendingCount} alertas pendientes</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowRules(!showRules)} className="flex items-center gap-2 px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800">
            <Settings className="w-4 h-4" />
            Reglas
          </button>
        </div>
      </div>

       {/* Stats */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {[
           { label: 'Total', value: mockAlertStats.total },
           { label: 'Pendientes', value: mockAlertStats.pending, color: 'text-yellow-600' },
           { label: 'Reconocidas', value: mockAlertStats.acknowledged, color: 'text-blue-600' },
           { label: 'Resueltas', value: mockAlertStats.resolved, color: 'text-green-600' },
         ].map(stat => (
           <div key={stat.label} className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 p-4">
             <p className={`text-xs ${stat.color || 'text-neutral-500'}`}>{stat.label}</p>
             <p className={`text-2xl font-bold ${stat.color || 'text-neutral-900'}`}>{stat.value}</p>
           </div>
         ))}
       </div>

      {/* Alert Rules Panel */}
      {showRules && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 p-4">
          <h3 className="font-semibold mb-4">Reglas de Alertas</h3>
          <div className="space-y-3">
            {mockAlertRules.map(rule => (
              <div key={rule.id} className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{rule.name}</p>
                    <span className={`px-2 py-0.5 text-xs rounded ${rule.isActive ? 'bg-green-50 text-green-600' : 'bg-neutral-100 text-neutral-500'}`}>
                      {rule.isActive ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500">{rule.description}</p>
                  <p className="text-xs text-neutral-400">Disparada {rule.triggerCount} veces</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-neutral-100 rounded-lg">
                    <Power className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-neutral-100 rounded-lg">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px] max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar alertas..." className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg" />
            </div>
          </div>
          <div className="flex gap-2">
            {filterAlerts.map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)} className={`px-3 py-1.5 text-sm rounded-lg ${filter === f.id ? 'bg-primary-500 text-white' : 'hover:bg-neutral-100'}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <motion.div initial={{ opacity: 0, y: 20 }} className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 overflow-hidden">
        <div className="divide-y divide-neutral-100">
          {filteredAlerts.map(alert => {
            const TypeIcon = alertTypeConfig[alert.type]?.icon || Bell;
            const urgency = urgencyConfig[alert.urgency];

            return (
              <motion.div key={alert.id} className={`p-4 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 ${alert.urgency === 'CRITICAL' ? 'bg-red-50/30' : ''}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full ${urgency.bg} flex items-center justify-center ${alertTypeConfig[alert.type]?.color}`}>
                    <TypeIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 text-xs rounded ${statusConfig[alert.status]?.bg} ${statusConfig[alert.status]?.color}`}>
                        {statusConfig[alert.status]?.label}
                      </span>
                      <span className={`px-2 py-0.5 text-xs rounded ${urgency.bg} ${urgency.color}`}>
                        {urgency.label}
                      </span>
                      <span className="text-xs text-neutral-400">{alertTypeConfig[alert.type]?.label}</span>
                    </div>
                    <h4 className="font-medium text-neutral-900 dark:text-neutral-100">{alert.title}</h4>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{alert.message}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-neutral-400">
                      <span>{formatTimeAgo(alert.createdAt)}</span>
                      {alert.acknowledgedAt && <span>Reconocida {formatTimeAgo(alert.acknowledgedAt)}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {alert.status === 'PENDING' && (
                      <>
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Reconocer">
                          <Check className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg" title="Resolver">
                          <Check className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-neutral-400 hover:bg-neutral-100 rounded-lg" title="Descartar">
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredAlerts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <Bell className="w-10 h-10 text-neutral-300 mb-3" />
            <p className="text-neutral-500">No se encontraron alertas</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}