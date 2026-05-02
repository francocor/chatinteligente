'use client';

/* =====================================================
   FLOWS LISTING PAGE
   Plataforma de Atención Inteligente
   ===================================================== */

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  GitBranch,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Play,
  Pause,
  Edit,
  Copy,
  Trash2,
  Globe,
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  Clock,
  Tag,
  Users,
  Zap,
  ChevronDown,
  Check,
  X,
  ArrowUpRight,
  AlertCircle,
  Eye,
  BarChart3,
  Settings,
  Layers,
  MessageCircle,
  Archive,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';

/* =====================================================
   MOCK DATA - FLOWS
   ===================================================== */

const flowsData = [
  {
    id: '1',
    name: 'Turnos y Citas',
    description: 'Gestión completa de agendamiento de citas médicas',
    triggerKeywords: ['turno', 'cita', 'reservar', 'hora', 'agenda'],
    channel: 'all',
    status: 'published',
    isActive: true,
    version: 3,
    stats: {
      totalStarts: 4523,
      completions: 3842,
      abandonRate: 15.1,
      avgTime: '2:34',
    },
    department: 'atencion',
    createdAt: '2024-01-15',
    updatedAt: '2024-03-10',
    createdBy: 'Carlos Mendoza',
  },
  {
    id: '2',
    name: 'Horarios de Atención',
    description: 'Información sobre horarios de consultorios y módulos',
    triggerKeywords: ['horario', 'atención', 'abierto', 'cerrado', 'funciona'],
    channel: 'all',
    status: 'published',
    isActive: true,
    version: 2,
    stats: {
      totalStarts: 2847,
      completions: 2456,
      abandonRate: 13.7,
      avgTime: '1:12',
    },
    department: 'atencion',
    createdAt: '2024-01-20',
    updatedAt: '2024-02-28',
    createdBy: 'Ana Silva',
  },
  {
    id: '3',
    name: 'Especialidades Médicas',
    description: 'Listado y descripción de especialidades disponibles',
    triggerKeywords: ['especialidad', 'médico', 'doctor', 'tratamiento'],
    channel: 'web',
    status: 'published',
    isActive: true,
    version: 1,
    stats: {
      totalStarts: 1203,
      completions: 1089,
      abandonRate: 9.5,
      avgTime: '1:45',
    },
    department: 'atencion',
    createdAt: '2024-02-01',
    updatedAt: '2024-02-15',
    createdBy: 'Carlos Mendoza',
  },
  {
    id: '4',
    name: 'Obras Sociales',
    description: 'Consulta de cobertura y obras sociales aceptadas',
    triggerKeywords: ['obra social', 'preparación', 'cobertura', 'aseguradora'],
    channel: 'all',
    status: 'draft',
    isActive: false,
    version: 1,
    stats: {
      totalStarts: 0,
      completions: 0,
      abandonRate: 0,
      avgTime: '0:00',
    },
    department: 'cobranzas',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-01',
    createdBy: 'Roberto Díaz',
  },
  {
    id: '5',
    name: 'Resultados de Estudios',
    description: 'Información sobre retiro de resultados de Laboratory clínico',
    triggerKeywords: ['resultado', 'estudio', 'Laboratory', 'entrega', 'retirar'],
    channel: 'whatsapp',
    status: 'published',
    isActive: true,
    version: 2,
    stats: {
      totalStarts: 892,
      completions: 756,
      abandonRate: 15.2,
      avgTime: '1:58',
    },
    department: 'atencion',
    createdAt: '2024-02-10',
    updatedAt: '2024-03-05',
    createdBy: 'Patricia López',
  },
  {
    id: '6',
    name: 'Urgencias',
    description: 'Derivación a urgencias y situaciones críticas',
    triggerKeywords: ['urgencia', 'emergencia', 'grave', 'síntomas graves'],
    channel: 'all',
    status: 'published',
    isActive: true,
    version: 1,
    stats: {
      totalStarts: 234,
      completions: 198,
      abandonRate: 15.4,
      avgTime: '0:45',
    },
    department: 'emergencias',
    createdAt: '2024-02-15',
    updatedAt: '2024-02-28',
    createdBy: 'Carlos Mendoza',
  },
  {
    id: '7',
    name: 'Recepción - Hablar con Persona',
    description: 'Transferencia a receptionist o área específica',
    triggerKeywords: ['hablar', 'persona', 'recepción', 'atención humana'],
    channel: 'all',
    status: 'published',
    isActive: true,
    version: 1,
    stats: {
      totalStarts: 1567,
      completions: 1432,
      abandonRate: 8.6,
      avgTime: '0:32',
    },
    department: 'atencion',
    createdAt: '2024-01-10',
    updatedAt: '2024-03-01',
    createdBy: 'Ana Silva',
  },
  {
    id: '8',
    name: 'Información de Contacto',
    description: 'Datos de contacto, direcciones y cómo llegar',
    triggerKeywords: ['contacto', 'dirección', 'ubicación', 'llegar', 'teléfono'],
    channel: 'web',
    status: 'published',
    isActive: false,
    version: 1,
    stats: {
      totalStarts: 445,
      completions: 412,
      abandonRate: 7.4,
      avgTime: '0:55',
    },
    department: 'atencion',
    createdAt: '2024-01-25',
    updatedAt: '2024-02-20',
    createdBy: 'Patricia López',
  },
];

/* =====================================================
   FILTER OPTIONS
   ===================================================== */

const departments = [
  { id: 'all', label: 'Todos los departamentos' },
  { id: 'atencion', label: 'Atención al Cliente' },
  { id: 'soporte', label: 'Soporte Técnico' },
  { id: 'ventas', label: 'Ventas' },
  { id: 'cobranzas', label: 'Cobranzas' },
  { id: 'emergencias', label: 'Emergencias' },
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

/* =====================================================
   COMPONENTS
   ===================================================== */

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string; icon: any }> = {
    published: {
      bg: 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300',
      text: 'text-success-600',
      label: 'Publicado',
      icon: Check,
    },
    draft: {
      bg: 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400',
      text: 'text-neutral-500',
      label: 'Borrador',
      icon: Edit,
    },
    archived: {
      bg: 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300',
      text: 'text-warning-500',
      label: 'Archivado',
      icon: Archive,
    },
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

/* =====================================================
   MAIN COMPONENT
   ===================================================== */

export default function FlowsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [department, setDepartment] = useState('all');
  const [status, setStatus] = useState('all');
  const [channel, setChannel] = useState('all');
  const [selectedFlows, setSelectedFlows] = useState<string[]>([]);

  // Filter flows
  const filteredFlows = flowsData.filter((flow) => {
    const matchesSearch = searchQuery === '' ||
      flow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flow.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flow.triggerKeywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDepartment = department === 'all' || flow.department === department;
    const matchesStatus = status === 'all' || flow.status === status;
    const matchesChannel = channel === 'all' || flow.channel === channel;

    return matchesSearch && matchesDepartment && matchesStatus && matchesChannel;
  });

  const handleSelectAll = () => {
    if (selectedFlows.length === filteredFlows.length) {
      setSelectedFlows([]);
    } else {
      setSelectedFlows(filteredFlows.map(f => f.id));
    }
  };

  const handleToggleActive = (flowId: string) => {
    console.log('Toggle active:', flowId);
  };

  return (
    <div className="space-y-6">
       {/* =====================================================
          HEADER
          ===================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Flujos Conversacionales
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            Crea y gestiona los flujos de conversación del bot
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/flows/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nuevo Flujo
          </Link>
        </div>
      </div>

       {/* =====================================================
          FILTERS BAR
          ===================================================== */}
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
                placeholder="Buscar flujos..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Department */}
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-neutral-400" />
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-1.5 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300"
            >
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.label}</option>
              ))}
            </select>
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

          {/* Channel */}
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-neutral-400" />
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-1.5 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300"
            >
              {channels.map((ch) => (
                <option key={ch.id} value={ch.id}>{ch.label}</option>
              ))}
            </select>
          </div>

          {/* Results count */}
          <div className="ml-auto text-sm text-neutral-500">
            {filteredFlows.length} de {flowsData.length} flujos
          </div>
        </div>
      </div>

       {/* =====================================================
          FLOWS TABLE
          ===================================================== */}
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
                    checked={selectedFlows.length === filteredFlows.length && filteredFlows.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Flujo
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Departamento
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Canales
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Rendimiento
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Últ. Actualización
                </th>
                <th className="w-20 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
              {filteredFlows.map((flow) => (
                <tr
                  key={flow.id}
                  className={`hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors ${
                    !flow.isActive ? 'opacity-60' : ''
                  }`}
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedFlows.includes(flow.id)}
                      onChange={() => {
                        setSelectedFlows(prev =>
                          prev.includes(flow.id)
                            ? prev.filter(id => id !== flow.id)
                            : [...prev, flow.id]
                        );
                      }}
                      className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0">
                        <GitBranch className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-neutral-900 dark:text-neutral-100">
                            {flow.name}
                          </p>
                          {flow.status === 'draft' && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300">
                              Borrador
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-1">
                          {flow.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          {flow.triggerKeywords.slice(0, 3).map((keyword) => (
                            <span
                              key={keyword}
                              className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400"
                            >
                              {keyword}
                            </span>
                          ))}
                          {flow.triggerKeywords.length > 3 && (
                            <span className="text-[10px] text-neutral-400">
                              +{flow.triggerKeywords.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 capitalize">
                      {flow.department}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={flow.status} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      {flow.channel === 'all' ? (
                        <span className="flex items-center gap-1 text-xs font-medium text-purple-600 dark:text-purple-400">
                          <Layers className="w-3.5 h-3.5" />
                          Multi
                        </span>
                      ) : (
                        <ChannelBadge channel={flow.channel} />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-500">Inicios</span>
                        <span className="font-medium text-neutral-900 dark:text-neutral-100">
                          {flow.stats.totalStarts.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-500">Completado</span>
                        <span className="font-medium text-success-600">
                          {((flow.stats.completions / flow.stats.totalStarts) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-24 h-1.5 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-success-500 rounded-full"
                          style={{ width: `${(flow.stats.completions / flow.stats.totalStarts) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {new Date(flow.updatedAt).toLocaleDateString('es-CL', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      v{flow.version}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleActive(flow.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          flow.isActive
                            ? 'text-success-600 hover:bg-success-50 dark:hover:bg-success-900/20'
                            : 'text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                        }`}
                        title={flow.isActive ? 'Desactivar' : 'Activar'}
                      >
                        {flow.isActive ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </button>
                      <Link
                        href={`/dashboard/flows/${flow.id}/edit`}
                        className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/dashboard/flows/${flow.id}`}
                        className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredFlows.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
              <GitBranch className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
              No se encontraron flujos
            </h3>
            <p className="text-neutral-500 dark:text-neutral-400 text-center mb-6">
              Prueba con otros filtros o crea un nuevo flujo
            </p>
            <Link
              href="/dashboard/flows/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium"
            >
              <Plus className="w-5 h-5" />
              Crear Flujo
            </Link>
          </div>
        )}
      </motion.div>

      /* =====================================================
         BULK ACTIONS (when items selected)
         ===================================================== */
      {selectedFlows.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-neutral-900 dark:bg-neutral-800 text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-4 z-50"
        >
          <span className="text-sm font-medium">
            {selectedFlows.length} flujo{selectedFlows.length > 1 ? 's' : ''} seleccionado{selectedFlows.length > 1 ? 's' : ''}
          </span>
          <div className="h-6 w-px bg-neutral-700" />
          <button className="text-sm font-medium hover:text-primary-400">
            Publicar
          </button>
          <button className="text-sm font-medium hover:text-primary-400">
            Duplicar
          </button>
          <button className="text-sm font-medium text-danger-400 hover:text-danger-300">
            Eliminar
          </button>
          <button
            onClick={() => setSelectedFlows([])}
            className="p-1 hover:bg-neutral-800 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
}