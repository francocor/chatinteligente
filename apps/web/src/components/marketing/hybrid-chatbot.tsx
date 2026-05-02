'use client';

import { motion } from 'framer-motion';
import { 
  Bot, 
  MessageSquare, 
  GitBranch, 
  Zap, 
  Brain, 
  BookOpen, 
  Languages, 
  Target,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'IA Conversacional Avanzada',
    description: 'Lenguaje natural que entiende contexto, entidades y sentimiento. No solo responde, comprende.',
    details: ['GPT-4 + fine-tuning', 'Detección de intención', 'Análisis de sentimiento'],
  },
  {
    icon: GitBranch,
    title: 'Flujos Guiados Visuales',
    description: 'Editor drag-and-drop para crear flujos de atención sin escribir código.',
    details: ['Nodos condicionales', 'Integración con acciones', 'Versionado de flujos'],
  },
  {
    icon: BookOpen,
    title: 'Base de Conocimientos',
    description: 'Carga PDFs, documentos y FAQs. La IA busca y cita las fuentes exactas.',
    details: ['Búsqueda semántica', 'Citations automáticas', 'Documentos ilimitados'],
  },
  {
    icon: Languages,
    title: 'Multi-idioma Nativo',
    description: 'El chatbot detecta el idioma y responde en el mismo idioma del paciente.',
    details: ['Español, Inglés, Portugués', 'Cambio automático', 'Personalización por idioma'],
  },
  {
    icon: Target,
    title: 'Alta Precisión',
    description: 'Umbrales configurables de confianza. Si no está seguro, deriva a humano.',
    details: ['85%+ confianza', 'Fallback inteligente', 'Mejora continua'],
  },
  {
    icon: Zap,
    title: 'Tiempo Real',
    description: 'Respuestas en menos de 2 segundos. Los pacientes nunca esperan.',
    details: ['<2s respuesta', 'Procesamiento paralelo', 'Escala infinita'],
  },
];

export function HybridChatbot() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
              Motor Híbrido
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Lo mejor de ambos mundos
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Combina la velocidad de los flujos guiados tradicionales con la inteligencia 
              del lenguaje natural más avanzado.
            </p>
          </motion.div>
        </div>

        {/* Main Feature Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-16"
        >
          <div className="grid lg:grid-cols-2">
            {/* Left - Demo */}
            <div className="p-8 lg:p-12 bg-gradient-to-br from-primary-500 to-primary-600">
              <div className="text-white mb-6">
                <h3 className="text-2xl font-bold mb-2">Demo del Chatbot</h3>
                <p className="text-primary-100">Mira cómo funciona en tiempo real</p>
              </div>

              {/* Chat Demo */}
              <div className="bg-white/10 backdrop-blur rounded-2xl p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white/20 rounded-2xl rounded-tl-sm p-3 max-w-[80%]">
                    <p className="text-white text-sm">Hola! Necesito información sobre neurología</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 flex-row-reverse">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <span className="text-primary-600 text-xs font-bold">MG</span>
                  </div>
                  <div className="bg-white rounded-2xl rounded-tr-sm p-3 max-w-[80%]">
                    <p className="text-gray-700 text-sm">Tengo dolor de cabeza frecuente desde hace 2 semanas</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white/20 rounded-2xl rounded-tl-sm p-3 max-w-[80%]">
                    <p className="text-white text-sm mb-2">
                      Entiendo. Para dolor de cabeza recurrente, te recomiendo evaluación con 
                      nuestro neurólogo. Tenemos disponibilidad esta semana.
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className="px-2 py-1 bg-primary-400/50 rounded text-xs">Jue 10:00</span>
                      <span className="px-2 py-1 bg-primary-400/50 rounded text-xs">Vie 16:00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Features */}
            <div className="p-8 lg:p-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                ¿Qué hace especial a nuestro chatbot?
              </h3>
              
              <div className="space-y-6">
                {features.slice(0, 3).map((feature, index) => (
                  <div key={feature.title} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="#demo"
                className="inline-flex items-center gap-2 mt-6 text-primary-600 font-medium hover:gap-3 transition-all"
              >
                Ver demostración completa <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
              <ul className="space-y-2">
                {feature.details.map((detail) => (
                  <li key={detail} className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircle className="w-3 h-3 text-primary-500 flex-shrink-0" />
                    {detail}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}