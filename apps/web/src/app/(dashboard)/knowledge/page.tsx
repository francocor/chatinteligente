'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, Plus, Search, Edit, Eye, Star, FileText,
  MessageSquare, ExternalLink, ThumbsUp, X, CheckCircle,
  Eye as ViewIcon,
} from 'lucide-react';

import { mockKnowledgeEntries, knowledgeStats } from '@/data/mocks/knowledge';

type Entry = typeof mockKnowledgeEntries[0];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  ACTIVE: { label: 'Activo', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
  DRAFT: { label: 'Borrador', color: 'text-neutral-500', bg: 'bg-neutral-50 dark:bg-neutral-700' },
  REVIEW: { label: 'Revisión', color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
  ARCHIVED: { label: 'Archivado', color: 'text-neutral-400', bg: 'bg-neutral-100 dark:bg-neutral-800' },
};

const sourceConfig: Record<string, { label: string; icon: any }> = {
  FAQ: { label: 'FAQ', icon: MessageSquare },
  ARTICLE: { label: 'Artículo', icon: FileText },
  POLICY: { label: 'Política', icon: BookOpen },
  DOCUMENT: { label: 'Documento', icon: FileText },
  MANUAL: { label: 'Manual', icon: BookOpen },
  WEBPAGE: { label: 'Web', icon: ExternalLink },
};

export default function KnowledgePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
  const [viewEntry, setViewEntry] = useState<Entry | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const filteredEntries = mockKnowledgeEntries.filter(entry => {
    const matchesSearch = searchQuery === '' ||
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = category === 'all' || entry.category === category;
    const matchesStatus = status === 'all' || entry.status === status;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleSelectAll = () => {
    if (selectedEntries.length === filteredEntries.length) {
      setSelectedEntries([]);
    } else {
      setSelectedEntries(filteredEntries.map(e => e.id));
    }
  };

  const showFeedback = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 2500);
  };

  const categoryList = Array.from(new Set(mockKnowledgeEntries.map(e => e.category)));

  return (
    <div className="space-y-6">
      {/* Feedback toast */}
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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Base de Conocimiento</h1>
          <p className="text-neutral-500 mt-1">FAQs, artículos y documentación para el chatbot</p>
        </div>
        <button
          onClick={() => showFeedback('Editor de entradas disponible en la versión completa.')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nueva Entrada
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total', value: knowledgeStats.total },
          { label: 'Activas', value: knowledgeStats.active },
          { label: 'Destacadas', value: knowledgeStats.featured, color: 'text-yellow-600' },
          { label: 'Borrador', value: knowledgeStats.drafts },
          { label: 'Vistas', value: knowledgeStats.totalViews },
          { label: 'Útiles', value: knowledgeStats.totalHelpful },
        ].map(stat => (
          <div key={stat.label} className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4">
            <p className="text-xs text-neutral-500">{stat.label}</p>
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
                placeholder="Buscar por título, contenido o keywords..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300">
            <option value="all">Todas las categorías</option>
            {categoryList.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300">
            <option value="all">Todos los estados</option>
            {Object.keys(statusConfig).map(s => <option key={s} value={s}>{statusConfig[s].label}</option>)}
          </select>
          <div className="ml-auto text-sm text-neutral-500">{filteredEntries.length} entradas</div>
        </div>
      </div>

      {/* Knowledge Entries Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50">
                <th className="w-10 px-4 py-3">
                  <input type="checkbox" checked={selectedEntries.length === filteredEntries.length && filteredEntries.length > 0} onChange={handleSelectAll} className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Entrada</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Categoría</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Fuente</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Vistas</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Actualizado</th>
                <th className="w-20 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
              {filteredEntries.map(entry => {
                const SourceIcon = sourceConfig[entry.sourceType]?.icon || FileText;
                return (
                  <tr key={entry.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selectedEntries.includes(entry.id)} onChange={() => setSelectedEntries(prev => prev.includes(entry.id) ? prev.filter(id => id !== entry.id) : [...prev, entry.id])} className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[entry.status]?.bg} ${statusConfig[entry.status]?.color}`}>
                          {statusConfig[entry.status]?.label}
                        </span>
                        {entry.isFeatured && <Star className="w-4 h-4 text-yellow-500" />}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-neutral-100">{entry.title}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {entry.keywords.slice(0, 3).map(kw => (
                            <span key={kw} className="px-1.5 py-0.5 text-[10px] bg-neutral-100 dark:bg-neutral-700 text-neutral-500 rounded">{kw}</span>
                          ))}
                          {entry.keywords.length > 3 && <span className="text-[10px] text-neutral-400">+{entry.keywords.length - 3}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">{entry.category}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-xs text-neutral-500">
                        <SourceIcon className="w-3.5 h-3.5" />
                        {sourceConfig[entry.sourceType]?.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <ViewIcon className="w-3 h-3" />
                        {entry.views}
                        <ThumbsUp className="w-3 h-3 text-green-500 ml-2" />
                        {entry.helpful}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-neutral-500">
                      {new Date(entry.updatedAt).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => showFeedback(`Editando "${entry.title.slice(0, 20)}…" en modo demo.`)}
                          className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4 text-neutral-400 hover:text-primary-600" />
                        </button>
                        <button
                          onClick={() => setViewEntry(entry)}
                          className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                          title="Ver"
                        >
                          <Eye className="w-4 h-4 text-neutral-400 hover:text-neutral-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredEntries.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <BookOpen className="w-10 h-10 text-neutral-300 mb-3" />
            <p className="text-neutral-500 mb-4">No se encontraron entradas</p>
            <button
              onClick={() => showFeedback('Editor de entradas disponible en la versión completa.')}
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Crear primera entrada
            </button>
          </div>
        )}
      </motion.div>

      {/* Bulk Actions */}
      {selectedEntries.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-neutral-900 dark:bg-neutral-800 text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-4 z-50">
          <span className="text-sm font-medium">{selectedEntries.length} seleccionada{selectedEntries.length > 1 ? 's' : ''}</span>
          <div className="h-6 w-px bg-neutral-700" />
          <button onClick={() => { setSelectedEntries([]); showFeedback('Entradas activadas en modo demo.'); }} className="text-sm hover:text-primary-400 transition-colors">Activar</button>
          <button onClick={() => { setSelectedEntries([]); showFeedback('Entradas desactivadas en modo demo.'); }} className="text-sm hover:text-primary-400 transition-colors">Desactivar</button>
          <button onClick={() => { setSelectedEntries([]); showFeedback('Entradas destacadas en modo demo.'); }} className="text-sm hover:text-primary-400 transition-colors">Destacar</button>
          <button onClick={() => { setSelectedEntries([]); showFeedback('Entradas eliminadas en modo demo.'); }} className="text-sm text-danger-400 hover:text-danger-300 transition-colors">Eliminar</button>
          <button onClick={() => setSelectedEntries([])} className="p-1 hover:bg-neutral-800 rounded">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Entry View Modal */}
      {viewEntry && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[viewEntry.status]?.bg} ${statusConfig[viewEntry.status]?.color}`}>
                    {statusConfig[viewEntry.status]?.label}
                  </span>
                  {viewEntry.isFeatured && <Star className="w-4 h-4 text-yellow-500" />}
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{viewEntry.title}</h3>
                <p className="text-xs text-neutral-500 mt-1">{viewEntry.category} · {sourceConfig[viewEntry.sourceType]?.label}</p>
              </div>
              <button onClick={() => setViewEntry(null)} className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg flex-shrink-0">
                <X className="w-4 h-4 text-neutral-500" />
              </button>
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-4 mb-4">
              <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
                {viewEntry.content.length > 500 ? viewEntry.content.slice(0, 500) + '…' : viewEntry.content}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {viewEntry.keywords.map(kw => (
                <span key={kw} className="px-2 py-0.5 text-xs bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full">{kw}</span>
              ))}
            </div>

            <div className="flex items-center gap-6 py-3 border-t border-neutral-100 dark:border-neutral-700 mb-4 text-sm text-neutral-500">
              <span className="flex items-center gap-1.5">
                <ViewIcon className="w-4 h-4" />
                {viewEntry.views} vistas
              </span>
              <span className="flex items-center gap-1.5">
                <ThumbsUp className="w-4 h-4 text-green-500" />
                {viewEntry.helpful} útil
              </span>
              <span>Actualizado {new Date(viewEntry.updatedAt).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setViewEntry(null)} className="flex-1 px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                Cerrar
              </button>
              <button
                onClick={() => { setViewEntry(null); showFeedback(`Editando "${viewEntry.title.slice(0, 20)}…" en modo demo.`); }}
                className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Editar entrada
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
