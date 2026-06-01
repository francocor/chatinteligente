'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Search,
  Check,
  X,
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
  CheckCircle,
} from 'lucide-react';

import { mockAlerts, mockAlertRules } from '@/data/mocks/tickets';
import type { AlertType } from '@/types/tickets';

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

const filterTabs = [
  { id: 'all', label: 'Todas' },
  { id: 'PENDING', label: 'Pendientes' },
  { id: 'ACKNOWLEDGED', label: 'Reconocidas' },
  { id: 'RESOLVED', label: 'Resueltas' },
];

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [rules, setRules] = useState(mockAlertRules);
  const [showNewRuleModal, setShowNewRuleModal] = useState(false);
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleType, setNewRuleType] = useState<AlertType>('CONVERSATION_SLA');
  const [newRuleActive, setNewRuleActive] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [showRules, setShowRules] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const pendingCount = alerts.filter((a) => a.status === 'PENDING').length;
  const acknowledgedCount = alerts.filter((a) => a.status === 'ACKNOWLEDGED').length;
  const resolvedCount = alerts.filter((a) => a.status === 'RESOLVED').length;

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      searchQuery === '' ||
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || alert.status === filter;
    return matchesSearch && matchesFilter;
  });

  const showFeedback = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 2000);
  };

  const handleCreateRule = () => {
    if (!newRuleName.trim()) return;
    setRules((prev) => [
      ...prev,
      {
        id: `rule-${Date.now()}`,
        tenantId: 'demo',
        name: newRuleName.trim(),
        type: newRuleType,
        condition: { type: 'threshold' },
        action: { type: 'notify' as const },
        isActive: newRuleActive,
        triggerCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    setNewRuleName('');
    setNewRuleType('CONVERSATION_SLA');
    setNewRuleActive(true);
    setShowNewRuleModal(false);
    showFeedback('Regla creada correctamente.');
  };

  const handleToggleRule = (id: string) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r)));
    showFeedback('Estado de la regla actualizado.');
  };

  const handleDeleteRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
    showFeedback('Regla eliminada correctamente.');
  };

  const handleAcknowledge = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'ACKNOWLEDGED' as const, acknowledgedAt: new Date() } : a))
    );
    showFeedback('Alerta reconocida.');
  };

  const handleResolve = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'RESOLVED' as const, resolvedAt: new Date() } : a))
    );
    showFeedback('Alerta marcada como resuelta.');
  };

  const handleDismiss = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'DISMISSED' as const } : a))
    );
    showFeedback('Alerta descartada.');
  };

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
      {/* Action feedback toast */}
      {actionFeedback && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-6 right-6 flex items-center gap-2 bg-neutral-900 dark:bg-neutral-700 text-white px-4 py-3 rounded-xl shadow-xl text-sm font-medium z-50"
        >
          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
          {actionFeedback}
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Alertas</h1>
          <p className="text-neutral-500">{pendingCount} alerta{pendingCount !== 1 ? 's' : ''} pendiente{pendingCount !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRules(!showRules)}
            className="flex items-center gap-2 px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            <Settings className="w-4 h-4" />
            Reglas
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: alerts.length },
          { label: 'Pendientes', value: pendingCount, color: 'text-yellow-600' },
          { label: 'Reconocidas', value: acknowledgedCount, color: 'text-blue-600' },
          { label: 'Resueltas', value: resolvedCount, color: 'text-green-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 p-4">
            <p className={`text-xs ${stat.color || 'text-neutral-500'}`}>{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color || 'text-neutral-900 dark:text-neutral-100'}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Alert Rules Panel */}
      {showRules && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 p-4"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Reglas de Alertas</h3>
            <button
              onClick={() => setShowNewRuleModal(true)}
              className="text-xs text-primary-600 hover:text-primary-500 font-medium px-3 py-1.5 border border-primary-200 dark:border-primary-800 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
            >
              + Nueva regla
            </button>
          </div>
          <div className="space-y-3">
            {rules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{rule.name}</p>
                    <span
                      className={`px-2 py-0.5 text-xs rounded ${rule.isActive ? 'bg-green-50 text-green-600' : 'bg-neutral-100 text-neutral-500'}`}
                    >
                      {rule.isActive ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500">{rule.description}</p>
                  <p className="text-xs text-neutral-400">Disparada {rule.triggerCount} veces</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleRule(rule.id)}
                    className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                    title={rule.isActive ? 'Desactivar regla' : 'Activar regla'}
                  >
                    <Power className={`w-4 h-4 ${rule.isActive ? 'text-green-500' : 'text-neutral-400'}`} />
                  </button>
                  <button
                    onClick={() => handleDeleteRule(rule.id)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Eliminar regla"
                  >
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
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar alertas..."
                className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {filterTabs.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1.5 text-sm rounded-lg ${filter === f.id ? 'bg-primary-500 text-white' : 'hover:bg-neutral-100'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 overflow-hidden"
      >
        <div className="divide-y divide-neutral-100">
          {filteredAlerts.map((alert) => {
            const TypeIcon = alertTypeConfig[alert.type]?.icon || Bell;
            const urgency = urgencyConfig[alert.urgency];
            return (
              <motion.div
                key={alert.id}
                layout
                className={`p-4 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 ${alert.urgency === 'CRITICAL' ? 'bg-red-50/30' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-full ${urgency.bg} flex items-center justify-center ${alertTypeConfig[alert.type]?.color}`}
                  >
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
                      {alert.resolvedAt && <span>Resuelta {formatTimeAgo(alert.resolvedAt)}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {alert.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleAcknowledge(alert.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Reconocer"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleResolve(alert.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Resolver"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDismiss(alert.id)}
                          className="p-2 text-neutral-400 hover:bg-neutral-100 rounded-lg transition-colors"
                          title="Descartar"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {alert.status === 'ACKNOWLEDGED' && (
                      <button
                        onClick={() => handleResolve(alert.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Resolver"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
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

      {/* Nueva Regla Modal */}
      {showNewRuleModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Nueva Regla de Alerta</h3>
              <button
                onClick={() => setShowNewRuleModal(false)}
                className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg"
              >
                <X className="w-4 h-4 text-neutral-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Nombre de la regla
                </label>
                <input
                  type="text"
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  placeholder="Ej: SLA crítico — conversaciones prioritarias"
                  className="w-full px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Tipo de alerta
                </label>
                <select
                  value={newRuleType}
                  onChange={(e) => setNewRuleType(e.target.value as AlertType)}
                  className="w-full px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="CONVERSATION_SLA">SLA de Conversación</option>
                  <option value="MESSAGE_SLA">SLA de Mensaje</option>
                  <option value="ESCALATION">Escalación</option>
                  <option value="QUEUE_SIZE">Tamaño de Cola</option>
                  <option value="CSAT_DROP">Caída de CSAT</option>
                  <option value="VOLUME_SPIKE">Pico de Volumen</option>
                  <option value="TICKET">Ticket</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                <span className="text-sm text-neutral-700 dark:text-neutral-300">Activar regla inmediatamente</span>
                <button
                  onClick={() => setNewRuleActive((prev) => !prev)}
                  className={`relative w-10 h-6 rounded-full transition-colors ${newRuleActive ? 'bg-primary-500' : 'bg-neutral-300 dark:bg-neutral-600'}`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${newRuleActive ? 'translate-x-5' : 'translate-x-1'}`}
                  />
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowNewRuleModal(false)}
                  className="flex-1 px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateRule}
                  disabled={!newRuleName.trim()}
                  className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Crear regla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
