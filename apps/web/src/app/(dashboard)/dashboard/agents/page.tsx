'use client';

import { useState } from 'react';
import { User, Clock, MessageCircle, CheckCircle2, TrendingUp, TrendingDown, X, CheckCircle, Star, BarChart3 } from 'lucide-react';

type Agent = {
  id: string;
  name: string;
  role: string;
  status: string;
  avatar: string;
  conversations: number;
  csat: number;
  avgResponseTime: string;
  trend: string;
};

export default function DashboardAgentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [agentFeedback, setAgentFeedback] = useState<string | null>(null);

  const mockAgents: Agent[] = [
    { id: 'agent-1', name: 'María González', role: 'Supervisor', status: 'ONLINE', avatar: '', conversations: 456, csat: 4.6, avgResponseTime: '28s', trend: 'up' },
    { id: 'agent-2', name: 'Carlos Mendoza', role: 'Agente Senior', status: 'BUSY', avatar: '', conversations: 389, csat: 4.4, avgResponseTime: '35s', trend: 'stable' },
    { id: 'agent-3', name: 'Ana Silva', role: 'Agente', status: 'OFFLINE', avatar: '', conversations: 312, csat: 4.7, avgResponseTime: '32s', trend: 'up' },
    { id: 'agent-4', name: 'Roberto Díaz', role: 'Agente', status: 'ONLINE', avatar: '', conversations: 287, csat: 4.2, avgResponseTime: '41s', trend: 'down' },
    { id: 'agent-5', name: 'Patricia López', role: 'Agente', status: 'ONLINE', avatar: '', conversations: 234, csat: 4.5, avgResponseTime: '38s', trend: 'up' },
  ];

  const filteredAgents = mockAgents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showFeedback = (msg: string) => {
    setAgentFeedback(msg);
    setTimeout(() => setAgentFeedback(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Feedback toast */}
      {agentFeedback && (
        <div className="fixed top-6 right-6 flex items-center gap-2 bg-neutral-900 text-white px-4 py-3 rounded-xl shadow-xl text-sm font-medium z-50">
          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
          {agentFeedback}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Agentes</h1>
          <p className="text-neutral-500 mt-1">Gestión y rendimiento del equipo de atención</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar agentes..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Agentes', value: mockAgents.length, color: 'text-neutral-900 dark:text-neutral-100' },
          { label: 'En Línea', value: mockAgents.filter(a => a.status === 'ONLINE').length, color: 'text-green-600' },
          { label: 'Ocupados', value: mockAgents.filter(a => a.status === 'BUSY').length, color: 'text-yellow-600' },
          { label: 'Fuera de Línea', value: mockAgents.filter(a => a.status === 'OFFLINE').length, color: 'text-neutral-400' },
        ].map(stat => (
          <div key={stat.label} className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4">
            <p className="text-xs text-neutral-500">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Agents Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Agente</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Rol</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Conversaciones</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">CSAT</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Tiempo Resp.</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Tendencia</th>
                <th className="w-20 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
              {filteredAgents.length > 0 ? (
                filteredAgents.map(agent => (
                  <tr key={agent.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-xs font-semibold text-primary-600 dark:text-primary-300">
                          {agent.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{agent.name}</p>
                          <p className="text-xs text-neutral-500">{agent.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        agent.role.includes('Supervisor') ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                        agent.role.includes('Senior') ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                        'bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300'
                      }`}>
                        {agent.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                        agent.status === 'ONLINE' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                        agent.status === 'BUSY' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        'bg-neutral-100 text-neutral-500 dark:bg-neutral-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          agent.status === 'ONLINE' ? 'bg-green-500' :
                          agent.status === 'BUSY' ? 'bg-yellow-500' : 'bg-neutral-400'
                        }`} />
                        {agent.status === 'ONLINE' ? 'En Línea' : agent.status === 'BUSY' ? 'Ocupado' : 'Fuera de Línea'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-neutral-900 dark:text-neutral-100">{agent.conversations}</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${agent.csat >= 4.5 ? 'text-green-600' : agent.csat >= 4.0 ? 'text-blue-600' : 'text-yellow-600'}`}>
                        {agent.csat}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">{agent.avgResponseTime}</td>
                    <td className="px-4 py-3">
                      {agent.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : agent.trend === 'down' ? (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      ) : (
                        <span className="text-neutral-400 text-sm">→</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedAgent(agent)}
                          className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                          title="Ver perfil"
                        >
                          <User className="w-4 h-4 text-neutral-400 hover:text-primary-600" />
                        </button>
                        <button
                          onClick={() => showFeedback(`Abriendo conversaciones de ${agent.name.split(' ')[0]} en modo demo.`)}
                          className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                          title="Ver conversaciones"
                        >
                          <MessageCircle className="w-4 h-4 text-neutral-400 hover:text-primary-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-neutral-500">
                    No se encontraron agentes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Agent Detail Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-2xl font-bold text-primary-600 dark:text-primary-300">
                  {selectedAgent.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{selectedAgent.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    selectedAgent.role.includes('Supervisor') ? 'bg-blue-100 text-blue-800' :
                    selectedAgent.role.includes('Senior') ? 'bg-purple-100 text-purple-800' :
                    'bg-neutral-100 text-neutral-700'
                  }`}>{selectedAgent.role}</span>
                </div>
              </div>
              <button onClick={() => setSelectedAgent(null)} className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg">
                <X className="w-4 h-4 text-neutral-500" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              {[
                { label: 'Conversaciones', value: selectedAgent.conversations.toString(), icon: MessageCircle, color: 'text-primary-600', bg: 'bg-primary-50 dark:bg-primary-900/20' },
                { label: 'CSAT', value: `${selectedAgent.csat} / 5.0`, icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
                { label: 'Tiempo de resp.', value: selectedAgent.avgResponseTime, icon: Clock, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
                { label: 'Tendencia', value: selectedAgent.trend === 'up' ? 'Subiendo' : selectedAgent.trend === 'down' ? 'Bajando' : 'Estable', icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className={`p-3 rounded-xl ${bg}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-4 h-4 ${color}`} />
                    <span className="text-xs text-neutral-500">{label}</span>
                  </div>
                  <p className={`text-lg font-bold ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between py-2 border-t border-neutral-100 dark:border-neutral-700 mb-4">
              <span className="text-sm text-neutral-500">Estado actual</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                selectedAgent.status === 'ONLINE' ? 'bg-green-100 text-green-800' :
                selectedAgent.status === 'BUSY' ? 'bg-yellow-100 text-yellow-800' :
                'bg-neutral-100 text-neutral-500'
              }`}>
                {selectedAgent.status === 'ONLINE' ? 'En Línea' : selectedAgent.status === 'BUSY' ? 'Ocupado' : 'Fuera de Línea'}
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedAgent(null)}
                className="flex-1 px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={() => { setSelectedAgent(null); showFeedback(`Asignación de ${selectedAgent.name.split(' ')[0]} actualizada en modo demo.`); }}
                className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Gestionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
