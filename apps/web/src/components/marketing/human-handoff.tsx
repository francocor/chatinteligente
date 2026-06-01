'use client';

import { motion } from 'framer-motion';
import { 
  Users, 
  Headphones, 
  MessageCircle, 
  Clock, 
  UserCheck,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'Derivación automática',
    description: 'El sistema detecta cuándo un caso necesita atención humana y deriva automáticamente.',
    detail: 'IA analiza sentimiento, intención y complejidad',
  },
  {
    icon: UserCheck,
    title: 'Selección inteligente',
    description: 'El caso se asigna al agente más indicado por skill, disponibilidad y carga.',
    detail: 'Colas por especialidad disponibles',
  },
  {
    icon: MessageCircle,
    title: 'Contexto compartido',
    description: 'El agente recibe el historial completo antes de responder. Sin preguntas repetidas.',
    detail: 'Resumen, intents y datos capturados',
  },
  {
    icon: Headphones,
    title: 'Herramientas de asistencia',
    description: 'Respuestas sugeridas, base de conocimientos yNotas rápidas integradas.',
    detail: 'Acelera la resolución',
  },
];

const workflow = [
  { step: '1', title: 'Cliente no queda satisfecho', description: 'O solicita hablar con una persona' },
  { step: '2', title: 'IA detecta la necesidad', description: 'Análisis en tiempo real' },
  { step: '3', title: 'Derivación automática', description: 'Al agente disponible' },
  { step: '4', title: 'Atención personalizada', description: 'Contexto completo' },
];

export function HumanHandoff() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
              humana
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Cuando hace falta,Derivación fluida
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              La IA sabe cuándo derivar. Los casos complejos reciben atención humana 
              con todo el contexto necesario para una resolución efectiva.
            </p>
          </motion.div>
        </div>

        {/* Main Visual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 lg:p-12 mb-16"
        >
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            {/* Left - AI */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Chatbot IA</h4>
                  <p className="text-xs text-gray-500">Intent: schedule_appointment</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs">70% confianza</span>
                </div>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm text-gray-500">Cliente: "¿Puedo hablar con una persona?"</p>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                <ArrowRight className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Right - Human Agent */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold">Agente Asignado</h4>
                  <p className="text-xs text-primary-100">Laura Méndez — Atención al Cliente</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>Contexto compartido</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>Historial del cliente</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>Intención detectada por IA</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{feature.description}</p>
              <p className="text-xs text-primary-600">{feature.detail}</p>
            </motion.div>
          ))}
        </div>

        {/* Workflow */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <h3 className="text-center font-semibold text-gray-900 mb-8">
            Flujo automático de derivación
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {workflow.map((item, index) => (
              <div key={item.step} className="flex items-center">
                <div className="text-center">
                  <div className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold mb-2">
                    {item.step}
                  </div>
                  <p className="text-sm font-medium text-gray-900 max-w-[120px]">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
                {index < workflow.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-gray-400 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 gap-6 mt-16"
        >
          <div className="text-center">
            <p className="text-4xl font-bold text-primary-600">32%</p>
            <p className="text-gray-600">derivados a agentes</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-primary-600">4.2 min</p>
            <p className="text-gray-600">tiempo hasta agen</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-primary-600">91%</p>
            <p className="text-gray-600">resuelto en primer contacto</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}