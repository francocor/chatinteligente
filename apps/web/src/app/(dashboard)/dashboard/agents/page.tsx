'use client';

import { useState } from 'react';
import { User, Clock, MessageCircle, CheckCircle2, TrendingUp, TrendingDown } from 'lucide-react';

export default function DashboardAgentsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock agent data
  const mockAgents = [
    {
      id: 'agent-1',
      name: 'María González',
      role: 'Supervisor',
      status: 'ONLINE',
      avatar: 'https://i.pravatar.cc/150?u=maria',
      conversations: 456,
      csat: 4.6,
      avgResponseTime: '28s',
      trend: 'up'
    },
    {
      id: 'agent-2',
      name: 'Carlos Mendoza',
      role: 'Agente Senior',
      status: 'BUSY',
      avatar: 'https://i.pravatar.cc/150?u=carlos',
      conversations: 389,
      csat: 4.4,
      avgResponseTime: '35s',
      trend: 'stable'
    },
    {
      id: 'agent-3',
      name: 'Ana Silva',
      role: 'Agente',
      status: 'OFFLINE',
      avatar: 'https://i.pravatar.cc/150?u=ana',
      conversations: 312,
      csat: 4.7,
      avgResponseTime: '32s',
      trend: 'up'
    },
    {
      id: 'agent-4',
      name: 'Roberto Díaz',
      role: 'Agente',
      status: 'ONLINE',
      avatar: 'https://i.pravatar.cc/150?u=roberto',
      conversations: 287,
      csat: 4.2,
      avgResponseTime: '41s',
      trend: 'down'
    },
    {
      id: 'agent-5',
      name: 'Patricia López',
      role: 'Agente',
      status: 'ONLINE',
      avatar: 'https://i.pravatar.cc/150?u=patricia',
      conversations: 234,
      csat: 4.5,
      avgResponseTime: '38s',
      trend: 'up'
    }
  ];

  const filteredAgents = mockAgents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Agentes</h1>
          <p className="text-neutral-500 mt-1">
            Gestión y rendimiento del equipo de atención
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar agentes..."
              className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Agentes', value: mockAgents.length },
          { label: 'En Línea', value: filteredAgents.filter(a => a.status === 'ONLINE').length },
          { label: 'Ocupados', value: filteredAgents.filter(a => a.status === 'BUSY').length },
          { label: 'Fuera de Línea', value: filteredAgents.filter(a => a.status === 'OFFLINE').length }
        ].map(stat => (
          <div key={stat.label} className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 p-4">
            <p className="text-xs text-neutral-500">{stat.label}</p>
            <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Agents Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Agente</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Rol</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Conversaciones</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">CSAT</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Tiempo Resp.</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Tendencia</th>
                <th className="w-16 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredAgents.length > 0 ? (
                filteredAgents.map(agent => (
                  <tr key={agent.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-xs font-medium text-primary-600">
                        {agent.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-900">{agent.name}</p>
                        <p className="text-xs text-neutral-500">{agent.role}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        agent.role.includes('Supervisor') ? 'bg-blue-100 text-blue-800' :
                        agent.role.includes('Senior') ? 'bg-purple-100 text-purple-800' :
                        'bg-neutral-100 text-neutral-800'
                      }`}>
                        {agent.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        agent.status === 'ONLINE' ? 'bg-green-100 text-green-800' :
                        agent.status === 'BUSY' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {agent.status === 'ONLINE' ? 'En Línea' : agent.status === 'BUSY' ? 'Ocupado' : 'Fuera de Línea'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{agent.conversations}</td>
                    <td className="px-4 py-3 text-sm font-medium">{agent.csat}</td>
                    <td className="px-4 py-3 text-sm font-medium">{agent.avgResponseTime}</td>
                    <td className="px-4 py-3">
                      {agent.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : agent.trend === 'down' ? (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      ) : (
                        <span className="w-4 h-4 text-neutral-500">→</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => console.log('Ver detalle agent')} className="p-1 hover:bg-neutral-100 rounded-lg">
                          <User className="w-4 h-4 text-neutral-400" />
                        </button>
                        <button onClick={() => console.log('Editar agent')} className="p-1 hover:bg-neutral-100 rounded-lg">
                          <MessageCircle className="w-4 h-4 text-neutral-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-4 py-3 text-center text-neutral-500">
                    No se encontraron agentes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}