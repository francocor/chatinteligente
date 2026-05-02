'use client';

import { useState } from 'react';
import { Search, User, Phone, Mail, Clock } from 'lucide-react';

export default function DashboardContactsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock contact data
  const mockContacts = [
    {
      id: 'contact-1',
      name: 'Juan Pérez',
      phone: '+56912345678',
      email: 'juan.perez@email.cl',
      channel: 'WHATSAPP',
      lastContact: 'Hoy 10:30',
      status: 'ACTIVE'
    },
    {
      id: 'contact-2',
      name: 'María López',
      phone: '+56998765432',
      email: 'maria.lopez@email.cl',
      channel: 'WEB',
      lastContact: 'Ayer 15:45',
      status: 'ACTIVE'
    },
    {
      id: 'contact-3',
      name: 'Carlos Mendoza',
      phone: '+56911122334',
      email: 'carlos.mendoza@email.cl',
      channel: 'TELEGRAM',
      lastContact: '28/04 09:15',
      status: 'INACTIVE'
    },
    {
      id: 'contact-4',
      name: 'Ana Silva',
      phone: '+56955566778',
      email: 'ana.silva@email.cl',
      channel: 'WHATSAPP',
      lastContact: '27/04 16:20',
      status: 'ACTIVE'
    }
  ];

  const filteredContacts = mockContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Contactos</h1>
          <p className="text-neutral-500 mt-1">
            Gestión de contactos y comunicaciones
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar contactos..."
              className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: mockContacts.length },
          { label: 'Activos', value: filteredContacts.filter(c => c.status === 'ACTIVE').length },
          { label: 'Inactivos', value: filteredContacts.filter(c => c.status === 'INACTIVE').length },
          { label: 'Hoy', value: filteredContacts.filter(c => c.lastContact.includes('Hoy')).length }
        ].map(stat => (
          <div key={stat.label} className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 p-4">
            <p className="text-xs text-neutral-500">{stat.label}</p>
            <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Contacts List */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 overflow-hidden">
        {filteredContacts.length > 0 ? (
          <div className="divide-y divide-neutral-100">
            {filteredContacts.map(contact => (
              <div key={contact.id} className="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-neutral-900 dark:text-neutral-100">{contact.name}</h4>
                  <div className="flex flex-wrap gap-2 mt-1 text-sm">
                    <span className="px-2 py-0.5 rounded-full bg-neutral-100">{contact.channel}</span>
                    <span className={`px-2 py-0.5 rounded-full ${contact.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {contact.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-500 mt-1">
                    {contact.phone} • {contact.email}
                  </p>
                </div>
                <div className="text-sm text-neutral-500">
                  {contact.lastContact}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <Search className="w-10 h-10 text-neutral-300 mb-3" />
            <p className="text-neutral-500">No se encontraron contactos</p>
          </div>
        )}
      </div>
    </div>
  );
}