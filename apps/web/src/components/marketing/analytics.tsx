'use client';

import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Users, 
  MessageCircle,
  Clock,
  CheckCircle,
  PieChart,
  ArrowRight,
  Calendar,
  Activity,
  FileSpreadsheet,
  FileText
} from 'lucide-react';

const metrics = [
  {
    icon: MessageCircle,
    title: 'Conversaciones',
    sub: '/mes',
    value: '2,847',
    change: '+12%',
    positive: true,
  },
  {
    icon: Users,
    title: 'Pacientes únicos',
    sub: '/mes',
    value: '1,523',
    change: '+8%',
    positive: true,
  },
  {
    icon: CheckCircle,
    title: 'Resolución IA',
    sub: '',
    value: '68%',
    change: '+5%',
    positive: true,
  },
  {
    icon: Clock,
    title: 'Tiempo promedio',
    sub: 'respuesta',
    value: '2.4s',
    change: '-15%',
    positive: true,
  },
];

const reportTypes = [
  { icon: FileSpreadsheet, title: 'Excel', description: 'Datos crudos para análisis' },
  { icon: FileText, title: 'PDF', description: 'Reportes formales' },
  { icon: BarChart3, title: 'Gráficos', description: 'Visualizaciones embebidas' },
];

export function Analytics() {
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
              Analíticas
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Mide, analiza y mejora
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Cada conversación genera datos valiosos. Obtén insights en tiempo real 
              y toma decisiones basadas en evidencia.
            </p>
          </motion.div>
        </div>

        {/* Metrics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <metric.icon className="w-5 h-5 text-primary-600" />
                </div>
                <span className={`text-sm font-medium ${metric.positive ? 'text-success-600' : 'text-danger-600'}`}>
                  {metric.change}
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {metric.value}
                <span className="text-sm font-normal text-gray-500">{metric.sub}</span>
              </p>
              <p className="text-sm text-gray-500">{metric.title}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gray-900 rounded-3xl p-8 mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-white font-semibold">Dashboard en tiempo real</h3>
            <span className="text-gray-400 text-sm">Última actualización: ahora</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Chart Area */}
            <div className="lg:col-span-2 bg-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-white font-medium">Conversaciones por día</h4>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">Semana</span>
                  <span className="px-2 py-1 bg-primary-500 rounded text-xs text-white">Mes</span>
                </div>
              </div>
              {/* Fake Chart */}
              <div className="flex items-end gap-2 h-48">
                {[40, 65, 45, 80, 55, 70, 90].map((height, i) => (
                  <div key={i} className="flex-1 bg-gradient-to-t from-primary-600 to-primary-500 rounded-t-lg" style={{ height: `${height}%` }} />
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span>
              </div>
            </div>

            {/* Side Stats */}
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-2xl p-4">
                <p className="text-gray-400 text-sm mb-2">Distribución por canal</p>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white">Web</span>
                      <span className="text-gray-400">45%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full">
                      <div className="h-full w-[45%] bg-primary-500 rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white">WhatsApp</span>
                      <span className="text-gray-400">42%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full">
                      <div className="h-full w-[42%] bg-green-500 rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white">Email</span>
                      <span className="text-gray-400">13%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full">
                      <div className="h-full w-[13%] bg-gray-500 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-2xl p-4">
                <p className="text-gray-400 text-sm mb-2">Intenciones más frecuentes</p>
                <div className="space-y-2">
                  {['Agendar turno', 'Consultar turno', 'Información'].map((intent, i) => (
                    <div key={intent} className="flex justify-between text-sm">
                      <span className="text-white">{intent}</span>
                      <span className="text-gray-400">{85 - i * 20}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Export Section */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Exportación de reportes
              </h3>
              <p className="text-gray-600">
                Programa reportes automáticos y descárgalos en el formato que necesites.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4">
              {reportTypes.map((type) => (
                <div
                  key={type.title}
                  className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 hover:border-primary-300 transition-colors"
                >
                  <type.icon className="w-6 h-6 text-primary-600" />
                  <div>
                    <p className="font-medium text-gray-900">{type.title}</p>
                    <p className="text-xs text-gray-500">{type.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}