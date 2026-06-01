'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  MessageCircle,
  BarChart3,
  Clock,
  Check,
  X,
  Send,
  Activity,
  Star,
  Shield,
  Plus,
  Minus,
  ArrowRight,
  Headphones,
  ShoppingCart,
  Building2,
  Scale,
  Wrench,
  Stethoscope,
  Users,
  FileText,
} from 'lucide-react';

// TODO: Add industry selector to show vertical-specific demos
// Industries: General, Salud, Ecommerce, Inmobiliaria, Soporte Técnico

const industries = [
  { id: 'general', label: 'General', icon: Building2, color: 'text-blue-500' },
  { id: 'ecommerce', label: 'Ecommerce', icon: ShoppingCart, color: 'text-emerald-500' },
  { id: 'salud', label: 'Salud', icon: Stethoscope, color: 'text-cyan-500' },
  { id: 'inmobiliaria', label: 'Inmobiliaria', icon: Building2, color: 'text-amber-500' },
  { id: 'legal', label: 'Estudio Jurídico', icon: Scale, color: 'text-purple-500' },
  { id: 'soporte', label: 'Soporte Técnico', icon: Wrench, color: 'text-rose-500' },
];

const industryChats: Record<string, { greeting: string; quickReplies: string[]; faqs: { question: string; answer: string }[] }> = {
  general: {
    greeting: '👋 ¡Bienvenido! Soy el asistente virtual de atención al cliente.\n\nPuedo ayudarte con:\n\n• 💬 Consultas generales\n• 🕐 Horarios y contacto\n• 📦 Seguimiento de solicitudes\n• 💳 Información de precios\n• 👤 Hablar con un asesor',
    quickReplies: ['📋 Consulta general', '🕐 Horarios de atención', '💳 Precios y planes', '📦 Seguimiento de pedido', '👤 Hablar con un asesor'],
    faqs: [
      { question: '¿Cuáles son los horarios de atención?', answer: 'Atendemos de lunes a viernes de 08:00 a 20:00 hs, y sábados de 09:00 a 14:00 hs. El asistente virtual está disponible 24/7.' },
      { question: '¿Cómo puedo hacer el seguimiento de mi solicitud?', answer: 'Podés consultar el estado de tu solicitud escribiéndonos por chat con tu número de caso, o revisando el email de confirmación que recibiste.' },
      { question: '¿Cuáles son los medios de pago disponibles?', answer: 'Aceptamos tarjetas de crédito y débito (Visa, Mastercard, Amex), transferencia bancaria, Mercado Pago y PayPal. Para empresas, también factura a 30 días.' },
      { question: '¿Cómo puedo hablar con un asesor humano?', answer: 'Podés escribir "hablar con asesor" o "quiero hablar con una persona" en cualquier momento del chat y te derivaremos de inmediato al equipo disponible.' },
    ],
  },
  ecommerce: {
    greeting: '🛍️ ¡Hola! Soy el asistente de atención de la tienda.\n\nPuedo ayudarte con:\n\n• 📦 Seguimiento de tu pedido\n• 🔄 Cambios y devoluciones\n• 💳 Medios de pago\n• 📍 Envíos y tiempos\n• ❓ Preguntas sobre productos',
    quickReplies: ['📦 ¿Dónde está mi pedido?', '🔄 Quiero hacer una devolución', '💳 Medios de pago', '📍 ¿Cuánto tarda el envío?', '👤 Hablar con soporte'],
    faqs: [
      { question: '¿Cuánto tarda el envío?', answer: 'El envío estándar demora 3-5 días hábiles. El envío express llega en 24-48 horas. Una vez despachado recibirás el número de seguimiento.' },
      { question: '¿Cómo hago una devolución?', answer: 'Tenés 30 días desde la recepción para solicitar una devolución. Contactanos por chat con tu número de orden y el motivo, y te enviamos las instrucciones.' },
      { question: '¿Puedo cambiar mi pedido una vez confirmado?', answer: 'Si el pedido aún no fue procesado, podemos modificarlo. Contactanos de inmediato con tu número de orden. Una vez despachado, no es posible hacer cambios.' },
      { question: '¿Hacen envíos internacionales?', answer: 'Sí, enviamos a todo el país y a países del Cono Sur. Los tiempos y costos internacionales varían según el destino. Consultanos para más detalles.' },
    ],
  },
  salud: {
    greeting: '🏥 ¡Bienvenido! Soy el asistente de Centro de Atención Médica.\n\nEstoy aquí para ayudarte con:\n\n• 📅 Solicitar un turno\n• 🕐 Horarios de atención\n• 💳 Coberturas y planes de salud\n• 📋 Consultas generales\n• 👤 Hablar con un representante',
    quickReplies: ['📅 Solicitar turno', '🕐 Horarios de atención', '💳 Coberturas médicas', '📋 Información general', '👤 Hablar con recepción'],
    faqs: [
      { question: '¿Cómo solicito un turno?', answer: 'Podés solicitar tu turno por este chat, llamando al +54 9 11 0000-0000, o enviándonos un email. El asistente puede ayudarte con especialidades disponibles y horarios.' },
      { question: '¿Qué coberturas médicas aceptan?', answer: 'Trabajamos con las principales obras sociales y prepagas. Consultanos con el nombre de tu cobertura para confirmar si está incluida.' },
      { question: '¿Cuáles son los horarios de atención?', answer: 'Atendemos de lunes a viernes de 08:00 a 20:00 hs y sábados de 09:00 a 14:00 hs. Para urgencias, estamos disponibles las 24 horas.' },
      { question: '¿Qué documentación necesito para atenderme?', answer: 'Necesitás documento de identidad y credencial de obra social o prepaga vigente. Para consultas especializadas, también la derivación médica correspondiente.' },
    ],
  },
  inmobiliaria: {
    greeting: '🏠 ¡Hola! Soy el asistente de la inmobiliaria.\n\nPuedo ayudarte con:\n\n• 🔍 Buscar propiedades\n• 📅 Coordinar visitas\n• 💰 Consultas sobre precios\n• 📋 Requisitos para alquilar o comprar\n• 👤 Hablar con un asesor',
    quickReplies: ['🔍 Buscar propiedades', '📅 Coordinar una visita', '💰 Consultar precios', '📋 Requisitos para alquilar', '👤 Hablar con asesor'],
    faqs: [
      { question: '¿Cuáles son los requisitos para alquilar?', answer: 'Generalmente necesitás: recibos de sueldo de los últimos 3 meses, garantía (propietario o seguro de caución), DNI y referencias laborales. Los requisitos varían según la propiedad.' },
      { question: '¿Cómo coordino una visita a una propiedad?', answer: 'Escribinos por este chat con la dirección o código de la propiedad y te daremos los horarios disponibles para visitarla. También podés llamarnos directamente.' },
      { question: '¿Cobran comisión al inquilino?', answer: 'Nuestra estructura de honorarios cumple con la regulación vigente. Te informamos todos los costos asociados antes de firmar cualquier contrato.' },
      { question: '¿Cuánto tiempo tarda el proceso de compraventa?', answer: 'El proceso completo de compraventa puede tomar entre 30 y 90 días, dependiendo del financiamiento y los trámites notariales. Te acompañamos en cada etapa.' },
    ],
  },
  legal: {
    greeting: '⚖️ ¡Bienvenido! Soy el asistente del estudio jurídico.\n\nPuedo orientarte sobre:\n\n• 📋 Áreas de práctica\n• 📅 Agendar una consulta\n• 🕐 Horarios de atención\n• 💰 Consultas sobre honorarios\n• 👤 Hablar con un profesional',
    quickReplies: ['📋 Áreas de práctica', '📅 Agendar consulta', '🕐 Horarios', '💰 Honorarios', '👤 Hablar con un abogado'],
    faqs: [
      { question: '¿En qué áreas del derecho se especializan?', answer: 'Nos especializamos en derecho laboral, civil, comercial y familia. Contamos con profesionales especializados en cada área para brindarte la mejor orientación.' },
      { question: '¿Cómo agendo una consulta?', answer: 'Podés agendar una consulta inicial por este chat, por teléfono o enviándonos un email. La primera consulta de orientación es sin cargo.' },
      { question: '¿Cómo son los honorarios?', answer: 'Los honorarios varían según la complejidad del caso y el tipo de servicio. Ofrecemos presupuesto claro desde la primera reunión, sin sorpresas.' },
      { question: '¿Atienden por videollamada?', answer: 'Sí, ofrecemos consultas presenciales y por videollamada. Para casos urgentes, también podemos coordinar atención el mismo día.' },
    ],
  },
  soporte: {
    greeting: '🔧 ¡Hola! Soy el asistente de soporte técnico.\n\nPuedo ayudarte con:\n\n• 🚨 Reportar una incidencia\n• 📋 Estado de tu ticket\n• 📚 Base de conocimiento\n• 🔄 Actualizaciones del sistema\n• 👤 Escalar con un técnico',
    quickReplies: ['🚨 Reportar incidencia', '📋 Ver mi ticket', '📚 Base de conocimiento', '🔄 Estado del sistema', '👤 Hablar con un técnico'],
    faqs: [
      { question: '¿Cómo reporto una falla crítica?', answer: 'Para incidencias críticas escribí "URGENTE" al inicio de tu mensaje. Te derivaremos de inmediato a un técnico de guardia disponible 24/7 para casos críticos.' },
      { question: '¿Cuál es el SLA de respuesta?', answer: 'Para incidencias críticas: 30 minutos. Alta prioridad: 2 horas. Normal: 4 horas. El SLA está garantizado por contrato en los planes Business y Enterprise.' },
      { question: '¿Cómo consulto el estado de mi ticket?', answer: 'Podés consultar el estado de tu ticket enviándonos el número de ticket por este chat, o accediendo al portal de cliente con tu email y contraseña.' },
      { question: '¿Tienen soporte fuera del horario de oficina?', answer: 'Sí, para clientes en Plan Business y Enterprise ofrecemos guardia técnica 24/7. Para el Plan Starter, la guardia está disponible de lunes a viernes.' },
    ],
  },
};

const demoStats = {
  totalConversations: 247,
  activeConversations: 23,
  resolvedToday: 189,
  avgResponseTime: '2m 34s',
  satisfaction: 4.6,
  slaCompliance: 94.2,
};

const demoConversations = [
  { id: '1', name: 'María González', lastMessage: 'Gracias, recibí la propuesta por email', time: '14:32', status: 'resolved' },
  { id: '2', name: 'Roberto Soto', lastMessage: 'El sistema está caído, no podemos operar', time: '14:28', status: 'in_progress' },
  { id: '3', name: 'Ana Martínez', lastMessage: '¿Cuándo llega mi pedido?', time: '14:15', status: 'waiting' },
];

export default function DemoPage() {
  const [selectedIndustry, setSelectedIndustry] = useState('general');
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isEscalated, setIsEscalated] = useState(false);
  const chatPreviewEndRef = useRef<HTMLDivElement>(null);
  const chatWidgetEndRef = useRef<HTMLDivElement>(null);

  const currentIndustry = industryChats[selectedIndustry];

  useEffect(() => {
    chatPreviewEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    chatWidgetEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const initChat = () => {
    if (messages.length === 0) {
      setMessages([{ id: '1', from: 'bot', text: currentIndustry.greeting, time: new Date() }]);
    }
    setChatOpen(true);
  };

  const handleIndustryChange = (id: string) => {
    setSelectedIndustry(id);
    setIsEscalated(false);
    setMessages([{ id: '1', from: 'bot', text: industryChats[id].greeting, time: new Date() }]);
  };

  const isEscalationTrigger = (lower: string) =>
    ['urgente', 'emergencia', 'caído', 'crítico', 'humano', 'persona', 'agente',
     'asesor', 'operador', 'ayuda urgente', 'reclamo', 'queja'].some(w => lower.includes(w));

  const getBotResponse = (text: string): string => {
    const lower = text.toLowerCase();

    // --- Escalación universal (prioridad máxima) ---
    if (lower.includes('urgente') || lower.includes('emergencia') || lower.includes('caído') || lower.includes('crítico')) {
      return '🚨 Entiendo que es urgente.\n\nEstoy derivando tu consulta a un agente disponible de inmediato.\n\n⏱️ Tiempo estimado: 1-2 minutos.\n\nPor favor, describí brevemente el problema mientras esperás.';
    }
    if (lower.includes('humano') || lower.includes('persona') || lower.includes('agente') || lower.includes('asesor') || lower.includes('operador')) {
      return '👤 Perfecto. Estoy derivando tu consulta a un agente humano.\n\nUn representante del equipo se comunicará con vos en breve. ¿Hay algo más que quieras dejarle saber?';
    }
    if (lower.includes('reclamo') || lower.includes('queja')) {
      return '🔄 Registré tu reclamo correctamente.\n\nUn agente revisará tu caso y te responderá en un máximo de 24 horas hábiles.\n\n¿Podés compartir tu número de caso o pedido para agilizar el proceso?';
    }

    // --- Respuestas por industria ---
    switch (selectedIndustry) {
      case 'ecommerce':
        if (lower.includes('pedido') || lower.includes('dónde está') || lower.includes('seguimiento') || lower.includes('entrega')) {
          return '📦 Para consultar tu pedido, necesito el número de orden.\n\nEjemplo: #12345. Una vez que lo tengo, puedo darte el estado exacto y la fecha estimada de entrega.';
        }
        if (lower.includes('devolución') || lower.includes('cambio') || lower.includes('reembolso')) {
          return '🔄 Las devoluciones son válidas dentro de los 30 días desde la recepción.\n\nPasos:\n1. Contactanos con el número de orden\n2. Te enviamos la etiqueta de devolución\n3. El reembolso se acredita en 5-7 días hábiles\n\n¿Tenés el número de orden a mano?';
        }
        if (lower.includes('envío') || lower.includes('cuánto tarda') || lower.includes('demora')) {
          return '🚚 Tiempos de envío:\n\n• Estándar: 3-5 días hábiles\n• Express: 24-48 horas\n• Internacional: 7-15 días hábiles\n\nUna vez despachado, recibís el número de seguimiento por email. ¿Necesitás algo más?';
        }
        if (lower.includes('pago') || lower.includes('tarjeta') || lower.includes('cuotas')) {
          return '💳 Aceptamos:\n\n• Tarjetas de crédito y débito (Visa, Mastercard, Amex)\n• Mercado Pago\n• Transferencia bancaria\n• Cuotas sin interés disponibles en tarjetas seleccionadas\n\n¿Necesitás más información sobre medios de pago?';
        }
        break;

      case 'salud':
        if (lower.includes('turno') || lower.includes('cita') || lower.includes('hora') || lower.includes('reservar')) {
          return '📅 Para solicitar un turno necesito:\n\n• Especialidad deseada\n• Días y horarios de preferencia\n• Nombre y número de documento\n\nTambién podés llamar al +54 9 11 0000-0000. ¿Qué especialidad buscás?';
        }
        if (lower.includes('cobertura') || lower.includes('obra social') || lower.includes('prepaga') || lower.includes('seguro')) {
          return '💳 Trabajamos con las principales prestadoras y planes de salud.\n\nContanos tu cobertura y verificamos si está incluida. En general trabajamos con las principales entidades del mercado.\n\n¿Con qué plan de salud o prepaga contás?';
        }
        if (lower.includes('resultado') || lower.includes('análisis') || lower.includes('examen')) {
          return '📋 Los resultados están disponibles 24-72 horas hábiles después del estudio.\n\nPodés:\n• Consultarlos por este chat con tu número de documento\n• Retirarlos en recepción\n• Recibirlos por email si lo solicitaste\n\n¿Cómo preferís recibirlos?';
        }
        if (lower.includes('horario') || lower.includes('abierto') || lower.includes('atención')) {
          return '🕐 Horarios de atención:\n\n• Lunes a viernes: 08:00 - 20:00 hs\n• Sábados: 09:00 - 14:00 hs\n• Urgencias: 24 horas\n\n¿Necesitás un turno o tenés otra consulta?';
        }
        break;

      case 'inmobiliaria':
        if (lower.includes('propiedad') || lower.includes('casa') || lower.includes('depto') || lower.includes('departamento') || lower.includes('busco')) {
          return '🏠 Con gusto te ayudo a encontrar la propiedad ideal.\n\nContame:\n• ¿Alquilar o comprar?\n• ¿Qué zona preferís?\n• ¿Cantidad de ambientes?\n• ¿Cuál es tu presupuesto aproximado?\n\nCon esos datos puedo mostrarte las mejores opciones disponibles.';
        }
        if (lower.includes('visita') || lower.includes('conocer') || lower.includes('ver') || lower.includes('recorrido')) {
          return '📅 Coordinamos la visita sin cargo ni compromiso.\n\nPuedo agendarte para esta semana. Solo decime:\n• Código o dirección de la propiedad\n• Tus días y horarios disponibles\n\n¿Cuándo te vendría bien?';
        }
        if (lower.includes('alquiler') || lower.includes('requisito') || lower.includes('garantía') || lower.includes('documentación')) {
          return '📋 Requisitos para alquilar:\n\n• DNI del titular\n• Recibos de sueldo últimos 3 meses\n• Garantía (propietario, seguro de caución o garantía bancaria)\n\nPara algunas propiedades también pedimos referencias. ¿Querés que un asesor te contacte?';
        }
        if (lower.includes('precio') || lower.includes('valor') || lower.includes('cuánto') || lower.includes('costo')) {
          return '💰 Los valores varían según zona, metraje y categoría.\n\nPara alquileres en zona céntrica, los precios rondan los $X a $Y por mes.\n\nTe recomiendo hablar con uno de nuestros asesores para una tasación sin compromiso. ¿Te parece?';
        }
        break;

      case 'legal':
        if (lower.includes('consulta') || lower.includes('asesoría') || lower.includes('ayuda legal') || lower.includes('abogado')) {
          return '⚖️ Ofrecemos consulta inicial sin cargo.\n\nNuestras áreas principales:\n• Derecho laboral\n• Derecho civil y de familia\n• Derecho comercial\n• Derecho penal\n\n¿Sobre qué área necesitás orientación?';
        }
        if (lower.includes('turno') || lower.includes('cita') || lower.includes('reunión') || lower.includes('agendar')) {
          return '📅 Agendamos tu consulta inicial sin cargo.\n\nModalidades:\n• Presencial en nuestras oficinas\n• Videollamada (Zoom / Meet)\n\nContame tu disponibilidad y confirmamos en el día. ¿Cuándo te vendría bien?';
        }
        if (lower.includes('honorario') || lower.includes('precio') || lower.includes('costo') || lower.includes('cuánto cobra')) {
          return '💰 Los honorarios dependen del tipo de caso y su complejidad.\n\nSiempre ofrecemos presupuesto claro y sin sorpresas antes de comenzar.\n\nLa primera consulta de orientación es sin cargo. ¿Querés agendar una?';
        }
        if (lower.includes('documento') || lower.includes('contrato') || lower.includes('escritura') || lower.includes('poder')) {
          return '📄 Preparamos y revisamos todo tipo de documentación legal:\n\n• Contratos comerciales y laborales\n• Poderes notariales\n• Escrituras y transferencias\n• Acuerdos y convenios\n\n¿Sobre qué documento necesitás asesoramiento?';
        }
        break;

      case 'soporte':
        if (lower.includes('incidencia') || lower.includes('falla') || lower.includes('error') || lower.includes('no funciona') || lower.includes('problema')) {
          return '🔧 Registré tu incidencia.\n\nPara resolverla rápidamente necesito:\n• Descripción del error (mensaje exacto si hay)\n• Sistema o módulo afectado\n• Desde cuándo ocurre\n\n¿Podés compartir esos datos?';
        }
        if (lower.includes('ticket') || lower.includes('caso') || lower.includes('estado') || lower.includes('seguimiento')) {
          return '📋 Para consultar el estado de tu ticket, indicame el número de caso.\n\nFormato: #TKT-0000 o el email con el que abriste el ticket.\n\n¿Lo tenés a mano?';
        }
        if (lower.includes('actualización') || lower.includes('versión') || lower.includes('mantenimiento') || lower.includes('sistema')) {
          return '🔄 El sistema está operativo al 99.8% de uptime este mes.\n\nPróximo mantenimiento programado: domingo 25/05 de 02:00 a 04:00 hs (impacto mínimo).\n\n¿Necesitás información de algún módulo específico?';
        }
        if (lower.includes('sla') || lower.includes('tiempo') || lower.includes('cuándo') || lower.includes('plazo')) {
          return '⏱️ Nuestros tiempos de respuesta:\n\n• Crítico (P1): 30 minutos\n• Alto (P2): 2 horas hábiles\n• Normal (P3): 4 horas hábiles\n• Bajo (P4): 24 horas hábiles\n\n¿Cuál es la prioridad de tu caso?';
        }
        break;
    }

    // --- Respuestas genéricas universales ---
    if (lower.includes('horario') || lower.includes('cuándo') || lower.includes('atienden') || lower.includes('abierto')) {
      return '🕐 Horarios de atención con agentes humanos:\n\nLunes a viernes: 08:00 - 20:00 hs\nSábados: 09:00 - 14:00 hs\n\nEl asistente virtual está disponible las 24 horas. ¿En qué más puedo ayudarte?';
    }
    if (lower.includes('precio') || lower.includes('plan') || lower.includes('costo') || lower.includes('cuánto') || lower.includes('tarifa')) {
      return '💰 Contamos con planes para distintas necesidades:\n\n• Starter — para equipos pequeños\n• Business — para empresas en crecimiento\n• Enterprise — solución a medida\n\n¿Querés que te derive con un asesor para una cotización personalizada?';
    }
    if (lower.includes('pago') || lower.includes('factura') || lower.includes('cobro') || lower.includes('tarjeta')) {
      return '💳 Aceptamos:\n\n• Tarjetas de crédito y débito (Visa, Mastercard, Amex)\n• Transferencia bancaria\n• Mercado Pago / PayPal\n• Factura a 30 días para empresas\n\n¿Necesitás más detalles?';
    }
    if (lower.includes('hola') || lower.includes('buenos') || lower.includes('buenas') || lower.includes('buen día')) {
      return currentIndustry.greeting;
    }
    return 'Gracias por tu consulta. Para darte la mejor respuesta, ¿podés contarme un poco más sobre lo que necesitás?\n\nTambién podés elegir una opción rápida de abajo o escribir "hablar con asesor" para ser derivado a un agente.';
  };

  const sendBotResponse = (userText: string) => {
    if (isEscalationTrigger(userText.toLowerCase())) {
      setIsEscalated(true);
    }
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        { id: (Date.now() + 1).toString(), from: 'bot', text: getBotResponse(userText), time: new Date() },
      ]);
    }, 1200);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const text = inputValue;
    const userMsg = { id: Date.now().toString(), from: 'user', text, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    sendBotResponse(text);
  };

  const handleQuickReply = (reply: string) => {
    const userMsg = { id: Date.now().toString(), from: 'user', text: reply, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    sendBotResponse(reply);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Plataforma de Atención Inteligente</h1>
              <p className="text-xs text-slate-500">Demo Comercial Interactiva</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
              Ingresar
            </Link>
            <Link href="/login" className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all">
              Ver Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
              <Shield className="w-4 h-4" />
              Demo Interactiva — Plataforma Multirubro
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
              Atención al cliente{' '}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                inteligente
              </span>{' '}
              para tu empresa
            </h2>
            <p className="mt-6 text-lg text-slate-600">
              Centralizá todas las consultas de tus clientes, automatizá respuestas frecuentes
              con IA y derivá a agentes humanos cuando sea necesario. Funciona para cualquier rubro.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={initChat}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-medium rounded-xl hover:shadow-xl transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                Probar el Chat
              </button>
              <Link href="/login" className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 font-medium rounded-xl border border-slate-200 hover:shadow-lg transition-all">
                <BarChart3 className="w-5 h-5" />
                Ver Dashboard
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" />Sin configuración</div>
              <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" />Datos de demo</div>
              <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" />Listo para mostrar</div>
            </div>
          </div>

          {/* Chat Preview */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-3xl blur-2xl opacity-20" />
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/20">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Asistente Virtual</p>
                      <p className="text-white/70 text-xs">En línea ahora</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-white/70 text-xs">Activo</span>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-3 min-h-[280px] max-h-[360px] overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-center">
                    <Bot className="w-12 h-12 text-slate-200 mb-3" />
                    <p className="text-sm text-slate-400">Seleccioná un rubro y probá el chat</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] px-4 py-2 rounded-2xl ${msg.from === 'user' ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        <p className={`text-xs mt-1 ${msg.from === 'user' ? 'text-white/70' : 'text-slate-400'}`}>
                          {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 text-slate-500 px-4 py-3 rounded-2xl text-sm flex items-center gap-2">
                      <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </span>
                      Revisando tu consulta...
                    </div>
                  </div>
                )}
                {isEscalated && (
                  <div className="flex justify-center">
                    <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-full text-orange-700 text-xs font-medium">
                      <Users className="w-3.5 h-3.5" />
                      Derivado a agente humano · En espera de atención
                    </div>
                  </div>
                )}
                <div ref={chatPreviewEndRef} />
              </div>
              {messages.length > 0 && (
                <div className="px-3 pb-1 flex gap-2 overflow-x-auto">
                  {currentIndustry.quickReplies.map((reply) => (
                    <button key={reply} onClick={() => handleQuickReply(reply)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs rounded-full whitespace-nowrap transition-colors flex-shrink-0">
                      {reply}
                    </button>
                  ))}
                </div>
              )}
              <div className="p-3 border-t border-slate-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={messages.length === 0 ? 'Seleccioná un rubro arriba para comenzar' : 'Escribe tu consulta...'}
                    disabled={messages.length === 0}
                    className="flex-1 px-3 py-2 bg-slate-100 rounded-lg text-sm disabled:opacity-50"
                  />
                  <button onClick={handleSend} disabled={messages.length === 0} className="px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg disabled:opacity-50">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Selector */}
      <section className="py-10 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">
            Adaptado para cualquier rubro — elegí uno para personalizar la demo
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {industries.map((ind) => {
              const Icon = ind.icon;
              const isSelected = selectedIndustry === ind.id;
              return (
                <button
                  key={ind.id}
                  onClick={() => handleIndustryChange(ind.id)}
                  className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${isSelected ? 'bg-blue-100' : 'bg-slate-100'} ${ind.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs font-medium text-center ${isSelected ? 'text-blue-700' : 'text-slate-600'}`}>{ind.label}</span>
                  {isSelected && <div className="mt-1 w-1.5 h-1.5 bg-blue-500 rounded-full" />}
                </button>
              );
            })}
          </div>
          {messages.length === 0 && (
            <div className="text-center mt-6">
              <button
                onClick={initChat}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-medium rounded-xl hover:shadow-lg transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                Iniciar demo como {industries.find(i => i.id === selectedIndustry)?.label}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-slate-900 mb-2">
            Preguntas Frecuentes
          </h3>
          <p className="text-center text-slate-500 mb-8 text-sm">
            El bot responde automáticamente estas consultas — cambiá el rubro arriba para ver ejemplos por industria
          </p>
          <div className="space-y-3">
            {currentIndustry.faqs.map((item, index) => (
              <div key={index} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="font-medium text-slate-900">{item.question}</span>
                  {openFaq === index ? <Minus className="w-5 h-5 text-slate-400 flex-shrink-0" /> : <Plus className="w-5 h-5 text-slate-400 flex-shrink-0" />}
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-4 text-sm text-slate-600">{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-16 px-4 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-white">Panel de Administración</h3>
            <p className="text-slate-400 mt-2">Dashboard con métricas en tiempo real para tu equipo</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {[
              { label: 'Conversaciones', value: demoStats.totalConversations, icon: MessageCircle },
              { label: 'Activas', value: demoStats.activeConversations, icon: Activity },
              { label: 'Resueltas Hoy', value: demoStats.resolvedToday, icon: Check },
              { label: 'Tiempo Medio', value: demoStats.avgResponseTime, icon: Clock },
              { label: 'Satisfacción', value: demoStats.satisfaction + '/5', icon: Star },
              { label: 'SLA', value: demoStats.slaCompliance + '%', icon: Shield },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white/10 backdrop-blur rounded-xl p-4">
                  <Icon className="w-5 h-5 text-cyan-400 mb-2" />
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </div>
              );
            })}
          </div>
          <div className="grid lg:grid-cols-3 gap-4 mb-8">
            {demoConversations.map((conv) => (
              <div key={conv.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium text-sm">{conv.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    conv.status === 'resolved' ? 'bg-green-500/20 text-green-400' :
                    conv.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {conv.status === 'resolved' ? 'Resuelto' : conv.status === 'in_progress' ? 'En progreso' : 'Esperando'}
                  </span>
                </div>
                <p className="text-slate-400 text-xs">{conv.lastMessage}</p>
                <p className="text-slate-500 text-xs mt-1">{conv.time}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4">
            <Link href="/login" className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-medium rounded-xl hover:shadow-xl transition-all">
              <BarChart3 className="w-5 h-5" />
              Ver Dashboard Completo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: Bot, title: 'IA Conversacional', desc: 'Responde consultas frecuentes en segundos' },
              { icon: Headphones, title: 'Derivación Humana', desc: 'Escala automáticamente cuando es necesario' },
              { icon: FileText, title: 'Tickets y Seguimiento', desc: 'Convierte consultas en casos trazables' },
              { icon: BarChart3, title: 'Métricas en Tiempo Real', desc: 'CSAT, SLA y rendimiento de agentes' },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 text-sm mb-1">{f.title}</h4>
                  <p className="text-xs text-slate-500">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-slate-400" />
            <span className="text-sm text-slate-500">© 2026 Plataforma de Atención Inteligente — Demo</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <Link href="/login" className="hover:text-slate-600">Términos</Link>
            <Link href="/login" className="hover:text-slate-600">Privacidad</Link>
            <Link href="/login" className="hover:text-slate-600">Contacto</Link>
          </div>
        </div>
      </footer>

      {/* Chat Widget Flotante */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50"
          >
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Asistente Virtual</p>
                    <p className="text-white/70 text-xs">{industries.find(i => i.id === selectedIndustry)?.label}</p>
                  </div>
                </div>
                <button onClick={() => setChatOpen(false)} className="text-white/80 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-3 max-h-[380px] overflow-y-auto">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm whitespace-pre-wrap ${msg.from === 'user' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-700'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 text-slate-500 px-3 py-2 rounded-xl text-sm flex items-center gap-2">
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                    Revisando...
                  </div>
                </div>
              )}
              {isEscalated && (
                <div className="flex justify-center">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-full text-orange-700 text-xs font-medium">
                    <Users className="w-3 h-3" />
                    Derivado a agente humano
                  </div>
                </div>
              )}
              <div ref={chatWidgetEndRef} />
            </div>
            <div className="px-3 pb-1 flex gap-2 overflow-x-auto">
              {currentIndustry.quickReplies.slice(0, 3).map((reply) => (
                <button key={reply} onClick={() => { handleQuickReply(reply); }} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs rounded-full whitespace-nowrap flex-shrink-0 transition-colors">
                  {reply}
                </button>
              ))}
            </div>
            <div className="p-3 border-t border-slate-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 px-3 py-2 bg-slate-100 rounded-lg text-sm"
                />
                <button onClick={handleSend} className="p-2 bg-blue-500 text-white rounded-lg">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!chatOpen && (
        <button
          onClick={initChat}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform z-50"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </button>
      )}
    </div>
  );
}
