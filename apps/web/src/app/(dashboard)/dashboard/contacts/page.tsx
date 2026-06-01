'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, UserPlus, Phone, Mail, Globe, MessageSquare, Users, X, CheckCircle, Layers } from 'lucide-react';

const mockContacts = [
  { id: 'c-1', name: 'Juan Pérez', email: 'juan.perez@empresa.com', phone: '+54 11 4567-8901', channel: 'WHATSAPP', status: 'ACTIVE', conversations: 8, lastContact: 'Hoy 10:32', satisfaction: 4.8 },
  { id: 'c-2', name: 'María López', email: 'm.lopez@empresa.com', phone: '+54 11 2345-6789', channel: 'WEB', status: 'ACTIVE', conversations: 3, lastContact: 'Ayer 15:45', satisfaction: 4.5 },
  { id: 'c-3', name: 'Carlos Mendoza', email: 'carlos.m@gmail.com', phone: '+54 11 1122-3344', channel: 'TELEGRAM', status: 'INACTIVE', conversations: 1, lastContact: 'Hace 14 días', satisfaction: null },
  { id: 'c-4', name: 'Ana Silva', email: 'ana.silva@empresa.com', phone: '+54 351 456-7890', channel: 'WHATSAPP', status: 'ACTIVE', conversations: 12, lastContact: 'Hoy 08:15', satisfaction: 5.0 },
  { id: 'c-5', name: 'Roberto Díaz', email: 'r.diaz@empresa.com', phone: '+54 261 789-0123', channel: 'EMAIL', status: 'ACTIVE', conversations: 5, lastContact: 'Hace 2 días', satisfaction: 4.2 },
  { id: 'c-6', name: 'Valentina Rojas', email: 'v.rojas@empresa.com', phone: '+54 11 9988-7766', channel: 'INSTAGRAM', status: 'ACTIVE', conversations: 2, lastContact: 'Hace 3 días', satisfaction: 4.7 },
];

const channelConfig: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  WHATSAPP: { label: 'WhatsApp', icon: Phone, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
  WEB: { label: 'Web', icon: Globe, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  EMAIL: { label: 'Email', icon: Mail, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  TELEGRAM: { label: 'Telegram', icon: MessageSquare, color: 'text-sky-600', bg: 'bg-sky-50 dark:bg-sky-900/20' },
  INSTAGRAM: { label: 'Instagram', icon: Layers, color: 'text-pink-600', bg: 'bg-pink-50 dark:bg-pink-900/20' },
  FACEBOOK: { label: 'Facebook', icon: Globe, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
};

type Contact = typeof mockContacts[0];

export default function DashboardContactsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', email: '', phone: '', channel: 'WHATSAPP' });
  const [formSaved, setFormSaved] = useState(false);

  const filtered = mockContacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  const activeCount = mockContacts.filter((c) => c.status === 'ACTIVE').length;
  const withOpenConv = mockContacts.filter((c) => c.conversations > 0 && c.status === 'ACTIVE').length;

  const handleNewContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSaved(true);
    setNewContact({ name: '', email: '', phone: '', channel: 'WHATSAPP' });
    setTimeout(() => {
      setFormSaved(false);
      setShowNewForm(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Contactos</h1>
          <p className="text-neutral-500 mt-1">Centralizá la información de tus clientes y consultas.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-xs font-medium">
            Módulo CRM en modo demo
          </span>
          <button
            onClick={() => setShowNewForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium text-sm transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Nuevo Contacto
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Contactos', value: '1.248', Icon: Users, color: 'text-primary-600', bg: 'bg-primary-50 dark:bg-primary-900/20' },
          { label: 'Nuevos este mes', value: '38', Icon: UserPlus, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Activos', value: activeCount.toString(), Icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Con conv. abiertas', value: withOpenConv.toString(), Icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
        ].map(({ label, value, Icon, color, bg }) => (
          <div key={label} className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className="text-xs text-neutral-500">{label}</p>
                <p className={`text-xl font-bold ${color}`}>{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, email o teléfono..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Contacto</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Teléfono</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Canal</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Convs.</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Último contacto</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
              {filtered.map((contact) => {
                const ch = channelConfig[contact.channel] ?? channelConfig.WEB;
                const ChIcon = ch.icon;
                return (
                  <tr key={contact.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-sm font-semibold text-primary-600 dark:text-primary-300 flex-shrink-0">
                          {contact.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{contact.name}</p>
                          <p className="text-xs text-neutral-500">{contact.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">{contact.phone}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${ch.bg} ${ch.color}`}>
                        <ChIcon className="w-3 h-3" />
                        {ch.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${contact.status === 'ACTIVE' ? 'bg-green-50 text-green-700 dark:bg-green-900/20' : 'bg-neutral-100 text-neutral-500'}`}>
                        {contact.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">{contact.conversations}</td>
                    <td className="px-4 py-3 text-xs text-neutral-500">{contact.lastContact}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedContact(contact)}
                        className="px-3 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800 transition-colors"
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <Users className="w-10 h-10 text-neutral-300 mb-3" />
            <p className="text-neutral-500">No se encontraron contactos</p>
          </div>
        )}
      </div>

      {/* Contact Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-lg font-bold text-primary-600 dark:text-primary-300">
                  {selectedContact.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{selectedContact.name}</h3>
                  <p className="text-sm text-neutral-500">{selectedContact.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedContact(null)}
                className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg"
              >
                <X className="w-4 h-4 text-neutral-500" />
              </button>
            </div>

            <div className="space-y-3 mb-5">
              {[
                { label: 'Teléfono', value: selectedContact.phone },
                { label: 'Canal preferido', value: channelConfig[selectedContact.channel]?.label ?? selectedContact.channel },
                { label: 'Conversaciones', value: selectedContact.conversations.toString() },
                { label: 'Satisfacción', value: selectedContact.satisfaction ? `${selectedContact.satisfaction} / 5.0` : '—' },
                { label: 'Último contacto', value: selectedContact.lastContact },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-neutral-500">{label}</span>
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">{value}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedContact(null)}
                className="flex-1 px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
              >
                Cerrar
              </button>
              <Link
                href="/dashboard/conversations"
                onClick={() => setSelectedContact(null)}
                className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors text-center"
              >
                Ver conversaciones
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* New Contact Modal */}
      {showNewForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Nuevo Contacto</h3>
              <button onClick={() => setShowNewForm(false)} className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg">
                <X className="w-4 h-4 text-neutral-500" />
              </button>
            </div>

            {formSaved ? (
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 mb-4">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">Contacto creado en modo demo.</p>
              </div>
            ) : (
              <form onSubmit={handleNewContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">Nombre completo</label>
                  <input
                    type="text"
                    value={newContact.name}
                    onChange={(e) => setNewContact((p) => ({ ...p, name: e.target.value }))}
                    required
                    placeholder="Ej: Lucía Fernández"
                    className="w-full px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={newContact.email}
                    onChange={(e) => setNewContact((p) => ({ ...p, email: e.target.value }))}
                    required
                    placeholder="lucia@empresa.com"
                    className="w-full px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={newContact.phone}
                    onChange={(e) => setNewContact((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="+54 11 0000-0000"
                    className="w-full px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">Canal preferido</label>
                  <select
                    value={newContact.channel}
                    onChange={(e) => setNewContact((p) => ({ ...p, channel: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="WHATSAPP">WhatsApp</option>
                    <option value="WEB">Web</option>
                    <option value="EMAIL">Email</option>
                    <option value="TELEGRAM">Telegram</option>
                    <option value="INSTAGRAM">Instagram</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewForm(false)}
                    className="flex-1 px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Crear contacto
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
