'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GitBranch, Plus, Search, Filter, Play, Pause, Edit, Trash2,
  Globe, MessageSquare, Phone, Mail, Clock, Users, Zap, Check,
  X, Eye, Layers, MessageCircle, Archive, CheckCircle,
} from 'lucide-react';

const initialFlows = [
  { id: '1', name: 'Bienvenida y Menú Principal', description: 'Flow inicial de saludo y presentación de opciones al cliente', triggerKeywords: ['hola', 'buenos días', 'buenas tardes', 'inicio', 'hello'], channel: 'all', status: 'published', isActive: true, version: 4, stats: { totalStarts: 8934, completions: 7823, abandonRate: 12.4, avgTime: '0:45' }, department: 'atencion', updatedAt: '2024-03-15', createdBy: 'Ana Silva' },
  { id: '2', name: 'Horarios y Canales de Contacto', description: 'Información sobre horarios de atención y cómo comunicarse', triggerKeywords: ['horario', 'atención', 'abierto', 'cerrado', 'contacto'], channel: 'all', status: 'published', isActive: true, version: 2, stats: { totalStarts: 2847, completions: 2456, abandonRate: 9.2, avgTime: '1:12' }, department: 'atencion', updatedAt: '2024-02-28', createdBy: 'Ana Silva' },
  { id: '3', name: 'Consulta Comercial y Precios', description: 'Información sobre planes, precios y cotizaciones personalizadas', triggerKeywords: ['precio', 'plan', 'costo', 'cotización', 'cuánto sale'], channel: 'web', status: 'published', isActive: true, version: 1, stats: { totalStarts: 1203, completions: 1089, abandonRate: 9.5, avgTime: '2:10' }, department: 'ventas', updatedAt: '2024-02-15', createdBy: 'Carlos Mendoza' },
  { id: '4', name: 'Medios de Pago y Facturación', description: 'Información sobre métodos de pago aceptados y facturación', triggerKeywords: ['pago', 'tarjeta', 'transferencia', 'factura', 'facturación'], channel: 'all', status: 'draft', isActive: false, version: 1, stats: { totalStarts: 0, completions: 0, abandonRate: 0, avgTime: '0:00' }, department: 'cobranzas', updatedAt: '2024-03-01', createdBy: 'Roberto Díaz' },
  { id: '5', name: 'Seguimiento de Pedidos', description: 'Consulta del estado y seguimiento de pedidos o solicitudes', triggerKeywords: ['pedido', 'seguimiento', 'dónde está', 'entrega', 'estado'], channel: 'whatsapp', status: 'published', isActive: true, version: 2, stats: { totalStarts: 1245, completions: 987, abandonRate: 15.2, avgTime: '1:58' }, department: 'atencion', updatedAt: '2024-03-05', createdBy: 'Patricia López' },
  { id: '6', name: 'Soporte Técnico Urgente', description: 'Atención de incidencias críticas y derivación al equipo técnico', triggerKeywords: ['urgente', 'falla', 'caído', 'no funciona', 'error crítico'], channel: 'all', status: 'published', isActive: true, version: 1, stats: { totalStarts: 234, completions: 198, abandonRate: 8.4, avgTime: '0:45' }, department: 'soporte', updatedAt: '2024-02-28', createdBy: 'Carlos Mendoza' },
  { id: '7', name: 'Hablar con un Agente', description: 'Derivación directa a agente humano disponible', triggerKeywords: ['hablar', 'persona', 'humano', 'agente', 'asesor'], channel: 'all', status: 'published', isActive: true, version: 1, stats: { totalStarts: 1567, completions: 1432, abandonRate: 8.6, avgTime: '0:32' }, department: 'atencion', updatedAt: '2024-03-01', createdBy: 'Ana Silva' },
  { id: '8', name: 'Reclamos y Devoluciones', description: 'Gestión de reclamos, devoluciones y solicitudes de reembolso', triggerKeywords: ['reclamo', 'devolución', 'reembolso', 'queja', 'dañado'], channel: 'web', status: 'published', isActive: false, version: 2, stats: { totalStarts: 389, completions: 312, abandonRate: 19.8, avgTime: '2:15' }, department: 'atencion', updatedAt: '2024-03-12', createdBy: 'Patricia López' },
];

type Flow = typeof initialFlows[0];

const departments = [
  { id: 'all', label: 'Todos los departamentos' },
  { id: 'atencion', label: 'Atención al Cliente' },
  { id: 'soporte', label: 'Soporte Técnico' },
  { id: 'ventas', label: 'Ventas' },
  { id: 'cobranzas', label: 'Cobranzas' },
];

const statuses = [
  { id: 'all', label: 'Todos los estados' },
  { id: 'published', label: 'Publicado' },
  { id: 'draft', label: 'Borrador' },
  { id: 'archived', label: 'Archivado' },
];

const channels = [
  { id: 'all', label: 'Todos los canales' },
  { id: 'web', label: 'Web' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'email', label: 'Email' },
  { id: 'telegram', label: 'Telegram' },
];

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; label: string; icon: any }> = {
    published: { bg: 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300', label: 'Publicado', icon: Check },
    draft: { bg: 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400', label: 'Borrador', icon: Edit },
    archived: { bg: 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300', label: 'Archivado', icon: Archive },
  };
  const style = config[status] || config.draft;
  const Icon = style.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg}`}>
      <Icon className="w-3 h-3" />
      {style.label}
    </span>
  );
}

function ChannelBadge({ channel }: { channel: string }) {
  const config: Record<string, { icon: any; label: string; color: string }> = {
    web: { icon: Globe, label: 'Web', color: 'text-blue-500' },
    whatsapp: { icon: Phone, label: 'WhatsApp', color: 'text-green-500' },
    email: { icon: Mail, label: 'Email', color: 'text-yellow-500' },
    telegram: { icon: MessageCircle, label: 'Telegram', color: 'text-cyan-500' },
    all: { icon: Layers, label: 'Multi', color: 'text-purple-500' },
  };
  const style = config[channel] || config.web;
  const Icon = style.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${style.color}`}>
      <Icon className="w-3.5 h-3.5" />
      {style.label}
    </span>
  );
}

export default function FlowsPage() {
  const [flows, setFlows] = useState(initialFlows);
  const [searchQuery, setSearchQuery] = useState('');
  const [department, setDepartment] = useState('all');
  const [status, setStatus] = useState('all');
  const [channel, setChannel] = useState('all');
  const [selectedFlows, setSelectedFlows] = useState<string[]>([]);
  const [viewFlow, setViewFlow] = useState<Flow | null>(null);
  const [flowFeedback, setFlowFeedback] = useState<string | null>(null);

  const filteredFlows = flows.filter((flow) => {
    const matchesSearch = searchQuery === '' ||
      flow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flow.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flow.triggerKeywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDepartment = department === 'all' || flow.department === department;
    const matchesStatus = status === 'all' || flow.status === status;
    const matchesChannel = channel === 'all' || flow.channel === channel;
    return matchesSearch && matchesDepartment && matchesStatus && matchesChannel;
  });

  const showFeedback = (msg: string) => {
    setFlowFeedback(msg);
    setTimeout(() => setFlowFeedback(null), 2500);
  };

  const handleToggleActive = (flowId: string) => {
    setFlows(prev => prev.map(f => {
      if (f.id !== flowId) return f;
      const next = { ...f, isActive: !f.isActive };
      showFeedback(`Flujo "${f.name.split(' ').slice(0, 3).join(' ')}..." ${next.isActive ? 'activado' : 'pausado'}.`);
      return next;
    }));
  };

  const handleSelectAll = () => {
    if (selectedFlows.length === filteredFlows.length) {
      setSelectedFlows([]);
    } else {
      setSelectedFlows(filteredFlows.map(f => f.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Feedback toast */}
      {flowFeedback && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-6 right-6 flex items-center gap-2 bg-neutral-900 dark:bg-neutral-700 text-white px-4 py-3 rounded-xl shadow-xl text-sm font-medium z-50"
        >
          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
          {flowFeedback}
        </motion.div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Flujos Conversacionales</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">Crea y gestiona los flujos de conversación del bot</p>
        </div>
        <button
          onClick={() => showFeedback('Editor de flujos disponible en la versión completa.')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Flujo
        </button>
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
                placeholder="Buscar flujos..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-neutral-400" />
            <select value={department} onChange={(e) => setDepartment(e.target.value)} className="text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-1.5 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300">
              {departments.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-neutral-400" />
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-1.5 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300">
              {statuses.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-neutral-400" />
            <select value={channel} onChange={(e) => setChannel(e.target.value)} className="text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-1.5 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300">
              {channels.map(ch => <option key={ch.id} value={ch.id}>{ch.label}</option>)}
            </select>
          </div>
          <div className="ml-auto text-sm text-neutral-500">{filteredFlows.length} de {flows.length} flujos</div>
        </div>
      </div>

      {/* Flows Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50">
                <th className="w-10 px-4 py-3">
                  <input type="checkbox" checked={selectedFlows.length === filteredFlows.length && filteredFlows.length > 0} onChange={handleSelectAll} className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Flujo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Departamento</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Canal</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Rendimiento</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Últ. Actualización</th>
                <th className="w-24 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
              {filteredFlows.map((flow) => (
                <tr key={flow.id} className={`hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors ${!flow.isActive ? 'opacity-60' : ''}`}>
                  <td className="px-4 py-4">
                    <input type="checkbox" checked={selectedFlows.includes(flow.id)} onChange={() => setSelectedFlows(prev => prev.includes(flow.id) ? prev.filter(id => id !== flow.id) : [...prev, flow.id])} className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0">
                        <GitBranch className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-neutral-900 dark:text-neutral-100">{flow.name}</p>
                          {flow.status === 'draft' && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300">Borrador</span>
                          )}
                        </div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-1">{flow.description}</p>
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                          {flow.triggerKeywords.slice(0, 3).map((kw) => (
                            <span key={kw} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400">{kw}</span>
                          ))}
                          {flow.triggerKeywords.length > 3 && <span className="text-[10px] text-neutral-400">+{flow.triggerKeywords.length - 3}</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 capitalize">
                      {flow.department}
                    </span>
                  </td>
                  <td className="px-4 py-4"><StatusBadge status={flow.status} /></td>
                  <td className="px-4 py-4">
                    {flow.channel === 'all' ? (
                      <span className="flex items-center gap-1 text-xs font-medium text-purple-600 dark:text-purple-400">
                        <Layers className="w-3.5 h-3.5" />Multi
                      </span>
                    ) : (
                      <ChannelBadge channel={flow.channel} />
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {flow.stats.totalStarts > 0 ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-neutral-500">Inicios</span>
                          <span className="font-medium text-neutral-900 dark:text-neutral-100">{flow.stats.totalStarts.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-neutral-500">Completado</span>
                          <span className="font-medium text-success-600">{((flow.stats.completions / flow.stats.totalStarts) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-24 h-1.5 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                          <div className="h-full bg-success-500 rounded-full" style={{ width: `${(flow.stats.completions / flow.stats.totalStarts) * 100}%` }} />
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-neutral-400">Sin datos aún</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {new Date(flow.updatedAt).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="text-xs text-neutral-400 mt-0.5">v{flow.version}</p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleActive(flow.id)}
                        className={`p-2 rounded-lg transition-colors ${flow.isActive ? 'text-success-600 hover:bg-success-50 dark:hover:bg-success-900/20' : 'text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}
                        title={flow.isActive ? 'Pausar' : 'Activar'}
                      >
                        {flow.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => showFeedback('Editor de flujo disponible en la versión completa.')}
                        className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewFlow(flow)}
                        className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredFlows.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
              <GitBranch className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">No se encontraron flujos</h3>
            <p className="text-neutral-500 dark:text-neutral-400 text-center mb-6">Prueba con otros filtros o crea un nuevo flujo</p>
            <button
              onClick={() => showFeedback('Editor de flujos disponible en la versión completa.')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium"
            >
              <Plus className="w-5 h-5" />
              Crear Flujo
            </button>
          </div>
        )}
      </motion.div>

      {/* Bulk Actions */}
      {selectedFlows.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-neutral-900 dark:bg-neutral-800 text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-4 z-50">
          <span className="text-sm font-medium">{selectedFlows.length} flujo{selectedFlows.length > 1 ? 's' : ''} seleccionado{selectedFlows.length > 1 ? 's' : ''}</span>
          <div className="h-6 w-px bg-neutral-700" />
          <button onClick={() => { setSelectedFlows([]); showFeedback('Flujos publicados en modo demo.'); }} className="text-sm font-medium hover:text-primary-400">Publicar</button>
          <button onClick={() => { setSelectedFlows([]); showFeedback('Flujos duplicados en modo demo.'); }} className="text-sm font-medium hover:text-primary-400">Duplicar</button>
          <button onClick={() => { setSelectedFlows([]); showFeedback('Flujos eliminados en modo demo.'); }} className="text-sm font-medium text-danger-400 hover:text-danger-300">Eliminar</button>
          <button onClick={() => setSelectedFlows([])} className="p-1 hover:bg-neutral-800 rounded">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Flow Detail Modal */}
      {viewFlow && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0">
                  <GitBranch className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{viewFlow.name}</h3>
                  <p className="text-sm text-neutral-500">v{viewFlow.version} · {viewFlow.createdBy}</p>
                </div>
              </div>
              <button onClick={() => setViewFlow(null)} className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg">
                <X className="w-4 h-4 text-neutral-500" />
              </button>
            </div>

            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">{viewFlow.description}</p>

            <div className="flex flex-wrap gap-1.5 mb-5">
              {viewFlow.triggerKeywords.map(kw => (
                <span key={kw} className="px-2 py-1 text-xs bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full">{kw}</span>
              ))}
            </div>

            {viewFlow.stats.totalStarts > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: 'Inicios', value: viewFlow.stats.totalStarts.toLocaleString() },
                  { label: 'Completados', value: viewFlow.stats.completions.toLocaleString() },
                  { label: 'Abandono', value: `${viewFlow.stats.abandonRate}%` },
                ].map(({ label, value }) => (
                  <div key={label} className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-xl text-center">
                    <p className="text-xs text-neutral-500 mb-1">{label}</p>
                    <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{value}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between py-3 border-t border-neutral-100 dark:border-neutral-700 mb-4">
              <div className="flex items-center gap-4 text-sm">
                <StatusBadge status={viewFlow.status} />
                <ChannelBadge channel={viewFlow.channel} />
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${viewFlow.isActive ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'}`}>
                {viewFlow.isActive ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setViewFlow(null)} className="flex-1 px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                Cerrar
              </button>
              <button
                onClick={() => { setViewFlow(null); showFeedback('Editor de flujo disponible en la versión completa.'); }}
                className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Editar flujo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
