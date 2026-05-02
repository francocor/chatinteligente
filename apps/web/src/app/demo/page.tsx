'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Stethoscope,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  MessageCircle,
  Bot,
  Users,
  FileText,
  BarChart3,
  Download,
  Check,
  X,
  Send,
  User,
  AlertCircle,
  Star,
  Heart,
  Brain,
  Bone,
  Eye,
  Activity,
  Shield,
  Plus,
  Minus,
  Play,
  ArrowRight,
} from 'lucide-react';

const medicalSpecialties = [
  { id: 'cardiologia', name: 'Cardiología', icon: Heart, color: 'text-red-500' },
  { id: 'neurologia', name: 'Neurología', icon: Brain, color: 'text-purple-500' },
  { id: 'traumatologia', name: 'Traumatología', icon: Bone, color: 'text-amber-500' },
  { id: 'oftalmologia', name: 'Oftalmología', icon: Eye, color: 'text-blue-500' },
  { id: 'pediatria', name: 'Pediatría', icon: User, color: 'text-green-500' },
  { id: 'medicina', name: 'Medicina General', icon: Stethoscope, color: 'text-cyan-500' },
];

const faqItems = [
  {
    question: '¿Cómo puedo solicitar una hora médica?',
    answer: 'Puedes solicitar tu hora a través de nuestro chatbot, llamando al +56 2 2712 0000, o agendando directamente en nuestro centro médico.',
  },
  {
    question: '¿Qué documentos necesito para atenderme?',
    answer: 'Debes presentar tu cédula de identidad, comprobante de pago de tu/isapre o efectivo, y orden médica si corresponde a tu prestación.',
  },
  {
    question: '¿Cuáles son los horarios de atención?',
    answer: 'Nuestro horario es de lunes a viernes de 08:00 a 20:00 horas, y sábados de 09:00 a 14:00 horas. Urgencias 24/7.',
  },
  {
    question: '¿Tienen convenios con isapres?',
    answer: 'Sí, tenemos convenios con las principales isapres: Banmédica, Vida, Consalud, MasVIDA, y más. Consulta directamente con tu aseguradora.',
  },
  {
    question: '¿Cómo prepagararme para un examen?',
    answer: 'Para estudios como exámenes de laboratorio debes presentar orden médica vigente, acudir en ayunas de 12 horas, y llegar 15 minutos antes.',
  },
  {
    question: '¿Qué hacer en caso de urgencia?',
    answer: 'Para urgencias graves llama al 131 o asiste directamente a nuestro servicio de urgencias 24/7. Para consultas urgentes agenda con prioritize.',
  },
];

const quickReplies = [
  '📅 Solicitar hora',
  '🩺 Consultar especialidad',
  '🕐 Horarios de atención',
  '💳 Información de obras sociales',
  '🧪 Preparaciones para estudios',
  '📍 Sedes y direcciones',
];

const demoConversations = [
  {
    id: '1',
    name: 'María González',
    lastMessage: 'Gracias, me llamaron para mañana a las 10:00',
    time: '14:32',
    status: 'resolved',
    avatar: null,
  },
  {
    id: '2',
    name: 'Roberto Soto',
    lastMessage: 'Tengo dolor en el pecho, es grave?',
    time: '14:28',
    status: 'in_progress',
    avatar: null,
  },
  {
    id: '3',
    name: 'Ana Martínez',
    lastMessage: 'Cuándo vienen mis resultados?',
    time: '14:15',
    status: 'waiting',
    avatar: null,
  },
];

const demoStats = {
  totalConversations: 247,
  activeConversations: 23,
  resolvedToday: 189,
  avgResponseTime: '2m 34s',
  satisfaction: 4.6,
  slaCompliance: 94.2,
};

export default function DemoPage() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    {
      id: '1',
      from: 'bot',
      text: '👋 ¡Bienvenido a Clínica San Juan! Soy el asistente virtual.\n\nEstoy aquí para ayudarte con:\n\n• 📅 Solicitar horas médicas\n• 📋 Resultados de exámenes\n• 🕐 Horarios de atención\n• 💳 Información deCoverage\n• 🏥 Servicios\n\n¿En qué puedo ayudarte?',
      time: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'demo'>('demo');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      from: 'user',
      text: inputValue,
      time: new Date(),
    };
    
    setMessages([...messages, userMessage]);
    setInputValue('');

    setTimeout(() => {
      const botResponse = {
        id: (Date.now() + 1).toString(),
        from: 'bot',
        text: getBotResponse(inputValue),
        time: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const getBotResponse = (text: string): string => {
    const lower = text.toLowerCase();
    
    if (lower.includes('turno') || lower.includes('hora') || lower.includes('solicitar')) {
       return '📅 Para solicitar una hora médica, necesito saber:\n\n1. ¿Qué especialidad necesitas?\n2. ¿Tienes médico preferido?\n3. ¿Qué días te conviene?\n\nPuedes responder aquí o agendar directamente en nuestras sedes.';
    }
    
    if (lower.includes('especialidad') || lower.includes('médico')) {
      return '🏥 Nuestras especialidades:\n\n• Cardiología\n• Neurología\n• Traumatología\n• Oftalmología\n• Pediatría\n• Medicina General\n• ...y más\n\n¿Cuál necesitas?';
    }
    
    if (lower.includes('resultado') || lower.includes('examen')) {
      return '📋 Para consultar resultados de exámenes, necesitas:\n\n• Tu numero de identificación\n• Fecha del examen\n\nLos resultados están disponibles 48-72 horas después en nuestro portal online o en recepción.';
    }
    
    if (lower.includes('horario')) {
      return '🕐 Nuestros horarios:\n\n• Lunes a viernes: 08:00 - 20:00\n• Sábado: 09:00 - 14:00\n• Urgencias: 24/7\n\n¿Hay algo más en lo que pueda ayudarte?';
    }
    
    if (lower.includes('obra social') || lower.includes('isapre') || lower.includes('coverage')) {
      return '💳 Trabajamos con las principales isapres:\n\n• Banmédica\n• Vida\n• Consalud\n• MasVIDA\n• Colmena\n• Cruz del Sur\n\nConsulta directamente con tu aseguradora para confirmar tu cobertura.';
    }
    
    if (lower.includes('urgencia') || lower.includes('grave') || lower.includes('dolor')) {
      return '⚠️ Para situaciones de urgencia:\n\n• Llama al 131 (SAMU)\n• O asiste directamente a urgencias 24/7\n\nTu seguridad es prioridad. ¿Necesitas que te derive a un agente ahora?';
    }
    
    return 'No entiendo completamente. ¿Podrías reformular o escribir "hablar con humano" para que te atienda un agente?';
  };

  const handleQuickReply = (reply: string) => {
    setInputValue(reply);
    setTimeout(() => {
      const userMessage = {
        id: Date.now().toString(),
        from: 'user',
        text: reply,
        time: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
      
      setTimeout(() => {
        const botResponse = {
          id: (Date.now() + 1).toString(),
          from: 'bot',
          text: getBotResponse(reply),
          time: new Date(),
        };
        setMessages(prev => [...prev, botResponse]);
      }, 800);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Clínica San Juan</h1>
              <p className="text-xs text-slate-500">Centro Médico Demo</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Ingresar
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              Demo Completa
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium mb-4">
              <Shield className="w-4 h-4" />
              Demo Comercial - Clínica San Juan
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
              Atención médica{' '}
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                inteligente
              </span>{' '}
              24/7
            </h2>
            <p className="mt-6 text-lg text-slate-600">
              Asistente virtual con IA que guía a tus pacientes, agenda turnos,
              resuelve dudas y escala a agentes humanos cuando sea necesario.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => setChatOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-xl hover:shadow-xl transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                Probar CHAT
              </button>
              <Link
                href="/login"
                className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 font-medium rounded-xl border border-slate-200 hover:shadow-lg transition-all"
              >
                <BarChart3 className="w-5 h-5" />
                Ver Dashboard
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Sin setup requerido
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Datos simulados
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Listo para mostrar
              </div>
            </div>
          </div>
          
          {/* Preview Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-3xl blur-2xl opacity-30" />
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/20">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Asistente San Juan</p>
                      <p className="text-white/70 text-xs">En línea ahora</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-white/70 text-xs">Activo</span>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-3 min-h-[300px] max-h-[400px] overflow-y-auto">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                        msg.from === 'user'
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.from === 'user' ? 'text-white/70' : 'text-slate-400'}`}>
                        {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-slate-100">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply}
                      onClick={() => handleQuickReply(reply)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs rounded-full whitespace-nowrap transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Escribe tu consulta..."
                    className="flex-1 px-3 py-2 bg-slate-100 rounded-lg text-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Especialidades */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-center text-sm font-medium text-slate-500 uppercase tracking-wider mb-8">
            Especialidades Disponibles
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {medicalSpecialties.map((spec) => {
              const Icon = spec.icon;
              return (
                <div
                  key={spec.id}
                  className="flex flex-col items-center p-4 rounded-xl bg-slate-50 hover:bg-white hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className={`w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${spec.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{spec.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-slate-900 mb-8">
            Preguntas Frecuentes
          </h3>
          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <FAQItem key={index} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* Demo Dashboard Preview */}
      <section className="py-16 px-4 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white">
              Panel de Administración
            </h3>
            <p className="text-slate-400 mt-2">
              Dashboard profesional con métricas en tiempo real
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {[
              { label: 'Conversaciones', value: demoStats.totalConversations, icon: MessageCircle },
              { label: 'Activas', value: demoStats.activeConversations, icon: Activity },
              { label: 'Resueltas', value: demoStats.resolvedToday, icon: Check },
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

          <div className="flex justify-center gap-4">
            <Link
              href="/login"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-xl hover:shadow-xl transition-all"
            >
              <BarChart3 className="w-5 h-5" />
              Ver Dashboard Completo
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-all"
            >
              <Download className="w-5 h-5" />
              Exportar Reportes
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mb-3">
              <MapPin className="w-6 h-6 text-cyan-600" />
            </div>
            <h4 className="font-medium text-slate-900">Dirección</h4>
            <p className="text-sm text-slate-500 mt-1">Av. Libertador 1440, Santiago</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mb-3">
              <Phone className="w-6 h-6 text-cyan-600" />
            </div>
            <h4 className="font-medium text-slate-900">Teléfono</h4>
            <p className="text-sm text-slate-500 mt-1">+56 2 2712 0000</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mb-3">
              <Mail className="w-6 h-6 text-cyan-600" />
            </div>
            <h4 className="font-medium text-slate-900">Email</h4>
            <p className="text-sm text-slate-500 mt-1">Francocornejoc15@gmail.com</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-slate-400" />
            <span className="text-sm text-slate-500">© 2026 Clínica San Juan - Demo</span>
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
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-white font-medium">Asistente</p>
                </div>
                <button
                  onClick={() => setChatOpen(false)}
                  className="text-white/80 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-xl ${
                      msg.from === 'user'
                        ? 'bg-cyan-500 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-slate-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 px-3 py-2 bg-slate-100 rounded-lg text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-cyan-500 text-white rounded-lg"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón flotante */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform z-50"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </button>
      )}
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <span className="font-medium text-slate-900">{question}</span>
        {open ? <Minus className="w-5 h-5 text-slate-400" /> : <Plus className="w-5 h-5 text-slate-400" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="px-4 pb-4 text-sm text-slate-600">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}