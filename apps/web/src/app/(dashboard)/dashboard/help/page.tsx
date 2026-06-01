'use client';

import { useState } from 'react';
import { Search, BookOpen, MessageSquare, FileText, BarChart3, Settings, Phone, Mail, ExternalLink, ChevronRight, CheckCircle, Send, X, Lightbulb, AlertCircle } from 'lucide-react';

type Article = {
  title: string;
  description: string;
  steps: string[];
  tip: string;
  demoNote?: string;
};

const articleDatabase: Record<string, Article> = {
  'Guía de inicio rápido': {
    title: 'Guía de inicio rápido',
    description: 'Comenzá a usar la plataforma en menos de 5 minutos.',
    steps: [
      'Ingresá tus credenciales en /login con email, contraseña y tenant.',
      'El dashboard se abre en "Conversaciones" — ahí se gestionan todos los chats.',
      'Usá el menú lateral para navegar: Tickets, Alertas, Reportes, Exportar.',
      'Hacé clic en tu avatar (abajo a la izquierda) para ver Perfil, Empresa y Facturación.',
      'Probá el chatbot de demo en /demo para ver cómo responde la IA.',
    ],
    tip: 'El asistente de IA responde automáticamente cuando no hay agentes disponibles. Podés ver cómo funciona en tiempo real en la pantalla /demo.',
    demoNote: 'En modo demo, todas las conversaciones y datos son de ejemplo. Los cambios no se guardan en backend.',
  },
  'Configuración de cuenta': {
    title: 'Configuración de cuenta',
    description: 'Actualizá tu perfil, contraseña y preferencias personales.',
    steps: [
      'Hacé clic en tu avatar en la parte inferior del menú lateral.',
      'Seleccioná "Perfil" del menú desplegable.',
      'Editá tu nombre, apellido, email y zona horaria.',
      'Para cambiar contraseña, buscá la sección "Seguridad" en el perfil.',
      'Guardá los cambios con el botón "Guardar".',
    ],
    tip: 'Tu email de cuenta es el que aparece en los tickets asignados y en las notificaciones. Mantenerlo actualizado es importante para recibir alertas.',
    demoNote: 'En modo demo, los cambios de perfil se guardan localmente y se pierden al recargar.',
  },
  'Invitar miembros del equipo': {
    title: 'Invitar miembros del equipo',
    description: 'Agregá agentes, supervisores y administradores a tu organización.',
    steps: [
      'Ve a Empresa desde el menú de usuario (avatar).',
      'Buscá la sección "Usuarios" o "Equipo".',
      'Hacé clic en "Invitar usuario" e ingresá el email.',
      'Seleccioná el rol: Admin (acceso total), Supervisor (reportes y alertas), Agente (solo conversaciones).',
      'El usuario recibirá un email con el link de activación y credenciales.',
    ],
    tip: 'Los agentes por defecto solo ven las conversaciones que les están asignadas. Los supervisores pueden ver todas.',
    demoNote: 'En modo demo, los usuarios no reciben emails reales. Los cambios son locales.',
  },
  'Responder conversaciones': {
    title: 'Responder conversaciones',
    description: 'Gestioná chats entrantes y respondé a tus clientes en tiempo real.',
    steps: [
      'Ve a "Conversaciones" en el menú lateral.',
      'Hacé clic en el chevron → al final de una fila para abrir el chat.',
      'Leé el historial en la pestaña "Chat" y escribí tu respuesta abajo.',
      'Presioná Enter o el botón Enviar para enviar el mensaje.',
      'Usá los chips de respuestas rápidas (Hola, Gracias, etc.) para agilizar.',
    ],
    tip: 'En la pestaña "Info" ves el historial completo del cliente: conversaciones previas, CSAT promedio y datos de contacto.',
  },
  'Transferir chats': {
    title: 'Transferir chats',
    description: 'Reasigná una conversación a otro agente del equipo.',
    steps: [
      'Abrí la conversación desde el listado.',
      'Ve a la pestaña "Info" en el panel central.',
      'En la sección "Asignación", hacé clic en el selector de agente.',
      'Elegí el agente disponible de la lista desplegable.',
      'El agente recibe una notificación automática y la conversación aparece en su lista.',
    ],
    tip: 'Antes de transferir, agregá una nota interna en la pestaña "Notas" explicando el contexto. El agente receptor verá toda la info sin tener que preguntar.',
  },
  'Atajos y respuestas rápidas': {
    title: 'Atajos y respuestas rápidas',
    description: 'Acelerá la atención con plantillas y atajos de teclado.',
    steps: [
      'En el chat, aparecen chips de respuestas rápidas predefinidas debajo del input.',
      'Hacé clic en un chip para insertar el texto automáticamente.',
      'Para plantillas más largas, ve a Configuración → Respuestas Rápidas.',
      'Creá tus propias plantillas con variables como {nombre} o {número_ticket}.',
    ],
    tip: 'Las respuestas rápidas más usadas para atención al cliente son: confirmación de recepción, solicitud de más info, y cierre de conversación. Tenelas listas.',
  },
  'Crear y gestionar tickets': {
    title: 'Crear y gestionar tickets',
    description: 'Gestioná casos que requieren seguimiento o resolución estructurada.',
    steps: [
      'Desde una conversación, hacé clic en "Crear ticket" en el panel GESTIÓN.',
      'O ve directamente a Tickets en el menú lateral.',
      'Completá asunto, descripción, prioridad (Baja/Normal/Alta/Crítica) y categoría.',
      'Asignalo a un agente y establecé el SLA si corresponde.',
      'Hacé clic en la flecha → de cada ticket para ver el detalle y agregar notas.',
    ],
    tip: 'Los tickets CRÍTICOS generan alertas automáticas si quedan sin asignar por más de 5 minutos. Asegurá respuesta inmediata.',
  },
  'Configurar alertas': {
    title: 'Configurar alertas',
    description: 'Creá reglas automáticas para que el sistema te avise cuando algo requiere atención.',
    steps: [
      'Ve a "Alertas" en el menú lateral.',
      'Hacé clic en el botón "Reglas" en la esquina superior derecha.',
      'Hacé clic en "+ Nueva regla".',
      'Elegí el tipo: SLA de conversación, Escalación, Caída de CSAT, Pico de volumen, etc.',
      'Ponele un nombre descriptivo y activá la regla con el toggle.',
    ],
    tip: 'La regla más útil para empezar es "SLA de primera respuesta" configurada en 15 minutos. Te avisa antes de que el cliente espere demasiado.',
  },
  'SLA y prioridades': {
    title: 'SLA y prioridades',
    description: 'Entendé los acuerdos de nivel de servicio y cómo impactan en la atención.',
    steps: [
      'SLA (Service Level Agreement) define el tiempo máximo de respuesta y resolución.',
      'CRÍTICA: respuesta en 5 min, resolución en 1h. Se notifica de inmediato.',
      'ALTA: respuesta en 15 min, resolución en 4h.',
      'NORMAL: respuesta en 1h, resolución en 24h.',
      'Cuando se acerca el vencimiento, aparece una alerta. Si se vence, el ticket queda en "SLA Incumplido".',
    ],
    tip: 'El reporte de SLA en Reportes → Analíticas muestra la tasa de cumplimiento por período. Es un KPI clave para evaluar la calidad del equipo.',
  },
  'Dashboard de métricas': {
    title: 'Dashboard de métricas',
    description: 'Interpretá los KPIs principales de tu operación de atención.',
    steps: [
      'Ve a "Reportes" en el menú lateral.',
      'Usá el selector de período (7 días, 30 días, este mes, mes anterior).',
      'Los KPIs de arriba cambian según el período seleccionado.',
      'Los gráficos muestran conversaciones por día y distribución horaria.',
      'Las tablas de abajo muestran intenciones detectadas y rendimiento por agente.',
    ],
    tip: 'La métrica "Resolución IA" te dice qué porcentaje de consultas resolvió el bot sin intervención humana. Cuanto más alto, más eficiente es tu setup.',
  },
  'Exportar datos': {
    title: 'Exportar datos',
    description: 'Descargá tus datos en CSV, Excel o PDF para análisis externo.',
    steps: [
      'Ve a "Exportar" en el menú lateral.',
      'Seleccioná el tipo de reporte (Conversaciones, Agentes, Satisfacción, etc.).',
      'Elegí el formato: XLSX, CSV o PDF.',
      'Configurá los filtros de período, canal y departamento.',
      'Hacé clic en "Generar y Descargar" — el archivo se descarga automáticamente.',
    ],
    tip: 'Los reportes de Conversaciones en CSV son compatibles con Excel y Google Sheets. Útiles para cruzar con datos de CRM o ventas.',
    demoNote: 'En modo demo, el CSV descargado contiene datos de ejemplo genéricos.',
  },
  'Informes personalizados': {
    title: 'Informes personalizados',
    description: 'Combiná filtros para generar reportes específicos según tu necesidad.',
    steps: [
      'En Exportar, primero elegí el tipo de reporte que más te interesa.',
      'Usá el filtro de Período para acotar el rango de fechas.',
      'Combiná con filtros de Canal (WhatsApp, Web, Email) y Departamento.',
      'Hacé clic en "Vista Previa" para ver los primeros 10 registros antes de descargar.',
      'Si el reporte es útil, podés programar envíos automáticos desde Configuración.',
    ],
    tip: 'Para evaluaciones de performance del equipo, el reporte de Agentes muestra conversaciones, CSAT y tiempo de respuesta promedio por persona.',
  },
  'Datos de la empresa': {
    title: 'Datos de la empresa',
    description: 'Actualizá la información de tu organización en la plataforma.',
    steps: [
      'Hacé clic en tu avatar y seleccioná "Empresa".',
      'Actualizá el nombre de la empresa, logo y datos de contacto.',
      'Configurá la zona horaria del negocio (afecta reportes y SLA).',
      'Guardá los cambios.',
    ],
    tip: 'El nombre de la empresa aparece en los reportes exportados y en el perfil de la plataforma. Usá el nombre comercial para que los PDFs sean presentables.',
    demoNote: 'En modo demo, los cambios se guardan visualmente pero no persisten en backend.',
  },
  'Facturación y planes': {
    title: 'Facturación y planes',
    description: 'Administrá tu plan, facturas y método de pago.',
    steps: [
      'Hacé clic en tu avatar y seleccioná "Facturación".',
      'Ves tu plan actual y la fecha del próximo cobro.',
      'Para cambiar de plan, hacé clic en "Cambiar Plan" y elegí el nuevo.',
      'Las facturas anteriores se pueden descargar en PDF desde el historial.',
    ],
    tip: 'El Plan Business incluye IA conversacional, todos los canales (WhatsApp, Web, Email, Instagram) y soporte prioritario. Ideal para equipos de más de 5 agentes.',
    demoNote: 'En modo demo, los cambios de plan muestran confirmación pero no generan cobros reales.',
  },
  'Usuarios y permisos': {
    title: 'Usuarios y permisos',
    description: 'Gestioná los roles y accesos de tu equipo.',
    steps: [
      'Ve a Empresa → Usuarios.',
      'Ves la lista de todos los usuarios activos e inactivos.',
      'Los roles disponibles son: Admin (acceso total), Supervisor (reportes y alertas), Agente (solo conversaciones).',
      'Para cambiar el rol de un usuario, hacé clic en su nombre y editá el rol.',
      'Para desactivar un usuario, desactivá el toggle sin eliminarlo del sistema.',
    ],
    tip: 'Los agentes solo ven conversaciones asignadas a ellos por defecto. Los supervisores pueden ver todas y reasignar. Los admins tienen acceso a facturación y configuración.',
    demoNote: 'En modo demo, los cambios de usuarios son visuales y no persisten.',
  },
};

const helpCategories = [
  {
    title: 'Primeros Pasos',
    icon: BookOpen,
    description: 'Configuración inicial y conceptos básicos',
    articles: ['Guía de inicio rápido', 'Configuración de cuenta', 'Invitar miembros del equipo'],
  },
  {
    title: 'Gestión de Conversaciones',
    icon: MessageSquare,
    description: 'Atención al cliente y chatbots',
    articles: ['Responder conversaciones', 'Transferir chats', 'Atajos y respuestas rápidas'],
  },
  {
    title: 'Tickets y Alertas',
    icon: FileText,
    description: 'Sistema de tickets y notificaciones',
    articles: ['Crear y gestionar tickets', 'Configurar alertas', 'SLA y prioridades'],
  },
  {
    title: 'Reportes y Exportaciones',
    icon: BarChart3,
    description: 'Métricas y análisis de datos',
    articles: ['Dashboard de métricas', 'Exportar datos', 'Informes personalizados'],
  },
  {
    title: 'Configuración de Empresa',
    icon: Settings,
    description: 'Ajustes de organización',
    articles: ['Datos de la empresa', 'Facturación y planes', 'Usuarios y permisos'],
  },
];

export default function DashboardHelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openArticle, setOpenArticle] = useState<Article | null>(null);
  const [contactFeedback, setContactFeedback] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formSent, setFormSent] = useState(false);

  const handleContactClick = (channel: string) => {
    if (channel === 'email') {
      window.open('mailto:Francocornejoc15@gmail.com');
      setContactFeedback('Abriendo cliente de email...');
    } else if (channel === 'web') {
      window.open('https://github.com/francocor?tab=repositories', '_blank');
      setContactFeedback('Abriendo sitio web...');
    } else if (channel === 'whatsapp') {
      window.open('https://wa.me/543816348569', '_blank');
      setContactFeedback('Abriendo WhatsApp...');
    }
    setTimeout(() => setContactFeedback(null), 3000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formMessage) return;
    setFormSent(true);
    setFormName('');
    setFormEmail('');
    setFormMessage('');
    setTimeout(() => setFormSent(false), 3000);
  };

  const filteredCategories = helpCategories.map(cat => ({
    ...cat,
    articles: searchQuery
      ? cat.articles.filter(a => a.toLowerCase().includes(searchQuery.toLowerCase()))
      : cat.articles,
  })).filter(cat => cat.articles.length > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Centro de Ayuda</h1>
        <p className="text-neutral-500 mt-1">Encontrá respuestas y capacitá a tu equipo</p>
      </div>

      {/* Search */}
      <div className="max-w-2xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar artículos de ayuda..."
            className="w-full pl-12 pr-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Help Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((category) => {
          const Icon = category.icon;
          return (
            <div
              key={category.title}
              className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{category.title}</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">{category.description}</p>
                </div>
              </div>
              <ul className="space-y-1">
                {category.articles.map((article) => (
                  <li key={article}>
                    <button
                      onClick={() => setOpenArticle(articleDatabase[article] ?? null)}
                      className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors w-full text-left group"
                    >
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      {article}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Contact Support */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-1">¿Necesitás más ayuda?</h3>
        <p className="text-neutral-600 dark:text-neutral-400 mb-5 text-sm">
          Contactá al equipo de soporte directamente.
        </p>

        {contactFeedback && (
          <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            {contactFeedback}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => handleContactClick('email')}
            className="flex items-center gap-3 p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-left"
          >
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="font-medium text-neutral-900 dark:text-neutral-100">Email</p>
              <p className="text-xs text-neutral-500 truncate">Francocornejoc15@gmail.com</p>
            </div>
          </button>

          <button
            onClick={() => handleContactClick('web')}
            className="flex items-center gap-3 p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-left"
          >
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <ExternalLink className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="font-medium text-neutral-900 dark:text-neutral-100">Repositorios</p>
              <p className="text-xs text-neutral-500 truncate">github.com/francocor</p>
            </div>
          </button>

          <button
            onClick={() => handleContactClick('whatsapp')}
            className="flex items-center gap-3 p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-left"
          >
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-medium text-neutral-900 dark:text-neutral-100">WhatsApp</p>
              <p className="text-xs text-neutral-500">+54 381 634-8569</p>
            </div>
          </button>
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Envianos una consulta</h3>
        <p className="text-sm text-neutral-500 mb-5">Te respondemos dentro de las 24 hs hábiles.</p>

        {formSent ? (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">Tu consulta fue enviada. Te respondemos en breve.</p>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-4 max-w-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">Nombre</label>
                <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Tu nombre" required className="w-full px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">Email</label>
                <input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="tu@empresa.com" required className="w-full px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">Mensaje</label>
              <textarea value={formMessage} onChange={(e) => setFormMessage(e.target.value)} placeholder="Describí tu consulta o problema..." required rows={4} className="w-full px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
            </div>
            <button type="submit" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors">
              <Send className="w-4 h-4" />
              Enviar consulta
            </button>
          </form>
        )}
      </div>

      {/* Article Modal */}
      {openArticle && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-neutral-800 px-6 pt-6 pb-4 border-b border-neutral-100 dark:border-neutral-700 flex items-start justify-between gap-4">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{openArticle.title}</h3>
              <button onClick={() => setOpenArticle(null)} className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg flex-shrink-0">
                <X className="w-4 h-4 text-neutral-500" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{openArticle.description}</p>

              <div>
                <h4 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">Pasos</h4>
                <ol className="space-y-2">
                  {openArticle.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                      <span className="text-neutral-700 dark:text-neutral-300">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1">Consejo práctico</p>
                    <p className="text-sm text-amber-700 dark:text-amber-300">{openArticle.tip}</p>
                  </div>
                </div>
              </div>

              {openArticle.demoNote && (
                <div className="p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-neutral-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-neutral-500">{openArticle.demoNote}</p>
                </div>
              )}

              <button
                onClick={() => setOpenArticle(null)}
                className="w-full px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
