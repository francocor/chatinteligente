'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Brain, BarChart3, ArrowRight, CheckCircle, Zap } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'El cliente escribe',
    description: 'Tu cliente inicia una conversación desde WhatsApp, tu web o email. El sistema detecta el canal automáticamente y abre la sesión.',
    icon: MessageCircle,
    details: ['Web widget embebible', 'WhatsApp Business', 'Email y más canales'],
  },
  {
    number: '02',
    title: 'La IA responde — o deriva',
    description: 'El motor de IA entiende el mensaje, consulta tu base de conocimientos y responde al instante. Si el caso lo requiere, escala al agente correcto con todo el contexto.',
    icon: Brain,
    details: ['Lenguaje natural', 'Base de conocimientos', 'Derivación inteligente'],
  },
  {
    number: '03',
    title: 'Tu equipo gestiona y mide',
    description: 'Todas las conversaciones en un dashboard unificado. Tu equipo responde, asigna y cierra casos. Cada interacción genera métricas accionables.',
    icon: BarChart3,
    details: ['Métricas en tiempo real', 'Reportes automatizados', 'Mejora continua con IA'],
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
              Cómo Funciona
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Tres pasos. Toda la potencia.
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Un flujo automático que combina inteligencia artificial con atención humana
              para crear la mejor experiencia de cliente.
            </p>
          </motion.div>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-200 via-primary-500 to-primary-200 -translate-y-1/2" />

          <div className="grid lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative z-10 hover:shadow-xl transition-all hover:-translate-y-1 duration-300">
                  {/* Number Badge */}
                  <div className="absolute -top-4 left-6 w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25">
                    <span className="text-white font-bold">{step.number}</span>
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mt-6 mb-4">
                    <step.icon className="w-6 h-6 text-primary-600" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{step.description}</p>

                  {/* Details */}
                  <ul className="space-y-2">
                    {step.details.map((detail) => (
                      <li key={detail} className="flex items-center gap-2 text-xs text-gray-500">
                        <CheckCircle className="w-4 h-4 text-primary-500 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-4 -translate-y-1/2 z-20">
                    <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-primary-500" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary-50 rounded-full">
            <Zap className="w-5 h-5 text-primary-500" />
            <span className="text-primary-700 font-medium">
              Configuración en menos de 5 minutos — sin código
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
