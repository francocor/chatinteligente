'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Download,
  Eye,
  Calendar,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  FileSpreadsheet,
  FileJson,
  File,
  Trash2,
  ChevronDown,
  RefreshCw,
  BarChart3,
  ClipboardList,
  MessageCircle,
  Ticket,
  Users,
  Navigation,
  ThumbsUp,
  CheckCircle2,
  Brain,
  BookOpen,
  Clock3,
  Target,
  TrendingUp,
  History,
  Plus,
  X,
} from 'lucide-react';
import {
  ReportType,
  ReportFormat,
  ReportStatus,
  REPORT_TYPES,
  ExportHistoryItem,
  ReportFilters,
  DateRangePreset,
  ReportPreview,
} from '@/types/reports';
import {
  mockExportHistory,
  mockReportPreview,
  mockConversationsReport,
  mockAgentsReport,
  mockSatisfactionReport,
  mockIntentsReport,
} from '@/data/mocks/reports';

const typeIcons: Record<ReportType, any> = {
  executive: BarChart3,
  operational: ClipboardList,
  conversations: MessageCircle,
  tickets: Ticket,
  agents: Users,
  channels: Navigation,
  satisfaction: ThumbsUp,
  resolution: CheckCircle2,
  intents: Brain,
  knowledge: BookOpen,
  timing: Clock3,
  sla: Target,
  volume: TrendingUp,
};

const formatIcons: Record<ReportFormat, any> = {
  csv: FileText,
  xlsx: FileSpreadsheet,
  pdf: File,
};

const statusConfig: Record<ReportStatus, { color: string; icon: any; label: string }> = {
  PENDING: { color: 'text-yellow-600 bg-yellow-50', icon: Clock, label: 'Pendiente' },
  PROCESSING: { color: 'text-blue-600 bg-blue-50', icon: Loader2, label: 'Procesando' },
  COMPLETED: { color: 'text-green-600 bg-green-50', icon: CheckCircle, label: 'Completado' },
  FAILED: { color: 'text-red-600 bg-red-50', icon: XCircle, label: 'Fallido' },
  EXPIRED: { color: 'text-neutral-600 bg-neutral-50', icon: AlertCircle, label: 'Expirado' },
};

const dateRangePresets: { value: DateRangePreset; label: string; days: number }[] = [
  { value: 'today', label: 'Hoy', days: 0 },
  { value: 'yesterday', label: 'Ayer', days: 1 },
  { value: 'last7days', label: 'Últimos 7 días', days: 7 },
  { value: 'last30days', label: 'Últimos 30 días', days: 30 },
  { value: 'thisMonth', label: 'Este mes', days: 30 },
  { value: 'lastMonth', label: 'Mes anterior', days: 30 },
  { value: 'thisYear', label: 'Este año', days: 365 },
];

export default function ExportsPage() {
  const [activeTab, setActiveTab] = useState<'generate' | 'history'>('generate');
  const [selectedType, setSelectedType] = useState<ReportType>('executive');
  const [selectedFormat, setSelectedFormat] = useState<ReportFormat>('xlsx');
  const [showPreview, setShowPreview] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [filters, setFilters] = useState<ReportFilters>({
    dateRange: 'last30days',
  });

  const [history, setHistory] = useState<ExportHistoryItem[]>(mockExportHistory);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return seconds + 's';
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      const newExport: ExportHistoryItem = {
        id: `export-${Date.now()}`,
        reportName: `${REPORT_TYPES[selectedType].label} - ${new Date().toLocaleDateString()}`,
        type: selectedType,
        format: selectedFormat,
        status: 'COMPLETED',
        recordCount: Math.floor(Math.random() * 5000) + 500,
        fileSize: Math.floor(Math.random() * 2000000) + 100000,
        createdBy: { displayName: 'Usuario Actual' },
        createdAt: new Date(),
        completedAt: new Date(),
      };
      setHistory([newExport, ...history]);
      setActiveTab('history');
    }, 2000);
  };

  const handleDeleteExport = (id: string) => {
    setHistory(history.filter(h => h.id !== id));
  };

  const getPreviewData = () => {
    switch (selectedType) {
      case 'conversations':
        return mockConversationsReport;
      case 'agents':
        return mockAgentsReport;
      case 'satisfaction':
        return mockSatisfactionReport;
      case 'intents':
        return mockIntentsReport;
      default:
        return mockReportPreview.rows;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Exportación de Reportes
          </h1>
          <p className="text-neutral-500 mt-1">
            Genera y descarga reportes personalizados en múltiples formatos
          </p>
        </div>
        <div className="flex items-center gap-2 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
          <button
            onClick={() => setActiveTab('generate')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'generate'
                ? 'bg-white dark:bg-neutral-700 text-primary-600 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Plus className="w-4 h-4 inline-block mr-2" />
            Generar
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-white dark:bg-neutral-700 text-primary-600 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <History className="w-4 h-4 inline-block mr-2" />
            Historial
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'generate' ? (
          <motion.div
            key="generate"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Type Selection */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 p-6">
                <h3 className="font-semibold text-neutral-900 mb-4">Tipo de Reporte</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {(Object.entries(REPORT_TYPES) as [ReportType, typeof REPORT_TYPES[ReportType]][]).map(
                    ([type, config]) => {
                      const Icon = typeIcons[type];
                      return (
                        <button
                          key={type}
                          onClick={() => setSelectedType(type)}
                          className={`p-4 rounded-lg border text-left transition-all ${
                            selectedType === type
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-500'
                              : 'border-neutral-200 hover:border-neutral-300'
                          }`}
                        >
                          <Icon className="w-5 h-5 text-primary-600 mb-2" />
                          <p className="font-medium text-sm text-neutral-900">{config.label}</p>
                          <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                            {config.description}
                          </p>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Format Selection */}
              <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 p-6">
                <h3 className="font-semibold text-neutral-900 mb-4">Formato de Exportación</h3>
                <div className="flex gap-4">
                  {(['xlsx', 'csv', 'pdf'] as ReportFormat[]).map(format => {
                    const Icon = formatIcons[format];
                    return (
                      <button
                        key={format}
                        onClick={() => setSelectedFormat(format)}
                        className={`flex-1 p-4 rounded-lg border text-center transition-all ${
                          selectedFormat === format
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-500'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <Icon className="w-8 h-8 mx-auto mb-2 text-primary-600" />
                        <p className="font-medium text-neutral-900 uppercase">{format}</p>
                        <p className="text-xs text-neutral-500 mt-1">
                          {format === 'xlsx' && 'Excel'}
                          {format === 'csv' && 'Valores separados'}
                          {format === 'pdf' && 'Documento PDF'}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Filters & Actions */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 p-6">
                <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filtros
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Período
                    </label>
                    <select
                      value={filters.dateRange}
                      onChange={e => setFilters({ ...filters, dateRange: e.target.value as DateRangePreset })}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {dateRangePresets.map(preset => (
                        <option key={preset.value} value={preset.value}>
                          {preset.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Canal
                    </label>
                    <select className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option value="">Todos los canales</option>
                      <option value="WHATSAPP">WhatsApp</option>
                      <option value="WEB">Web</option>
                      <option value="INSTAGRAM">Instagram</option>
                      <option value="FACEBOOK">Facebook</option>
                      <option value="EMAIL">Email</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Departamento
                    </label>
                    <select className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option value="">Todos los departamentos</option>
                      <option value="1">Atención al Cliente</option>
                      <option value="2">Turnos</option>
                      <option value="3">Laboratorio</option>
                      <option value="4">Urgencias</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Agente
                    </label>
                    <select className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option value="">Todos los agentes</option>
                      <option value="1">María González</option>
                      <option value="2">Carlos Pérez</option>
                      <option value="3">Ana Rodríguez</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 p-6 space-y-3">
                <button
                  onClick={() => setShowPreview(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-neutral-200 rounded-lg hover:bg-neutral-50"
                >
                  <Eye className="w-4 h-4" />
                  Vista Previa
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generando...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Generar y Descargar
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="font-semibold">Historial de Exportaciones</h3>
              <span className="text-sm text-neutral-500">{history.length} reportes</span>
            </div>
            <div className="divide-y divide-neutral-200">
              {history.map(item => {
                const status = statusConfig[item.status];
                const StatusIcon = status.icon;
                const TypeIcon = typeIcons[item.type];
                const FormatIcon = formatIcons[item.format];

                return (
                  <div key={item.id} className="px-6 py-4 flex items-center justify-between hover:bg-neutral-50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                        <TypeIcon className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">{item.reportName}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-neutral-500 flex items-center gap-1">
                            <FormatIcon className="w-3 h-3" />
                            {item.format.toUpperCase()}
                          </span>
                          <span className="text-xs text-neutral-500">
                            {item.recordCount?.toLocaleString() || '-'} registros
                          </span>
                          <span className="text-xs text-neutral-500">
                            {item.fileSize ? formatFileSize(item.fileSize) : '-'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${status.color}`}>
                        <StatusIcon className={`w-3 h-3 ${item.status === 'PROCESSING' ? 'animate-spin' : ''}`} />
                        <span className="text-xs font-medium">{status.label}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-neutral-900">
                          {item.createdAt.toLocaleDateString()}
                        </p>
                        <p className="text-xs text-neutral-500">{item.createdBy.displayName}</p>
                      </div>
                      {item.status === 'COMPLETED' && (
                        <button className="p-2 hover:bg-neutral-100 rounded-lg" title="Descargar">
                          <Download className="w-4 h-4 text-neutral-600" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteExport(item.id)}
                        className="p-2 hover:bg-red-50 rounded-lg"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4 text-neutral-400 hover:text-red-600" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-neutral-800 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Vista Previa</h3>
                  <p className="text-sm text-neutral-500">
                    {REPORT_TYPES[selectedType].label} ({selectedFormat.toUpperCase()})
                  </p>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-neutral-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="overflow-auto max-h-[60vh]">
                <table className="w-full">
                  <thead className="bg-neutral-50 sticky top-0">
                    <tr>
                      {selectedType === 'conversations' && (
                        <>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500">Conversación</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500">Contacto</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500">Canal</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500">Estado</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500">Agente</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500">Fecha</th>
                        </>
                      )}
                      {selectedType === 'agents' && (
                        <>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500">Agente</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500">Departamento</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500">Conversaciones</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500">Resueltas</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500">Tiempo Prom.</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500">CSAT</th>
                        </>
                      )}
                      {selectedType === 'satisfaction' && (
                        <>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500">Fecha</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500">Respuestas</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500">Puntuación</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500">Positivo %</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500">Neutral %</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500">Negativo %</th>
                        </>
                      )}
                      {selectedType === 'intents' && (
                        <>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500">Intención</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500">Cantidad</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500">%</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500">Confianza</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500">Resolución %</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {getPreviewData().slice(0, 10).map((row: any, i: number) => (
                      <tr key={i} className="hover:bg-neutral-50">
                        {selectedType === 'conversations' && (
                          <>
                            <td className="px-4 py-3 text-sm">{row.conversationNumber}</td>
                            <td className="px-4 py-3 text-sm">{row.contactName}</td>
                            <td className="px-4 py-3 text-sm">{row.channel}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`px-2 py-1 rounded text-xs ${
                                row.status === 'RESOLVED' ? 'bg-green-100 text-green-700' :
                                row.status === 'CLOSED' ? 'bg-neutral-100 text-neutral-700' :
                                row.status === 'WAITING' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                                {row.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">{row.assignedAgent || '-'}</td>
                            <td className="px-4 py-3 text-sm">{new Date(row.createdAt).toLocaleDateString()}</td>
                          </>
                        )}
                        {selectedType === 'agents' && (
                          <>
                            <td className="px-4 py-3 text-sm">{row.agentName}</td>
                            <td className="px-4 py-3 text-sm">{row.department}</td>
                            <td className="px-4 py-3 text-sm text-right">{row.conversations}</td>
                            <td className="px-4 py-3 text-sm text-right">{row.resolved}</td>
                            <td className="px-4 py-3 text-sm text-right">{formatDuration(row.avgResponseTime)}</td>
                            <td className="px-4 py-3 text-sm text-right">{row.csatScore.toFixed(1)}</td>
                          </>
                        )}
                        {selectedType === 'satisfaction' && (
                          <>
                            <td className="px-4 py-3 text-sm">{row.date}</td>
                            <td className="px-4 py-3 text-sm text-right">{row.responses}</td>
                            <td className="px-4 py-3 text-sm text-right">{row.score}</td>
                            <td className="px-4 py-3 text-sm text-right text-green-600">{row.positiveRate.toFixed(1)}%</td>
                            <td className="px-4 py-3 text-sm text-right text-yellow-600">{row.neutralRate.toFixed(1)}%</td>
                            <td className="px-4 py-3 text-sm text-right text-red-600">{row.negativeRate.toFixed(1)}%</td>
                          </>
                        )}
                        {selectedType === 'intents' && (
                          <>
                            <td className="px-4 py-3 text-sm">{row.intent}</td>
                            <td className="px-4 py-3 text-sm text-right">{row.count}</td>
                            <td className="px-4 py-3 text-sm text-right">{row.percentage.toFixed(1)}%</td>
                            <td className="px-4 py-3 text-sm text-right">{(row.avgConfidence * 100).toFixed(0)}%</td>
                            <td className="px-4 py-3 text-sm text-right">{row.resolutionRate.toFixed(1)}%</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50">
                <p className="text-sm text-neutral-500 text-center">
                  Mostrando 10 de {getPreviewData().length} registros (usa los filtros para ver más datos)
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}