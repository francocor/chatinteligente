'use client';

import { motion } from 'framer-motion';
import {
  Clock,
  Phone,
  Mail,
  Users,
  XCircle,
  CheckCircle,
  AlertCircle,
  Building,
  ShoppingCart,
  PhoneCall,
  TrendingUp,
  DollarSign,
  Star,
  Heart,
  Inbox,
  BarChart3,
  Zap,
  UserCheck,
} from 'lucide-react';

const problems = [
  {
    icon: Clock,
    title: 'Atención limitada al horario laboral',
    description: 'Solo atienden dentro del horario de oficina. Los clientes fuera de ese rango quedan sin respuesta.',
    impact: '72% de consultas llegan fuera del horario',
  },
  {
    icon: Phone,
    title: 'Canales saturados y esperas infinitas',
    description: 'Teléfonos que no se atienden, emails que tardan días y clientes que se van a la competencia.',
    impact: 'Promedio de 8 minutos de espera',
  },
  {
    icon: Inbox,
    title: 'Mensajes dispersos sin trazabilidad',
    description: 'WhatsApp, email, web y redes sociales sin unificar. Cada consulta vive en un canal diferente.',
    impact: '48 horas de promedio de respuesta por email',
  },
  {
    icon: Users,
    title: 'Equipo saturado con consultas repetitivas',
    description: 'Agentes respondiendo lo mismo una y otra vez, sin tiempo para los casos que realmente lo necesitan.',
    impact: '60% de las consultas son preguntas frecuentes',
  },
];

const solutions = [
  {
    icon: Zap,
    badge: 'IA',
    title: 'Asistencia automática 24/7',
    description: 'Tu asistente virtual responde al instante, todos los días, sin depender del horario del equipo.',
  },
  {
    icon: TrendingUp,
    badge: 'Omnicanal',
    title: 'Bandeja unificada de conversaciones',
    description: 'WhatsApp, web, email y redes en un solo panel. Tu equipo ve todo, sin cambiar de app.',
  },
  {
    icon: UserCheck,
    badge: 'Derivación',
    title: 'Escalado inteligente a agente humano',
    description: 'Cada cliente se siente atendido. La IA maneja lo rutinario, los agentes resuelven lo importante.',
  },
  {
    icon: DollarSign,
    badge: 'Métricas',
    title: 'Reducción de costos con datos reales',
    description: 'Automatizá lo repetitivo, medí cada interacción y tomá decisiones con reportes accionables.',
  },
];

const industries = [
  { icon: ShoppingCart, name: 'E-commerce', count: '120+' },
  { icon: Heart, name: 'Salud y Bienestar', count: '85+' },
  { icon: Building, name: 'Servicios Profesionales', count: '95+' },
  { icon: PhoneCall, name: 'Soporte Técnico', count: '75+' },
  { icon: BarChart3, name: 'Finanzas y Seguros', count: '60+' },
];

export function ProblemSolution() {
  return (
    <section className="py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 bg-danger-500/20 text-danger-400 rounded-full text-sm font-medium mb-4">
              El Problema
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              La atención al cliente tiene cuellos de botella
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Cada día, tu empresa pierde oportunidades valiosas por procesos lentos,
              canales desconectados y equipos saturados.
            </p>
          </motion.div>
        </div>

        {/* Problems Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 hover:border-danger-500/30 transition-colors group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-danger-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-danger-500/30 transition-colors">
                  <problem.icon className="w-6 h-6 text-danger-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">{problem.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{problem.description}</p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-danger-500/10 rounded-full">
                    <AlertCircle className="w-3.5 h-3.5 text-danger-400" />
                    <span className="text-xs font-medium text-danger-400">{problem.impact}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Solution Divider */}
        <div className="flex items-center justify-center mb-16">
          <div className="h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent w-32" />
          <div className="mx-4 w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg shadow-primary-500/30">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent w-32" />
        </div>

        {/* Solution Title */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 bg-primary-500/20 text-primary-400 rounded-full text-sm font-medium mb-4">
              La Solución
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Atención inteligente, sin perder el toque humano
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Un asistente de IA que trabaja junto a tu equipo — resuelve lo rutinario,
              escala lo importante y mide todo en tiempo real.
            </p>
          </motion.div>
        </div>

        {/* Solutions Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-gray-800/60 to-gray-800/30 border border-gray-700 rounded-2xl p-6 hover:border-primary-500/30 transition-colors group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500/30 transition-colors">
                  <solution.icon className="w-6 h-6 text-primary-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-white">{solution.title}</h3>
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-primary-500/20 text-primary-400 rounded-full">
                      {solution.badge}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{solution.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Industries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-gray-400 text-sm mb-8">
            Usado por más de 500 empresas en distintos rubros
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {industries.map((industry) => (
              <motion.div
                key={industry.name}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 cursor-default"
              >
                <div className="w-10 h-10 bg-gray-700/80 rounded-lg flex items-center justify-center hover:bg-gray-600/80 transition-colors">
                  <industry.icon className="w-5 h-5 text-gray-300" />
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold text-sm">{industry.name}</p>
                  <p className="text-gray-400 text-xs">{industry.count} empresas</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
