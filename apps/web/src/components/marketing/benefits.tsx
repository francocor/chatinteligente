'use client';

import { motion } from 'framer-motion';
import { 
  Clock, 
  DollarSign, 
  Heart, 
  Users, 
  TrendingUp, 
  Shield,
  Calendar,
  MessageCircle,
  Star,
  ArrowUpRight,
  CheckCircle
} from 'lucide-react';

const benefits = [
  {
    category: 'Pacientes',
    items: [
      {
        icon: Clock,
        title: 'Respuesta inmediata 24/7',
        description: 'Cada paciente recibe atención instantánea, incluso a las 3am o holidays.',
        metric: '2 seg',
        metricLabel: 'tiempo promedio de respuesta',
      },
      {
        icon: Heart,
        title: 'Experiencia personalizada',
        description: 'El asistente recuerda preferencias y contexto, ofreciendo una atención cálida y efectiva.',
        metric: '94%',
        metricLabel: 'satisfacción de pacientes',
      },
      {
        icon: Calendar,
        title: 'Gestión de turnos simplificada',
        description: 'Reservas, reprogramaciones y cancelaciones automatizadas sin intervención del staff.',
        metric: '78%',
        metricLabel: 'de reservas automatizadas',
      },
    ],
  },
  {
    category: 'Equipo Médico',
    items: [
      {
        icon: Users,
        title: 'Reducción de carga operativa',
        description: 'El equipo se enfoca en lo importante: la atención médica de calidad.',
        metric: '60%',
        metricLabel: 'menos consultas repetitivas',
      },
      {
        icon: MessageCircle,
        title: 'Contexto completo',
        description: 'Cada conversación llega con historial previo, evitando que el paciente repita su situación.',
        metric: '100%',
        metricLabel: 'de contexto disponible',
      },
      {
        icon: TrendingUp,
        title: 'Herramientas de asistencia',
        description: 'Respuestas sugeridas, base de conocimientos y notas rápidas para atención eficiente.',
        metric: '35%',
        metricLabel: 'más rápido por consulta',
      },
    ],
  },
  {
    category: 'Gestión',
    items: [
      {
        icon: DollarSign,
        title: 'Reducción de costos',
        description: 'Automatización que disminuye la necesidad de personal administrativo sin perder calidad.',
        metric: '40%',
        metricLabel: 'ahorro en costos operativos',
      },
      {
        icon: Star,
        title: 'Mejora en reputación',
        description: 'Pacientes satisfechos dejaron reseñas positivas y recomiendan la clínica.',
        metric: '4.8/5',
        metricLabel: 'puntuación promedio',
      },
      {
        icon: Shield,
        title: 'Compliance y trazabilidad',
        description: 'Cada interacción queda registrada para auditoría y mejora continua.',
        metric: '100%',
        metricLabel: 'de conversaciones trazables',
      },
    ],
  },
];

const keyMetrics = [
  { value: '40%', label: 'Reducción de costos' },
  { value: '94%', label: 'Satisfacción' },
  { value: '68%', label: 'Resolución IA' },
  { value: '24/7', label: 'Disponibilidad' },
];

export function Benefits() {
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
              Beneficios
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Impacto medible en tu clínica
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Resultados concretos que transforman la operación, la experiencia del paciente 
              y los indicadores de tu centro médico.
            </p>
          </motion.div>
        </div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {keyMetrics.map((metric, index) => (
            <div
              key={metric.label}
              className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-center text-white"
            >
              <p className="text-4xl font-bold mb-1">{metric.value}</p>
              <p className="text-primary-100 text-sm">{metric.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Benefits by Category */}
        {benefits.map((category, catIndex) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 last:mb-0"
          >
            {/* Category Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-gray-200" />
              <h3 className="text-xl font-bold text-gray-900">{category.category}</h3>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Category Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {category.items.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <benefit.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary-600">{benefit.metric}</p>
                      <p className="text-xs text-gray-500">{benefit.metricLabel}</p>
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-primary-50 rounded-2xl p-8 text-center"
        >
          <p className="text-lg text-primary-800 font-medium">
            Estos resultados son basados en datos reales de clínicas que ya usan la plataforma.
          </p>
          <p className="text-primary-600 text-sm mt-2">
            Los indicadores pueden variar según el tipo de clínica y volumen de pacientes.
          </p>
        </motion.div>
      </div>
    </section>
  );
}