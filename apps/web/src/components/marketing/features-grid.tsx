'use client';

import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Bot, 
  Users, 
  BarChart3, 
  Zap, 
  Shield, 
  Phone, 
  Mail,
  Globe,
  GitBranch,
  Bell,
  Link2,
  FileText,
  Calendar,
  Clock,
  Building,
  FileSpreadsheet,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const features = [
  { icon: MessageSquare, title: 'Chatbot guiado', description: 'Flujos visuales sin código' },
  { icon: Bot, title: 'IA Conversacional', description: 'Lenguaje natural avanzado' },
  { icon: Users, title: 'Derivación humana', description: 'Automática e inteligente' },
  { icon: BarChart3, title: 'Analíticas', description: 'Métricas en tiempo real' },
  { icon: Zap, title: 'Flujos guiados', description: 'Editor drag-and-drop' },
  { icon: Shield, title: 'Seguridad', description: 'Cumplimiento GDPR' },
  { icon: Phone, title: 'WhatsApp', description: 'Business API integrada' },
  { icon: Mail, title: 'Email', description: 'Conversión a tickets' },
  { icon: Globe, title: 'Web Widget', description: 'Embedding personalizable' },
  { icon: GitBranch, title: 'Condiciones', description: 'Lógica avanzado' },
  { icon: Bell, title: 'Alertas', description: 'Configurables' },
  { icon: Link2, title: 'Webhooks', description: 'Integraciones externas' },
  { icon: FileText, title: 'CSAT', description: 'Encuestas post-chat' },
  { icon: Calendar, title: 'Agenda', description: 'Gestión automática' },
  { icon: Clock, title: 'Colas', description: 'Balanceo automático' },
  { icon: Building, title: 'Multi-empresa', description: 'Un panel para cada cliente' },
  { icon: FileSpreadsheet, title: 'Exportar', description: 'CSV, Excel, PDF' },
  { icon: CheckCircle, title: 'Trazabilidad', description: 'Auditoría completa' },
  { icon: Link2, title: 'API REST', description: 'Integraciones' },
  { icon: Globe, title: 'Dominio propio', description: 'White-label' },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
              Funcionalidades
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Una plataforma completa lista para usar desde el primer día
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.02 }}
              className="bg-white rounded-xl p-4 hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-100"
            >
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center mb-3">
                <feature.icon className="w-5 h-5 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{feature.title}</h3>
              <p className="text-gray-500 text-xs">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* More Features Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">
            ...y muchas más funcionalidades en desarrollo constante
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-primary-600 font-medium hover:gap-3 transition-all"
          >
            Solicitar lista completa <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}