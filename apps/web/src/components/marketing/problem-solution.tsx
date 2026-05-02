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
  Stethoscope,
  Heart,
  Building,
  ShoppingCart,
  PhoneCall,
  TrendingUp,
  DollarSign,
  Star
} from 'lucide-react';

const problems = [
  {
    icon: Clock,
    title: 'Atención limitada al horario administrativo',
    description: 'Solo atienden mientras la clínica está abierta. Los pacientes fuera de horario no tienen dónde dirigirse.',
    impact: '72% de consultas ocurren fuera del horario de atención',
  },
  {
    icon: Phone,
    title: 'Teléfonos saturados y esperas infinitas',
    description: 'Llamadas que no se atienden, pacientes colgados, frustración acumulada y oportunidad de atención perdida.',
    impact: 'Promedio de 8 minutos de espera',
  },
  {
    icon: Mail,
    title: 'Emails sin responder por días',
    description: 'Consultas por email que quedan sin respuesta, pacientes buscando alternativas.',
    impact: '48 horas de promedio de respuesta',
  },
  {
    icon: Users,
    title: 'Equipo de atención sobrecargado',
    description: 'Agentes atendiendo lo mismo una y otra vez, sin tiempo para casos complejos.',
    impact: '60% de consultas son repetitivas',
  },
];

const solutions = [
  {
    icon: CheckCircle,
    title: 'Asistencia 24/7 los 365 días',
    description: 'Tu asistente virtual está siempre disponible, respondiendo inmediatamente fuera del horario.',
  },
  {
    icon: TrendingUp,
    title: 'Tiempo de respuesta instantáneo',
    description: 'Respuestas inmediatas a cada paciente, sin esperas, sin frustraciones.',
  },
  {
    icon: Star,
    title: 'Experiencia premium para pacientes',
    description: 'Cada paciente se siente atendido de forma personal e instantánea.',
  },
  {
    icon: DollarSign,
    title: 'Reducción de costos operativos',
    description: 'Automatiza lo repetitivo, enfoca a tu equipo en lo que importa.',
  },
];

const industries = [
  { icon: Stethoscope, name: 'Clínicas Médicas', count: '180+' },
  { icon: Heart, name: 'Centros de Salud', count: '95+' },
  { icon: Building, name: 'Sanatorios', count: '45+' },
  { icon: ShoppingCart, name: 'Retail', count: '120+' },
  { icon: PhoneCall, name: 'Telecom', count: '85+' },
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
              La atención médica tradicional tiene límites
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Cada día, tu clínica pierde pacientes, genera frustración y consume recursos 
              valiosos en tareas que pueden automatizarse.
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
              className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-danger-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <problem.icon className="w-6 h-6 text-danger-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{problem.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{problem.description}</p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-danger-500/10 rounded-full">
                    <AlertCircle className="w-4 h-4 text-danger-400" />
                    <span className="text-sm font-medium text-danger-400">{problem.impact}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Solution Divider */}
        <div className="flex items-center justify-center mb-16">
          <div className="h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent w-32" />
          <div className="mx-4 w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
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
              Atención inteligente las 24 horas
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Un asistente de IA que funciona junto a tu equipo, resolviendo lo inmediato 
              y derivando lo que necesita atención humana.
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
              className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 border border-gray-700 rounded-2xl p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-success-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <solution.icon className="w-6 h-6 text-success-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{solution.title}</h3>
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
          <p className="text-gray-400 text-sm mb-6">
            Ya transformado la atención en más de 500 empresas
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {industries.map((industry) => (
              <div key={industry.name} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                  <industry.icon className="w-5 h-5 text-gray-400" />
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold">{industry.name}</p>
                  <p className="text-gray-400 text-sm">{industry.count} empresas</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}