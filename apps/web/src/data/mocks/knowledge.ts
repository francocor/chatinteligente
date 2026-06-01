import { KnowledgeEntry, KnowledgeCategory, KnowledgeStats } from '@/types/knowledge';

export const mockCategories: KnowledgeCategory[] = [
  { id: 'cat-1', tenantId: 'tenant-1', name: 'Horarios de Atención', description: 'Información sobre horarios y disponibilidad', color: '#3b82f6', entryCount: 3, isActive: true, createdAt: new Date('2024-01-01') },
  { id: 'cat-2', tenantId: 'tenant-1', name: 'Canales de Contacto', description: 'Cómo comunicarse con nosotros', color: '#10b981', entryCount: 4, isActive: true, createdAt: new Date('2024-01-01') },
  { id: 'cat-3', tenantId: 'tenant-1', name: 'Medios de Pago', description: 'Métodos de pago y facturación', color: '#f59e0b', entryCount: 3, isActive: true, createdAt: new Date('2024-01-05') },
  { id: 'cat-4', tenantId: 'tenant-1', name: 'Seguimiento de Solicitudes', description: 'Estado y seguimiento de pedidos o tickets', color: '#8b5cf6', entryCount: 4, isActive: true, createdAt: new Date('2024-01-10') },
  { id: 'cat-5', tenantId: 'tenant-1', name: 'Políticas y Garantías', description: 'Devoluciones, garantías y términos', color: '#ec4899', entryCount: 3, isActive: true, createdAt: new Date('2024-01-15') },
  { id: 'cat-6', tenantId: 'tenant-1', name: 'Soporte Técnico', description: 'Resolución de problemas frecuentes', color: '#ef4444', entryCount: 3, isActive: true, createdAt: new Date('2024-01-20') },
  { id: 'cat-7', tenantId: 'tenant-1', name: 'Planes y Precios', description: 'Información de planes y cotizaciones', color: '#06b6d4', entryCount: 3, isActive: true, createdAt: new Date('2024-01-25') },
  { id: 'cat-8', tenantId: 'tenant-1', name: 'Reportes y Métricas', description: 'Analíticas y exportaciones', color: '#6366f1', entryCount: 3, isActive: true, createdAt: new Date('2024-02-01') },
];

export const mockKnowledgeEntries: KnowledgeEntry[] = [
  {
    id: 'kb-1',
    tenantId: 'tenant-1',
    title: 'Horarios de Atención',
    content: `Nuestro equipo de atención al cliente está disponible en los siguientes horarios:

**Atención en vivo (agentes humanos):**
Lunes a viernes: 08:00 a 20:00 hs
Sábados: 09:00 a 14:00 hs
Domingos: Cerrado

**Asistente virtual (IA):**
Disponible las 24 horas, los 7 días de la semana.

**Respuesta por email:**
Tiempo máximo de respuesta: 4 horas hábiles.`,
    summary: 'Atención en vivo L-V 08:00-20:00. IA disponible 24/7.',
    category: 'Horarios de Atención',
    tags: ['horarios', 'atención', 'disponibilidad'],
    keywords: ['horario', 'atienden', 'abierto', 'cerrado', 'cuándo', 'disponible'],
    variants: ['a qué hora atienden', 'cuándo puedo hablar con alguien', 'están abiertos hoy', 'horario de funcionamiento'],
    sourceType: 'FAQ',
    status: 'ACTIVE',
    isActive: true,
    isFeatured: true,
    views: 1542,
    helpful: 234,
    notHelpful: 12,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-03-01'),
  },
  {
    id: 'kb-2',
    tenantId: 'tenant-1',
    title: 'Cómo Iniciar una Consulta',
    content: `Podés contactarnos a través de los siguientes canales:

1. **Chat en vivo** — hacé clic en el botón del chat en nuestra web
2. **WhatsApp** — escribinos al +54 9 11 0000-0000
3. **Email** — contacto@empresa.com
4. **Teléfono** — 0800-000-0000 (L-V 08:00-18:00)

El asistente virtual responde de inmediato. Si necesitás un agente humano, pedí "hablar con un asesor" o esperá a que el bot te derive automáticamente.`,
    summary: 'Canales de contacto: chat, WhatsApp, email o teléfono',
    category: 'Canales de Contacto',
    tags: ['contacto', 'WhatsApp', 'chat', 'email'],
    keywords: ['contactar', 'consulta', 'comunicarse', 'canal', 'cómo escribir'],
    variants: ['cómo los contacto', 'por dónde escribo', 'tienen WhatsApp', 'cómo inicio una consulta'],
    sourceType: 'FAQ',
    status: 'ACTIVE',
    isActive: true,
    isFeatured: true,
    views: 2834,
    helpful: 456,
    notHelpful: 23,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-03-05'),
  },
  {
    id: 'kb-3',
    tenantId: 'tenant-1',
    title: 'Medios de Pago Aceptados',
    content: `Aceptamos los siguientes métodos de pago:

**Tarjetas:**
- Crédito: Visa, Mastercard, American Express
- Débito: Visa Débito, Mastercard Débito

**Transferencias:**
- Transferencia bancaria (CBU/CVU)
- Alias de cuenta

**Plataformas digitales:**
- Mercado Pago
- PayPal
- Stripe

**Para empresas:**
- Factura a 30/60 días (previa aprobación crediticia)
- Órdenes de compra

**Nota:** Para pagos en efectivo, consultá disponibilidad en tu zona.`,
    summary: 'Tarjetas, transferencias, Mercado Pago, PayPal. Facturas para empresas.',
    category: 'Medios de Pago',
    tags: ['pago', 'tarjeta', 'transferencia', 'factura'],
    keywords: ['pago', 'tarjeta', 'efectivo', 'transferencia', 'cómo pago', 'medios'],
    variants: ['cómo puedo pagar', 'aceptan tarjeta', 'tienen Mercado Pago', 'puedo pagar en cuotas'],
    sourceType: 'FAQ',
    status: 'ACTIVE',
    isActive: true,
    isFeatured: false,
    views: 1876,
    helpful: 345,
    notHelpful: 18,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-02-28'),
  },
  {
    id: 'kb-4',
    tenantId: 'tenant-1',
    title: 'Cómo Hacer el Seguimiento de tu Solicitud',
    content: `Podés consultar el estado de tu solicitud o pedido de tres formas:

**1. Por chat:**
Escribinos con tu número de caso o número de pedido y te informamos el estado en tiempo real.

**2. Por email:**
Recibirás actualizaciones automáticas en el email que registraste. Revisá también tu carpeta de spam.

**3. Por teléfono:**
Llamá al 0800-000-0000 con tu número de caso a mano.

**Tiempos de respuesta:**
- Consultas generales: hasta 4 horas hábiles
- Casos técnicos: hasta 24 horas hábiles
- Reclamos: hasta 72 horas hábiles`,
    summary: 'Seguimiento por chat, email o teléfono. Respuesta en 4-72 hs según tipo.',
    category: 'Seguimiento de Solicitudes',
    tags: ['seguimiento', 'estado', 'pedido', 'caso'],
    keywords: ['seguimiento', 'estado', 'dónde está', 'cuándo', 'mi pedido', 'mi caso'],
    variants: ['cómo sé cómo está mi pedido', 'dónde veo el estado', 'número de caso', 'cuándo me responden'],
    sourceType: 'FAQ',
    status: 'ACTIVE',
    isActive: true,
    isFeatured: true,
    views: 2234,
    helpful: 567,
    notHelpful: 34,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-03-10'),
  },
  {
    id: 'kb-5',
    tenantId: 'tenant-1',
    title: 'Política de Devoluciones y Reembolsos',
    content: `Si no estás satisfecho con tu compra o servicio, podés solicitar una devolución dentro de los plazos establecidos:

**Plazos:**
- Productos físicos: 30 días desde la recepción
- Servicios digitales: 14 días desde la contratación
- Suscripciones: antes del próximo ciclo de facturación

**Cómo solicitar:**
1. Contactanos por chat o email
2. Indicá el motivo de la devolución
3. Te enviaremos instrucciones en 24 horas hábiles

**Condiciones:**
- El producto debe estar en su estado original
- Incluir comprobante de compra
- Devoluciones por defecto de fábrica tienen prioridad

**Reembolso:**
El importe se acredita en 5-10 días hábiles en el mismo medio de pago utilizado.`,
    summary: 'Devoluciones en 30 días (productos) o 14 días (servicios). Reembolso en 5-10 días.',
    category: 'Políticas y Garantías',
    tags: ['devolución', 'reembolso', 'garantía', 'política'],
    keywords: ['devolución', 'devolver', 'reembolso', 'garantía', 'cambio', 'no sirve'],
    variants: ['cómo devuelvo algo', 'quiero mi reembolso', 'política de cambio', 'tienen garantía'],
    sourceType: 'POLICY',
    status: 'ACTIVE',
    isActive: true,
    isFeatured: true,
    views: 3421,
    helpful: 789,
    notHelpful: 45,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-03-15'),
  },
  {
    id: 'kb-6',
    tenantId: 'tenant-1',
    title: 'Problemas Frecuentes de Acceso y Login',
    content: `Si tenés problemas para acceder a tu cuenta, seguí estos pasos:

**No puedo iniciar sesión:**
1. Verificá que el email y contraseña sean correctos
2. Usá "Olvidé mi contraseña" para restablecerla
3. Revisá que no tengas Bloqueador de JavaScript activo

**Cuenta bloqueada:**
Después de 5 intentos fallidos la cuenta se bloquea por 30 minutos. Si persiste, contactanos.

**No recibo el email de verificación:**
- Revisá carpeta de spam o correo no deseado
- Verificá que el email sea correcto
- Solicitá reenvío desde la pantalla de login

**Otros problemas:**
Contactanos por chat indicando el mensaje de error exacto.`,
    summary: 'Pasos para problemas de login, cuenta bloqueada o email de verificación',
    category: 'Soporte Técnico',
    tags: ['login', 'contraseña', 'acceso', 'cuenta'],
    keywords: ['no puedo entrar', 'olvidé contraseña', 'login', 'acceso', 'cuenta bloqueada'],
    variants: ['no puedo iniciar sesión', 'olvidé mi contraseña', 'mi cuenta está bloqueada', 'no recibo el email'],
    sourceType: 'ARTICLE',
    status: 'ACTIVE',
    isActive: true,
    isFeatured: false,
    views: 1654,
    helpful: 234,
    notHelpful: 15,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-02-20'),
  },
  {
    id: 'kb-7',
    tenantId: 'tenant-1',
    title: 'Planes Disponibles y Diferencias',
    content: `Ofrecemos tres planes según el tamaño y necesidades de tu empresa:

**Plan Starter (gratuito)**
- Hasta 3 agentes activos
- 500 conversaciones/mes
- Chat web + WhatsApp
- Reportes básicos
- Soporte por email

**Plan Business ($99/mes)**
- Hasta 20 agentes
- Conversaciones ilimitadas
- Todos los canales
- Reportes avanzados y exportaciones
- IA conversacional incluida
- Soporte prioritario

**Plan Enterprise (a convenir)**
- Agentes ilimitados
- IA avanzada y personalizable
- Integraciones API y webhooks
- SLA garantizado
- Gerente de cuenta dedicado
- Onboarding personalizado`,
    summary: 'Tres planes: Starter (gratis), Business ($99/mes), Enterprise (custom)',
    category: 'Planes y Precios',
    tags: ['plan', 'precio', 'starter', 'business', 'enterprise'],
    keywords: ['plan', 'precio', 'cuánto cuesta', 'opciones', 'diferencia entre planes'],
    variants: ['cuánto cuesta', 'qué planes tienen', 'diferencia entre planes', 'qué incluye cada plan'],
    sourceType: 'FAQ',
    status: 'ACTIVE',
    isActive: true,
    isFeatured: true,
    views: 987,
    helpful: 345,
    notHelpful: 8,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    id: 'kb-8',
    tenantId: 'tenant-1',
    title: 'Cómo Exportar Reportes y Métricas',
    content: `Podés exportar los datos de tu plataforma en varios formatos:

**Formatos disponibles:**
- CSV (compatible con Excel y Google Sheets)
- PDF (para presentaciones)
- Excel (.xlsx)
- JSON (para integraciones)

**Qué podés exportar:**
- Conversaciones y mensajes
- Tickets y casos
- Métricas de rendimiento de agentes
- CSAT y satisfacción del cliente
- Reporte de flujos y automatizaciones

**Cómo hacerlo:**
1. Ir a Dashboard → Exportar
2. Seleccionar el rango de fechas
3. Elegir el tipo de reporte
4. Hacer clic en "Generar y descargar"

Los reportes grandes se procesan en segundo plano y se envían por email.`,
    summary: 'Exportá conversaciones, tickets y métricas en CSV, PDF o Excel',
    category: 'Reportes y Métricas',
    tags: ['reporte', 'exportar', 'métricas', 'CSV', 'Excel'],
    keywords: ['exportar', 'reporte', 'descargar', 'métricas', 'CSV', 'PDF'],
    variants: ['cómo exporto datos', 'puedo descargar reportes', 'cómo genero un informe', 'exportar conversaciones'],
    sourceType: 'ARTICLE',
    status: 'ACTIVE',
    isActive: true,
    isFeatured: false,
    views: 1234,
    helpful: 234,
    notHelpful: 12,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-03-01'),
  },
];

export const mockTags = [
  'horarios', 'contacto', 'WhatsApp', 'pago', 'facturación',
  'seguimiento', 'pedido', 'devolución', 'garantía',
  'soporte', 'login', 'acceso', 'plan', 'precio', 'reporte'
];

export const knowledgeStats: KnowledgeStats = {
  total: 28,
  active: 24,
  drafts: 3,
  featured: 6,
  byCategory: {
    'Horarios de Atención': 3,
    'Canales de Contacto': 4,
    'Medios de Pago': 3,
    'Seguimiento de Solicitudes': 4,
    'Políticas y Garantías': 3,
    'Soporte Técnico': 3,
    'Planes y Precios': 3,
    'Reportes y Métricas': 3,
  },
  bySource: {
    'FAQ': 15,
    'ARTICLE': 6,
    'POLICY': 4,
    'MANUAL': 1,
    'DOCUMENT': 1,
    'WEBPAGE': 1,
  },
  totalViews: 15420,
  totalHelpful: 3456,
};

export const getEntryById = (id: string): KnowledgeEntry | undefined => {
  return mockKnowledgeEntries.find(e => e.id === id);
};

export const getEntriesByCategory = (category: string): KnowledgeEntry[] => {
  return mockKnowledgeEntries.filter(e => e.category === category);
};

export const searchEntries = (query: string): KnowledgeEntry[] => {
  const normalizedQuery = query.toLowerCase();
  return mockKnowledgeEntries.filter(entry =>
    entry.title.toLowerCase().includes(normalizedQuery) ||
    entry.content.toLowerCase().includes(normalizedQuery) ||
    entry.keywords.some(k => k.toLowerCase().includes(normalizedQuery)) ||
    entry.variants.some(v => v.toLowerCase().includes(normalizedQuery))
  );
};

export const getActiveEntries = (): KnowledgeEntry[] => {
  return mockKnowledgeEntries.filter(e => e.isActive && e.status === 'ACTIVE');
};

export const getFeaturedEntries = (): KnowledgeEntry[] => {
  return mockKnowledgeEntries.filter(e => e.isFeatured && e.isActive);
};
