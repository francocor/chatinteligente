'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Star,
  MoreHorizontal,
  Tag,
  ChevronRight,
  ExternalLink,
  FileText,
  MessageSquare,
  GitBranch,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Eye as ViewIcon,
} from 'lucide-react';

import { mockKnowledgeEntries, knowledgeStats } from '@/data/mocks/knowledge';

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  ACTIVE: { label: 'Activo', color: 'text-green-600', bg: 'bg-green-50' },
  DRAFT: { label: 'Borrador', color: 'text-neutral-500', bg: 'bg-neutral-50' },
  REVIEW: { label: 'Revisión', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  ARCHIVED: { label: 'Archivado', color: 'text-neutral-400', bg: 'bg-neutral-100' },
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

  const categoryList = [...new Set(mockKnowledgeEntries.map(e => e.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Base de Conocimiento
          </h1>
          <p className="text-neutral-500 mt-1">
            FAQs, artículos y documentación para el chatbot
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/knowledge/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium"
          >
            <Plus className="w-5 h-5" />
            Nueva Entrada
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total', value: knowledgeStats.total },
          { label: 'Activas', value: knowledgeStats.active },
          { label: 'Activar', value: knowledgeStats.featured, color: 'text-yellow-600' },
          { label: 'Borrador', value: knowledgeStats.drafts },
          { label: 'Vistas', value: knowledgeStats.totalViews },
          { label: 'Útiles', value: knowledgeStats.totalHelpful },
        ].map(stat => (
          <div key={stat.label} className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 p-4">
            <p className="text-xs text-neutral-500">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color || 'text-neutral-900'}`}>{stat.value}</p>
          </div>
        ))}
      </div>

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
                placeholder="Buscar por título, contenido o keywords..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-200 rounded-lg"
              />
            </div>
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="text-sm border rounded-lg px-3 py-2">
            <option value="all">Todas las categorías</option>
            {categoryList.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="text-sm border rounded-lg px-3 py-2">
            <option value="all">Todos los estados</option>
            {Object.keys(statusConfig).map(s => <option key={s} value={s}>{statusConfig[s].label}</option>)}
          </select>
          <div className="ml-auto text-sm text-neutral-500">{filteredEntries.length} entradas</div>
        </div>
      </div>

      {/* Knowledge Entries Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="w-10 px-4 py-3">
                  <input type="checkbox" checked={selectedEntries.length === filteredEntries.length && filteredEntries.length > 0} onChange={handleSelectAll} className="w-4 h-4 rounded" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Entrada</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Categoría</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Fuente</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Vistas</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Actualizado</th>
                <th className="w-16 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredEntries.map(entry => {
                const SourceIcon = sourceConfig[entry.sourceType]?.icon || FileText;
                return (
                  <tr key={entry.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selectedEntries.includes(entry.id)} onChange={(e) => { setSelectedEntries(prev => prev.includes(entry.id) ? prev.filter(id => id !== entry.id) : [...prev, entry.id]); }} className="w-4 h-4 rounded" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${statusConfig[entry.status]?.bg} ${statusConfig[entry.status]?.color}`}>
                          {statusConfig[entry.status]?.label}
                        </span>
                        {entry.isFeatured && <Star className="w-4 h-4 text-yellow-500" />}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-neutral-900">{entry.title}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {entry.keywords.slice(0, 3).map(kw => (
                            <span key={kw} className="px-1.5 py-0.5 text-[10px] bg-neutral-100 rounded">{kw}</span>
                          ))}
                          {entry.keywords.length > 3 && <span className="text-[10px] text-neutral-400">+{entry.keywords.length - 3}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600">{entry.category}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-xs">
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
                        <Link href={`/dashboard/knowledge/${entry.id}/edit`} className="p-2 hover:bg-neutral-100 rounded-lg">
                          <Edit className="w-4 h-4 text-neutral-400" />
                        </Link>
                        <Link href={`/knowledge/preview/${entry.id}`} className="p-2 hover:bg-neutral-100 rounded-lg">
                          <Eye className="w-4 h-4 text-neutral-400" />
                        </Link>
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
            <p className="text-neutral-500">No se encontraron entradas</p>
            <Link href="/dashboard/knowledge/new" className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg">
              Crear primera entrada
            </Link>
          </div>
        )}
      </motion.div>

      {/* Bulk Actions */}
      {selectedEntries.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-neutral-900 text-white px-6 py-4 rounded-xl flex items-center gap-4 z-50">
          <span className="text-sm font-medium">{selectedEntries.length} seleccionada{selectedEntries.length > 1 ? 's' : ''}</span>
          <div className="h-6 w-px bg-neutral-700" />
          <button className="text-sm hover:text-primary-400">Activar</button>
          <button className="text-sm hover:text-primary-400">Desactivar</button>
          <button className="text-sm hover:text-primary-400">Destacar</button>
          <button className="text-sm text-danger-400 hover:text-danger-300">Eliminar</button>
        </motion.div>
      )}
    </div>
  );
}