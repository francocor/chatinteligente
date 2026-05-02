'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  MessageSquare,
  Bot,
  Clock,
  Star,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  Calendar,
  ChevronDown,
  PieChart,
  Activity,
  CheckCircle,
  AlertTriangle,
  Globe,
  Phone,
  Mail,
  MessageCircle,
} from 'lucide-react';

import { mockDashboardKPIs, mockDailyData, mockChannelMetrics, mockTopicMetrics, mockIntentMetrics, mockAgentPerformance, strategicKPIs, mockHourlyData } from '@/data/mocks/analytics';

const channelIcons: Record<string, any> = {
  WHATSAPP: Phone,
  WEB: Globe,
  EMAIL: Mail,
  INSTAGRAM: MessageCircle,
  FACEBOOK: MessageCircle,
  TELEGRAM: MessageCircle,
};

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('last30days');
  const [channel, setChannel] = useState('all');

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return seconds + 's';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Analíticas Avanzadas
          </h1>
          <p className="text-neutral-500 mt-1">
            Métricas y estadísticas del sistema de atención
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg">
            <Calendar className="w-4 h-4 text-neutral-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="text-sm bg-transparent border-none focus:outline-none"
            >
              <option value="last7days">Últimos 7 días</option>
              <option value="last30days">Últimos 30 días</option>
              <option value="thisMonth">Este mes</option>
              <option value="lastMonth">Mes anterior</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50">
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* KPIs Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {mockDashboardKPIs.map((kpi) => (
          <motion.div
            key={kpi.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-neutral-500">{kpi.label}</span>
              {kpi.trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
            </div>
            <p className="text-2xl font-bold text-neutral-900">{kpi.value}</p>
            <div className="flex items-center gap-1 mt-1">
              <span className={`text-xs ${kpi.changePercentage! > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {kpi.changePercentage! > 0 ? '+' : ''}{kpi.changePercentage?.toFixed(1)}%
              </span>
              <span className="text-xs text-neutral-400">vs período anterior</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations Trend */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-neutral-900">Conversaciones por Día</h3>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-primary-500" />
                Conversaciones
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-green-500" />
                Resueltas
              </span>
            </div>
          </div>
          <div className="h-64 flex items-end gap-1">
            {mockDailyData.slice(-14).map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-primary-500 rounded-t hover:bg-primary-600 transition-colors"
                  style={{ height: `${(day.conversations / 150) * 100}%` }}
                />
                <div
                  className="w-full bg-green-500 rounded-t"
                  style={{ height: `${(day.resolved / 150) * 100}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-neutral-400">
            {mockDailyData.slice(-14).map((day, i) => (
              <span key={i}>{new Date(day.date).getDate()}</span>
            ))}
          </div>
        </div>

        {/* Channel Distribution */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 p-6">
          <h3 className="font-semibold text-neutral-900 mb-4">Por Canal</h3>
          <div className="space-y-4">
            {mockChannelMetrics.slice(0, 5).map((ch, i) => {
              const Icon = channelIcons[ch.channel] || Globe;
              return (
                <div key={ch.channel}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-neutral-500" />
                      <span className="text-sm text-neutral-700">{ch.channel}</span>
                    </div>
                    <span className="text-sm font-medium">{ch.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${ch.percentage}%` }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="h-full bg-primary-500 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Distribution */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 p-6">
          <h3 className="font-semibold text-neutral-900 mb-4">Distribución Horaria</h3>
          <div className="h-48 flex items-end gap-1">
            {mockHourlyData.map((hour, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(hour.conversations / 110) * 100}%` }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="w-full bg-cyan-500 rounded-t hover:bg-cyan-600"
                />
                <span className="text-[10px] text-neutral-400 mt-1">{hour.hour}:00</span>
              </div>
            ))}
          </div>
        </div>

        {/* Topics */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 p-6">
          <h3 className="font-semibold text-neutral-900 mb-4">Temas más Consultados</h3>
          <div className="space-y-3">
            {mockTopicMetrics.slice(0, 6).map((topic, i) => (
              <div key={topic.topic} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center text-xs font-medium">
                    {i + 1}
                  </span>
                  <span className="text-sm text-neutral-700">{topic.topic}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500 rounded-full"
                      style={{ width: `${topic.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-neutral-500 w-12 text-right">{topic.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Intents */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200">
            <h3 className="font-semibold">Intenciones Detectadas</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-900/50">
                <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500">Intención</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-neutral-500">Cantidad</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-neutral-500">%</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-neutral-500">Confianza</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-neutral-500">Resolución</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {mockIntentMetrics.slice(0, 8).map((intent) => (
                <tr key={intent.intent}>
                  <td className="px-4 py-3 text-sm">{intent.intent}</td>
                  <td className="px-4 py-3 text-sm text-right font-medium">{intent.count}</td>
                  <td className="px-4 py-3 text-sm text-right text-neutral-500">{intent.percentage.toFixed(1)}%</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      intent.avgConfidence > 0.9 ? 'bg-green-100 text-green-700' :
                      intent.avgConfidence > 0.8 ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {(intent.avgConfidence * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={`${intent.resolutionRate > 90 ? 'text-green-600' : intent.resolutionRate > 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {intent.resolutionRate.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Agents */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200">
            <h3 className="font-semibold">Rendimiento de Agentes</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-900/50">
                <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500">Agente</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-neutral-500">Conversaciones</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-neutral-500">CSAT</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-neutral-500">Tiempo Prom.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {mockAgentPerformance.slice(0, 8).map((agent) => (
                <tr key={agent.agentId}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-xs font-medium text-primary-600">
                        {agent.agentName.charAt(0)}
                      </div>
                      <span className="text-sm">{agent.agentName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-medium">{agent.conversations}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      agent.csatScore >= 4.5 ? 'bg-green-100 text-green-700' :
                      agent.csatScore >= 4.0 ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {agent.csatScore.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-neutral-500">{formatTime(agent.avgResponseTime)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strategic KPIs Section */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 p-6">
        <h3 className="font-semibold text-neutral-900 mb-6">KPIs Estratégicos</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Efficiency */}
          <div>
            <h4 className="text-sm font-medium text-neutral-500 mb-3">Eficiencia</h4>
            <div className="space-y-3">
              {strategicKPIs.eficiencia.map((kpi, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700">{kpi.metric}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{kpi.current}{kpi.unit}</span>
                    <span className={`w-2 h-2 rounded-full ${
                      kpi.status === 'good' ? 'bg-green-500' :
                      kpi.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Satisfaction */}
          <div>
            <h4 className="text-sm font-medium text-neutral-500 mb-3">Satisfacción</h4>
            <div className="space-y-3">
              {strategicKPIs.satisfaccion.map((kpi, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700">{kpi.metric}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{kpi.current}{kpi.unit}</span>
                    <span className={`w-2 h-2 rounded-full ${
                      kpi.status === 'good' ? 'bg-green-500' :
                      kpi.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Automation */}
          <div>
            <h4 className="text-sm font-medium text-neutral-500 mb-3">Automatización</h4>
            <div className="space-y-3">
              {strategicKPIs.automatizacion.map((kpi, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700">{kpi.metric}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{kpi.current}{kpi.unit}</span>
                    <span className={`w-2 h-2 rounded-full ${
                      kpi.status === 'good' ? 'bg-green-500' :
                      kpi.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Operations */}
          <div>
            <h4 className="text-sm font-medium text-neutral-500 mb-3">Operacional</h4>
            <div className="space-y-3">
              {strategicKPIs.operasional.map((kpi, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700">{kpi.metric}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{kpi.current}{kpi.unit}</span>
                    <span className={`w-2 h-2 rounded-full ${
                      kpi.status === 'good' ? 'bg-green-500' :
                      kpi.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}