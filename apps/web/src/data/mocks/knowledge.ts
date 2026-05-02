import { KnowledgeEntry, KnowledgeCategory, KnowledgeStats } from '@/types/knowledge';

export const mockCategories: KnowledgeCategory[] = [
  { id: 'cat-1', tenantId: 'tenant-1', name: 'Horarios de Atención', description: 'Información sobre horarios de la clínica', color: '#3b82f6', entryCount: 4, isActive: true, createdAt: new Date('2024-01-01') },
  { id: 'cat-2', tenantId: 'tenant-1', name: 'Turnos y Citas', description: 'Gestión de citas médicas', color: '#10b981', entryCount: 6, isActive: true, createdAt: new Date('2024-01-01') },
  { id: 'cat-3', tenantId: 'tenant-1', name: 'Coberturas y Obras Sociales', description: 'Información sobre obras sociales aceptadas', color: '#f59e0b', entryCount: 3, isActive: true, createdAt: new Date('2024-01-05') },
  { id: 'cat-4', tenantId: 'tenant-1', name: 'Estudios y Exámenes', description: 'Información sobre estudios clínicos', color: '#8b5cf6', entryCount: 5, isActive: true, createdAt: new Date('2024-01-10') },
  { id: 'cat-5', tenantId: 'tenant-1', name: 'Resultados', description: 'Cómo obtener resultados de estudios', color: '#ec4899', entryCount: 2, isActive: true, createdAt: new Date('2024-01-15') },
  { id: 'cat-6', tenantId: 'tenant-1', name: 'Urgencias', description: 'Protocolos de emergencia', color: '#ef4444', entryCount: 2, isActive: true, createdAt: new Date('2024-01-20') },
  { id: 'cat-7', tenantId: 'tenant-1', name: 'Sedes y Ubicación', description: 'Direcciones de las sedes', color: '#06b6d4', entryCount: 3, isActive: true, createdAt: new Date('2024-01-25') },
  { id: 'cat-8', tenantId: 'tenant-1', name: 'Documentación', description: 'Requisitos y trámites', color: '#6366f1', entryCount: 4, isActive: true, createdAt: new Date('2024-02-01') },
];

export const mockKnowledgeEntries: KnowledgeEntry[] = [
  {
    id: 'kb-1',
    tenantId: 'tenant-1',
    title: 'Horarios de Atención General',
    content: `Nuestra clínica atiende de lunes a viernes de 08:00 a 20:00 horas, y los sábados de 08:00 a 14:00 horas.

Los días domingos y festivos permanecemos cerrados.

Para atenciones de emergencia, tenemos disponibilidad las 24 horas en nuestra sede central de Santiago.`,
    summary: 'Horarios de atención: L-V 08:00-20:00, Sábados 08:00-14:00',
    category: 'Horarios de Atención',
    tags: ['horarios', 'atención', 'emergencia'],
    keywords: ['horario', 'atención', 'abierto', 'cerrado', 'domingo', 'festivo'],
    variants: ['a qué hora abren', 'cuándo atienden', 'horario de funcionamiento', 'están abiertos hoy'],
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
    title: 'Cómo Solicitar un Turno',
    content: `Para solicitar un turno médico puedes hacerlo a través de:

1. WhatsApp: Escribe al número +56 9 1234 5678
2. Teléfono: Llama al 600 500 4000
3. Portal Web: www.clinicasanjuan.cl/turnos
4. Presencial: En cualquiera de nuestras sedes

Recuerda tener tu RUT y obra social a mano.`,
    summary: 'Métodos para solicitar turno: WhatsApp, Teléfono, Web o Presencial',
    category: 'Turnos y Citas',
    tags: ['turno', 'cita', 'solicitar', 'agenda'],
    keywords: ['turno', 'cita', 'reservar', 'agendar', 'hora'],
    variants: ['cómo reservo hora', 'pedir hora', 'conseguir turno', 'como obtengo una cita'],
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
    title: 'Obras Sociales Aceptadas',
    content: `Nuestra clínica acepta las principales obras sociales y prepagas del país:

**Principales:**
- Banmedica
- Consalud
- Cruz Blanca
- Mas Vida
- Nueva Mas Vida
- Riobank
- San Lorenzo
- Isapre Vida

**Requisitos:**
- Credencial vigente
- Orden médica (para consultas especializadas)
- Identificación con foto

Consulta spesifikaciones con tu obra social antes deattenderte.`,
    summary: 'Lista de obras sociales aceptadas y requisitos',
    category: 'Coberturas y Obras Sociales',
    tags: ['obra social', 'prepaga', 'cobertura', 'aseguradora'],
    keywords: ['obra social', 'prepaga', 'cobertura', 'aseguradora', 'aceptan'],
    variants: ['qué obras sociales aceptan', 'tienen con mi isapre', 'aceptan banmedica', 'conviene con mi seguro'],
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
    title: 'Cómo Retirar Resultados de Laboratorio',
    content: `Tienes tres opciones para retirar tus resultados de estudios de laboratorio:

**1. Presencial:**
- Acude a cualquiera de nuestras sedes
- Presenta tu identificación y comprobante

**2. Email:**
- Solicita el envío al momento del estudio
- Recibirás un PDF seguro

**3. Portal Web:**
- Ingresa a www.clinicasanjuan.cl/resultados
- Descarga con tu RUT y contraseña

**Tiempos:**
- Sangre/orina: 24-48 horas hábiles
- Estudios complejos: 72-96 horas hábiles`,
    summary: 'Opciones para retirar resultados: Presencial, Email o Portal Web',
    category: 'Resultados',
    tags: ['resultados', 'laboratorio', 'retirar', 'estudios'],
    keywords: ['resultado', 'estudio', 'laboratorio', 'retirar', 'buscar'],
    variants: ['dónde busco mis resultados', 'cuándo estar listo', 'como obtener mis análisis', 'puedo verlos por internet'],
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
    title: 'Protocolo de Urgencias',
    content: `Si tienes una emergencia médica, sigue estos pasos:

**1. Llama inmediatamente:**
- Teléfono de emergencia: 600 500 9999
- Disponible 24/7

**2. Describe los síntomas:**
- Dolor en el pecho
- Dificultad para respirar
- Sangrado abundante
- Pérdida de conciencia

**3. Acude a urgencias:**
- Sede central: Av. Principal 123, Santiago
-open 24 horas

**Importante:** No intentes conducir si estás en estado crítico. Llama a ambulancia.`,
    summary: 'Pasos en caso de emergencia: Llamar, describir síntomas, acudir a urgencias',
    category: 'Urgencias',
    tags: ['urgencia', 'emergencia', 'emergencia médica', 'auxilio'],
    keywords: ['urgencia', 'emergencia', 'ayuda', 'auxilio', 'emergencia'],
    variants: ['tengo una emergencia', 'qué hago si me pasa algo', 'a dónde voy si me siento mal', 'número de emergencia'],
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
    title: 'Estudios de Laboratorio Disponibles',
    content: `Realizamos los siguientes estudios de laboratorio:

**Comunes:**
- Análisis de sangre completo
- Perfil bioquímico
- Hemoglobina glucosilada
- Perfil lipídico
- Función tiroidea
- Marcadores tumorales

**Especiales:**
- Pruebas de alergia
- Estudios hormonales
- Biopsias
- Papanicolau

**Preparación:**
- Algunos estudios requieren ayuno de 8-12 horas
- others requieren suspensión de medicamentos
- Consulta específica al momento de agendar`,
    summary: 'Listado de estudios de laboratorio disponibles y preparación',
    category: 'Estudios y Exámenes',
    tags: ['estudio', 'laboratorio', 'examen', 'análisis'],
    keywords: ['estudio', 'laboratorio', 'examen', 'análisis', 'prueba'],
    variants: ['qué estudios hacen', 'qué анализы pueden hacerme', 'tienen análisis de'],
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
    title: 'Documentación Requerida para Atención',
    content: `Para	atenderte en nuestra clínica necesitas:

**Pacientes nuevos:**
- Identificación con foto (RUT o Pasaporte)
- Comprobante de domicilio reciente
- Orden médica (si corresponde)
- Credencial de obra social/prepaga

**Menores de edad:**
- Identificación del padre/madre/tutor
- Autorización firmada

**Embarazadas:**
- Carnet de prenatal
- Ecografías previas

**Extranjeros:**
- Pasaporte
- Visa vigente
- Seguro de salud internacional`,
    summary: 'Documentos necesarios según tipo de paciente',
    category: 'Documentación',
    tags: ['documentación', 'requisitos', 'identificación', 'papeles'],
    keywords: ['documento', 'requisito', 'qué llevar', 'qué papeles'],
    variants: ['qué tengo que llevar', 'qué documentos necesito', 'qué debo presentar'],
    sourceType: 'POLICY',
    status: 'ACTIVE',
    isActive: true,
    isFeatured: false,
    views: 987,
    helpful: 123,
    notHelpful: 8,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    id: 'kb-8',
    tenantId: 'tenant-1',
    title: 'Especialidades Médicas Disponibles',
    content: `Contamos con las siguientes especialidades médicas:

- Medicina General
- Cardiología
- Dermatología
- Gastroenterología
- Ginecología
- Neurología
- Oftalmología
- Ortopedia
- Pediatría
- Psiquiatría
- Urología
- Vascular

Cada especialidad tiene horarios específicos. Consulta al momento de solicitar tu turno.`,
    summary: 'Listado de especialidades médicas disponibles',
    category: 'Turnos y Citas',
    tags: ['especialidad', 'médico', 'doctor', 'especialista'],
    keywords: ['especialidad', 'médico', 'doctor', 'especialista'],
    variants: ['qué especialidades tienen', 'qué médicos tienen', 'tienen cardiólogo'],
    sourceType: 'FAQ',
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
  'horarios', 'turno', 'cita', 'emergencia', 'resultados', 
  'laboratorio', 'obra social', 'cobertura', 'documentación',
  'estudio', 'especialidad', 'urgencia', 'sede'
];

export const knowledgeStats: KnowledgeStats = {
  total: 28,
  active: 24,
  drafts: 3,
  featured: 6,
  byCategory: {
    'Horarios de Atención': 4,
    'Turnos y Citas': 6,
    'Coberturas y Obras Sociales': 3,
    'Estudios y Exámenes': 5,
    'Resultados': 2,
    'Urgencias': 2,
    'Sedes y Ubicación': 3,
    'Documentación': 4,
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