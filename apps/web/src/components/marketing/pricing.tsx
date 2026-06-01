'use client';

import { motion } from 'framer-motion';
import { Check, X, ArrowRight } from 'lucide-react';

const plans = [
  {
    name: 'Básico',
    price: '$99',
    period: '/mes',
    description: 'Para equipos pequeños',
    highlight: false,
    features: [
      '500 conversaciones/mes',
      '1 agente',
      'Web Widget',
      'IA básica (GPT-3.5)',
      'Reportes básicos',
      'Soporte email',
    ],
    notIncluded: ['WhatsApp', 'Flujos ilimitados', 'API'],
  },
  {
    name: 'Profesional',
    price: '$299',
    period: '/mes',
    description: 'Para empresas en crecimiento',
    highlight: true,
    features: [
      '2,500 conversaciones/mes',
      '5 agentes',
      'Web + WhatsApp',
      'IA avanzada (GPT-4)',
      'Flujos ilimitados',
      'Analíticas avanzadas',
      'Reportes automatizados',
      'Soporte prioritario',
    ],
    notIncluded: ['API acceso'],
  },
  {
    name: 'Empresarial',
    price: 'Custom',
    period: '',
    description: 'Para grandes organizaciones',
    highlight: false,
    features: [
      'Conversaciones ilimitadas',
      'Agentes ilimitados',
      'Todos los canales',
      'IA personalizada',
      'API acceso',
      'Account manager',
      'SLA 99.9%',
      'Onboarding dedicado',
    ],
    notIncluded: [],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
              Precios
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Planes flexibles para cada etapa
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Empieza gratis, escala cuando necesites. Sin permanencia, cancela cuando quieras.
            </p>
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white rounded-2xl p-8 ${
                plan.highlight 
                  ? 'ring-2 ring-primary-500 shadow-xl scale-105' 
                  : 'border border-gray-200'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-500 text-white text-sm font-medium rounded-full">
                  Más popular
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period && <span className="text-gray-500">{plan.period}</span>}
                </div>
                <p className="text-gray-500 text-sm mt-1">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check className="w-5 h-5 text-success-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
                {plan.notIncluded.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <X className="w-5 h-5 text-gray-300 flex-shrink-0" />
                    <span className="text-gray-400">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="/register"
                className={`block w-full text-center py-3 rounded-xl font-medium transition-all ${
                  plan.highlight
                    ? 'bg-primary-500 text-white hover:bg-primary-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {plan.price === 'Custom' ? 'Contactar Ventas' : 'Comenzar prueba'}
              </a>
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-500">
            Todos los planes incluyen prueba gratis de 14 días. Sin tarjeta requerida para empezar.
          </p>
        </motion.div>
      </div>
    </section>
  );
}