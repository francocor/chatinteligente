'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  MapPin,
  Users,
  Clock,
  MessageCircle,
  Headphones,
  GitBranch,
  Bot,
  ClipboardList,
  Plug,
  Bell,
  Palette,
  Save,
  Loader2,
  ChevronRight,
  Check,
  AlertCircle,
} from 'lucide-react';
import {
  CompanySettings,
  SETTINGS_SECTIONS,
  CompanyInfo,
  BrandingSettings,
  Location,
  DepartmentSettings,
  WorkingHoursSettings,
  ChannelSettings,
  AgentSettings,
  RoutingRules,
  BotSettings,
  SurveySettings,
  IntegrationSettings,
  NotificationSettings
} from '@/types/settings';
import {
  mockCompanySettings,
  mockCompanyInfo,
  mockBranding,
  mockLocations,
  mockDepartments,
  mockWorkingHours,
  mockChannels,
  mockAgentSettings,
  mockRouting,
  mockBotSettings,
  mockSurveys,
  mockIntegrations,
  mockNotificationSettings,
} from '@/data/mocks/settings';

const sectionIcons: Record<string, any> = {
  company: Building2,
  locations: MapPin,
  departments: Users,
  schedule: Clock,
  channels: MessageCircle,
  agents: Headphones,
  routing: GitBranch,
  bot: Bot,
  surveys: ClipboardList,
  integrations: Plug,
  notifications: Bell,
  branding: Palette,
};

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('company');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [settings, setSettings] = useState<CompanySettings>(mockCompanySettings);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <div className="w-72 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 flex flex-col">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
          <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
            Configuración
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Configura tu empresa
          </p>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-2">
          {SETTINGS_SECTIONS.map((section) => {
            const Icon = sectionIcons[section.id] || Building2;
            const isActive = activeSection === section.id;
            
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-neutral-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{section.label}</p>
                  <p className="text-xs text-neutral-400 truncate">{section.description}</p>
                </div>
                <ChevronRight className={`w-4 h-4 opacity-0 ${isActive ? 'opacity-100' : ''}`} />
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Guardando...
              </>
            ) : saved ? (
              <>
                <Check className="w-4 h-4" />
                Guardado
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Guardar cambios
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-neutral-50 dark:bg-neutral-900">
        <AnimatePresence mode="wait">
          {activeSection === 'company' && (
            <CompanySection
              key="company"
              info={settings.company}
              onChange={(info) => setSettings({ ...settings, company: info })}
            />
          )}
          {activeSection === 'locations' && (
            <LocationsSection
              key="locations"
              locations={settings.locations}
              onChange={(locations) => setSettings({ ...settings, locations })}
            />
          )}
          {activeSection === 'departments' && (
            <DepartmentsSection
              key="departments"
              departments={settings.departments}
              onChange={(departments) => setSettings({ ...settings, departments })}
            />
          )}
          {activeSection === 'schedule' && (
            <ScheduleSection
              key="schedule"
              workingHours={settings.workingHours}
              onChange={(workingHours) => setSettings({ ...settings, workingHours })}
            />
          )}
          {activeSection === 'channels' && (
            <ChannelsSection
              key="channels"
              channels={settings.channels}
              onChange={(channels) => setSettings({ ...settings, channels })}
            />
          )}
          {activeSection === 'agents' && (
            <AgentsSection
              key="agents"
              agents={settings.agents}
              onChange={(agents) => setSettings({ ...settings, agents })}
            />
          )}
          {activeSection === 'routing' && (
            <RoutingSection
              key="routing"
              routing={settings.routing}
              onChange={(routing) => setSettings({ ...settings, routing })}
            />
          )}
          {activeSection === 'bot' && (
            <BotSection
              key="bot"
              bot={settings.bot}
              onChange={(bot) => setSettings({ ...settings, bot })}
            />
          )}
          {activeSection === 'surveys' && (
            <SurveysSection
              key="surveys"
              surveys={settings.surveys}
              onChange={(surveys) => setSettings({ ...settings, surveys })}
            />
          )}
          {activeSection === 'integrations' && (
            <IntegrationsSection
              key="integrations"
              integrations={settings.integrations}
              onChange={(integrations) => setSettings({ ...settings, integrations })}
            />
          )}
          {activeSection === 'notifications' && (
            <NotificationsSection
              key="notifications"
              notifications={settings.notifications}
              onChange={(notifications) => setSettings({ ...settings, notifications })}
            />
          )}
          {activeSection === 'branding' && (
            <BrandingSection
              key="branding"
              branding={settings.branding}
              onChange={(branding) => setSettings({ ...settings, branding })}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ===========================================================
// COMPANY SECTION
// ===========================================================

function CompanySection({ info, onChange }: { info: CompanyInfo; onChange: (info: CompanyInfo) => void }) {
  const [form, setForm] = useState(info);

  const handleChange = (field: keyof CompanyInfo, value: string) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    onChange(updated);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-3xl"
    >
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-neutral-900">Información de la Empresa</h2>
        <p className="text-sm text-neutral-500">Datos generales de tu empresa</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Nombre</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">RUT</label>
            <input
              type="text"
              value={form.rut || ''}
              onChange={(e) => handleChange('rut', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="XX.XXX.XXX-X"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Razón Social</label>
          <input
            type="text"
            value={form.legalName || ''}
            onChange={(e) => handleChange('legalName', e.target.value)}
            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Industria</label>
            <select
              value={form.industry || ''}
              onChange={(e) => handleChange('industry', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Seleccionar...</option>
              <option value="healthcare">Salud</option>
              <option value="retail">Comercio</option>
              <option value="banking">Banca y Finanzas</option>
              <option value="telecom">Telecomunicaciones</option>
              <option value="education">Educación</option>
              <option value="other">Otro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Sitio Web</label>
            <input
              type="url"
              value={form.website || ''}
              onChange={(e) => handleChange('website', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Teléfono</label>
            <input
              type="tel"
              value={form.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Dirección</label>
          <input
            type="text"
            value={form.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Ciudad</label>
            <input
              type="text"
              value={form.city || ''}
              onChange={(e) => handleChange('city', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Región</label>
            <input
              type="text"
              value={form.region || ''}
              onChange={(e) => handleChange('region', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Zona Horaria</label>
            <select
              value={form.timezone || 'America/Santiago'}
              onChange={(e) => handleChange('timezone', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="America/Santiago">Santiago (GMT-4)</option>
              <option value="America/Buenos_Aires">Buenos Aires (GMT-3)</option>
              <option value="America/Lima">Lima (GMT-5)</option>
            </select>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ===========================================================
// LOCATIONS SECTION
// ===========================================================

function LocationsSection({ locations, onChange }: { locations: Location[]; onChange: (locations: Location[]) => void }) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const toggleActive = (id: string) => {
    onChange(locations.map(l => l.id === id ? { ...l, isActive: !l.isActive } : l));
  };

  const deleteLocation = (id: string) => {
    onChange(locations.filter(l => l.id !== id));
  };

  const addLocation = () => {
    const newLoc: Location = {
      id: `loc-${Date.now()}`,
      name: 'Nueva Sede',
      address: '',
      city: '',
      isActive: true,
      isMain: false,
    };
    onChange([...locations, newLoc]);
    setEditingId(newLoc.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Sedes</h2>
          <p className="text-sm text-neutral-500">Administra tus ubicaciones</p>
        </div>
        <button
          onClick={addLocation}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
        >
          + Agregar sede
        </button>
      </div>

      <div className="space-y-3">
        {locations.map((location) => (
          <div
            key={location.id}
            className={`bg-white border rounded-lg p-4 ${location.isActive ? 'border-neutral-200' : 'border-neutral-200 opacity-60'}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  location.isMain ? 'bg-primary-100 text-primary-600' : 'bg-neutral-100 text-neutral-600'
                }`}>
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-neutral-900">{location.name}</h3>
                    {location.isMain && (
                      <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full">
                        Principal
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-500">{location.address}</p>
                  <p className="text-sm text-neutral-400">{location.city} • {location.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleActive(location.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    location.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-neutral-100 text-neutral-500'
                  }`}
                >
                  {location.isActive ? 'Activa' : 'Inactiva'}
                </button>
                <button
                  onClick={() => deleteLocation(location.id)}
                  className="p-1 text-neutral-400 hover:text-red-600"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ===========================================================
// DEPARTMENTS SECTION
// ===========================================================

function DepartmentsSection({ departments, onChange }: { departments: DepartmentSettings[]; onChange: (departments: DepartmentSettings[]) => void }) {
  const addDepartment = () => {
    const newDept: DepartmentSettings = {
      id: `dept-${Date.now()}`,
      name: 'Nuevo Departamento',
      supervisorIds: [],
      agentIds: [],
      autoAssignment: true,
      maxQueueSize: 10,
      maxWaitTimeSeconds: 300,
      isActive: true,
      priority: departments.length + 1,
    };
    onChange([...departments, newDept]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Departamentos</h2>
          <p className="text-sm text-neutral-500">Equipos y departamentos</p>
        </div>
        <button
          onClick={addDepartment}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
        >
          + Agregar departamento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="bg-white border border-neutral-200 rounded-lg p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium text-neutral-900">{dept.name}</h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                dept.isActive ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'
              }`}>
                {dept.isActive ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            {dept.description && (
              <p className="text-sm text-neutral-500 mb-2">{dept.description}</p>
            )}
            <div className="flex items-center gap-4 text-xs text-neutral-400">
              <span>{dept.agentIds.length} agentes</span>
              <span>•</span>
              <span>Cola máx: {dept.maxQueueSize}</span>
              <span>•</span>
              <span>Espera: {dept.maxWaitTimeSeconds}s</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ===========================================================
// SCHEDULE SECTION
// ===========================================================

function ScheduleSection({ workingHours, onChange }: { workingHours: WorkingHoursSettings; onChange: (hours: WorkingHoursSettings) => void }) {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels: Record<string, string> = {
    monday: 'Lunes',
    tuesday: 'Martes',
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado',
    sunday: 'Domingo',
  };

  const toggleDay = (day: string) => {
    const schedule = workingHours.defaultSchedule.map(d => {
      if (d.day === day) {
        return { ...d, enabled: !d.enabled };
      }
      return d;
    });
    onChange({ ...workingHours, defaultSchedule: schedule });
  };

  const updateDayHours = (day: string, field: 'start' | 'end', value: string) => {
    const schedule = workingHours.defaultSchedule.map(d => {
      if (d.day === day) {
        return { ...d, [field]: value };
      }
      return d;
    });
    onChange({ ...workingHours, defaultSchedule: schedule });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-3xl"
    >
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-neutral-900">Horario de Atención</h2>
        <p className="text-sm text-neutral-500">Configura tus horarios de operación</p>
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        {days.map((day) => {
          const schedule = workingHours.defaultSchedule.find(d => d.day === day);
          const isEnabled = schedule?.enabled;
          
          return (
            <div
              key={day}
              className="flex items-center gap-4 px-4 py-3 border-b border-neutral-200 last:border-b-0"
            >
              <div className="w-28">
                <span className="text-sm font-medium text-neutral-700">
                  {dayLabels[day]}
                </span>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={() => toggleDay(day)}
                  className="w-4 h-4 text-primary-600 rounded border-neutral-300 focus:ring-primary-500"
                />
              </label>
              <div className="flex-1 flex items-center gap-2">
                {isEnabled ? (
                  <>
                    <input
                      type="time"
                      value={schedule?.start || '08:00'}
                      onChange={(e) => updateDayHours(day, 'start', e.target.value)}
                      className="px-2 py-1 border border-neutral-200 rounded text-sm"
                    />
                    <span className="text-neutral-400">a</span>
                    <input
                      type="time"
                      value={schedule?.end || '20:00'}
                      onChange={(e) => updateDayHours(day, 'end', e.target.value)}
                      className="px-2 py-1 border border-neutral-200 rounded text-sm"
                    />
                  </>
                ) : (
                  <span className="text-sm text-neutral-400">Cerrado</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-neutral-700 mb-3">Mensajes fuera de horario</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-neutral-500 mb-1">Mensaje fuera de horario</label>
            <textarea
              value={workingHours.afterHoursMessage || ''}
              onChange={(e) => onChange({ ...workingHours, afterHoursMessage: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Gracias por contactarnos. Nuestro horario de atención es..."
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ===========================================================
// CHANNELS SECTION
// ===========================================================

function ChannelsSection({ channels, onChange }: { channels: ChannelSettings; onChange: (channels: ChannelSettings) => void }) {
  const channelList = [
    { key: 'web', label: 'Web Chat', icon: '🌐' },
    { key: 'whatsapp', label: 'WhatsApp', icon: '📱' },
    { key: 'instagram', label: 'Instagram', icon: '📸' },
    { key: 'facebook', label: 'Facebook', icon: '📘' },
    { key: 'email', label: 'Email', icon: '✉️' },
    { key: 'telegram', label: 'Telegram', icon: '✈️' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-neutral-900">Canales</h2>
        <p className="text-sm text-neutral-500">Configura los canales activos</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {channelList.map((ch) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const config = (channels as any)[ch.key];
          const isEnabled = config?.enabled;
          
          return (
            <div
              key={ch.key}
              className={`bg-white border rounded-lg p-4 ${
                isEnabled ? 'border-primary-200 ring-2 ring-primary-100' : 'border-neutral-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">{ch.icon}</span>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={(e) => onChange({ ...channels, [ch.key]: { ...config, enabled: e.target.checked } })}
                    className="w-4 h-4 text-primary-600 rounded"
                  />
                </label>
              </div>
              <h3 className="font-medium text-neutral-900">{ch.label}</h3>
              <p className="text-xs text-neutral-500 mt-1">
                {isEnabled ? 'Activo' : 'Inactivo'}
              </p>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ===========================================================
// AGENTS SECTION
// ===========================================================

function AgentsSection({ agents, onChange }: { agents: AgentSettings; onChange: (agents: AgentSettings) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-3xl"
    >
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-neutral-900">Configuración de Agentes</h2>
        <p className="text-sm text-neutral-500">Parámetros para agentes</p>
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Estado por defecto
            </label>
            <select
              value={agents.defaultStatus}
              onChange={(e) => onChange({ ...agents, defaultStatus: e.target.value as any })}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg"
            >
              <option value="ONLINE">Online</option>
              <option value="OFFLINE">Offline</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Chats máximos simultáneos
            </label>
            <input
              type="number"
              value={agents.maxConcurrentChats}
              onChange={(e) => onChange({ ...agents, maxConcurrentChats: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={agents.autoAcceptChats}
              onChange={(e) => onChange({ ...agents, autoAcceptChats: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm">Auto-aceptar chats</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={agents.allowTransfer}
              onChange={(e) => onChange({ ...agents, allowTransfer: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm">Permitir transferencias</span>
          </label>
        </div>
      </div>
    </motion.div>
  );
}

// ===========================================================
// ROUTING SECTION
// ===========================================================

function RoutingSection({ routing, onChange }: { routing: RoutingRules; onChange: (routing: RoutingRules) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-3xl"
    >
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-neutral-900">Reglas de Derivación</h2>
        <p className="text-sm text-neutral-500">Cómo se distribuyen las conversaciones</p>
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Tipo de derivación</label>
          <select
            value={routing.type}
            onChange={(e) => onChange({ ...routing, type: e.target.value as any })}
            className="w-full px-3 py-2 border border-neutral-200 rounded-lg"
          >
            <option value="manual">Manual</option>
            <option value="round_robin">Round Robin</option>
            <option value="skills_based">Por habilidades</option>
            <option value="load_balanced">Balanceado</option>
          </select>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={routing.assignment.autoAssign}
              onChange={(e) => onChange({ ...routing, assignment: { ...routing.assignment, autoAssign: e.target.checked } })}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm">Auto-asignar conversaciones</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={routing.handoff.enableHumanHandoff}
              onChange={(e) => onChange({ ...routing, handoff: { ...routing.handoff, enableHumanHandoff: e.target.checked } })}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm">Permitir transferencia a humano</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Palabras clave para transferencia
          </label>
          <input
            type="text"
            value={routing.handoff.keywordsForHandoff.join(', ')}
            onChange={(e) => onChange({ 
              ...routing, 
              handoff: { 
                ...routing.handoff, 
                keywordsForHandoff: e.target.value.split(',').map(k => k.trim()) 
              } 
            })}
            className="w-full px-3 py-2 border border-neutral-200 rounded-lg"
            placeholder="hablar con humano, urgencia, etc."
          />
        </div>
      </div>
    </motion.div>
  );
}

// ===========================================================
// BOT SECTION
// ===========================================================

function BotSection({ bot, onChange }: { bot: BotSettings; onChange: (bot: BotSettings) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-3xl"
    >
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-neutral-900">Configuración del Bot</h2>
        <p className="text-sm text-neutral-500">Personaliza el asistente virtual</p>
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Nombre del bot</label>
          <input
            type="text"
            value={bot.name}
            onChange={(e) => onChange({ ...bot, name: e.target.value })}
            className="w-full px-3 py-2 border border-neutral-200 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Tono</label>
          <select
            value={bot.tone}
            onChange={(e) => onChange({ ...bot, tone: e.target.value as any })}
            className="w-full px-3 py-2 border border-neutral-200 rounded-lg"
          >
            <option value="formal">Formal</option>
            <option value="informal">Informal</option>
            <option value="friendly">Amigable</option>
            <option value="professional">Profesional</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Mensaje de bienvenida</label>
          <textarea
            value={bot.greetingMessage || ''}
            onChange={(e) => onChange({ ...bot, greetingMessage: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-neutral-200 rounded-lg"
          />
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={bot.aiEnabled}
              onChange={(e) => onChange({ ...bot, aiEnabled: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm">IA habilitada</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={bot.fallbackToHuman}
              onChange={(e) => onChange({ ...bot, fallbackToHuman: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm">Fallback a humano</span>
          </label>
        </div>
      </div>
    </motion.div>
  );
}

// ===========================================================
// SURVEYS SECTION
// ===========================================================

function SurveysSection({ surveys, onChange }: { surveys: SurveySettings; onChange: (surveys: SurveySettings) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-3xl"
    >
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-neutral-900">Encuestas de Satisfacción</h2>
        <p className="text-sm text-neutral-500">Configura las encuestas</p>
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Habilitar encuestas</span>
          <input
            type="checkbox"
            checked={surveys.enabled}
            onChange={(e) => onChange({ ...surveys, enabled: e.target.checked })}
            className="w-4 h-4 rounded"
          />
        </div>

        {surveys.enabled && (
          <>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Tipo de encuesta</label>
              <select
                value={surveys.type}
                onChange={(e) => onChange({ ...surveys, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg"
              >
                <option value="csat">CSAT (Customer Satisfaction)</option>
                <option value="nps">NPS (Net Promoter Score)</option>
                <option value="ces">CES (Customer Effort Score)</option>
              </select>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={surveys.csat.enabled}
                  onChange={(e) => onChange({ 
                    ...surveys, 
                    csat: { ...surveys.csat, enabled: e.target.checked } 
                  })}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm">Enviar después de resolución</span>
              </label>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

// ===========================================================
// INTEGRATIONS SECTION
// ===========================================================

function IntegrationsSection({ integrations, onChange }: { integrations: IntegrationSettings; onChange: (integrations: IntegrationSettings) => void }) {
  const integrationList = [
    { key: 'crm', label: 'CRM', provider: 'HubSpot, Salesforce...' },
    { key: 'analytics', label: 'Analytics', provider: 'GA4, Mixpanel...' },
    { key: 'email', label: 'Email', provider: 'SendGrid, Mailgun...' },
    { key: 'sms', label: 'SMS', provider: 'Twilio...' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-neutral-900">Integraciones</h2>
        <p className="text-sm text-neutral-500">Conecta servicios externos</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {integrationList.map((int) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const config = (integrations as any)[int.key];
          const isEnabled = config?.enabled;
          
          return (
            <div
              key={int.key}
              className={`bg-white border rounded-lg p-4 ${
                isEnabled ? 'border-primary-200' : 'border-neutral-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-neutral-900">{int.label}</h3>
                <input
                  type="checkbox"
                  checked={isEnabled}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(e) => onChange({ ...integrations, [int.key]: { ...config, enabled: e.target.checked } })}
                  className="w-4 h-4 rounded"
                />
              </div>
              <p className="text-xs text-neutral-500">{int.provider}</p>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ===========================================================
// NOTIFICATIONS SECTION
// ===========================================================

function NotificationsSection({ notifications, onChange }: { notifications: NotificationSettings; onChange: (notifications: NotificationSettings) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-3xl"
    >
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-neutral-900">Notificaciones</h2>
        <p className="text-sm text-neutral-500">Configura las alertas</p>
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-200">
          <h3 className="text-sm font-medium">Por Email</h3>
        </div>
        <div className="p-4 space-y-3">
          {[
            { key: 'newConversation', label: 'Nueva conversación' },
            { key: 'conversationAssigned', label: 'Conversación asignada' },
            { key: 'ticketCreated', label: 'Ticket creado' },
            { key: 'slaBreach', label: 'SLA incumplido' },
          ].map((item) => (
            <label key={item.key} className="flex items-center justify-between">
              <span className="text-sm">{item.label}</span>
              <input
                type="checkbox"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                checked={(notifications.email as any)[item.key]}
                onChange={(e) => onChange({ 
                  ...notifications, 
                  email: { ...notifications.email, [item.key]: e.target.checked } 
                })}
                className="w-4 h-4 rounded"
              />
            </label>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ===========================================================
// BRANDING SECTION
// ===========================================================

function BrandingSection({ branding, onChange }: { branding: BrandingSettings; onChange: (branding: BrandingSettings) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-3xl"
    >
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-neutral-900">Branding</h2>
        <p className="text-sm text-neutral-500">Personalización visual</p>
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Color primario
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={branding.primaryColor}
                onChange={(e) => onChange({ ...branding, primaryColor: e.target.value })}
                className="w-10 h-10 border border-neutral-200 rounded cursor-pointer"
              />
              <input
                type="text"
                value={branding.primaryColor}
                onChange={(e) => onChange({ ...branding, primaryColor: e.target.value })}
                className="flex-1 px-2 py-1 border border-neutral-200 rounded text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Color secundario
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={branding.secondaryColor || '#0284c7'}
                onChange={(e) => onChange({ ...branding, secondaryColor: e.target.value })}
                className="w-10 h-10 border border-neutral-200 rounded cursor-pointer"
              />
              <input
                type="text"
                value={branding.secondaryColor || '#0284c7'}
                onChange={(e) => onChange({ ...branding, secondaryColor: e.target.value })}
                className="flex-1 px-2 py-1 border border-neutral-200 rounded text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Color de acento
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={branding.accentColor || '#06b6d4'}
                onChange={(e) => onChange({ ...branding, accentColor: e.target.value })}
                className="w-10 h-10 border border-neutral-200 rounded cursor-pointer"
              />
              <input
                type="text"
                value={branding.accentColor || '#06b6d4'}
                onChange={(e) => onChange({ ...branding, accentColor: e.target.value })}
                className="flex-1 px-2 py-1 border border-neutral-200 rounded text-sm"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-200">
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Vista previa
          </label>
          <div 
            className="h-20 rounded-lg flex items-center justify-center text-white"
            style={{ backgroundColor: branding.primaryColor }}
          >
            <span className="font-medium">_COLOR_PRIMARY_</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}