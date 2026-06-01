'use client';

import { motion } from 'framer-motion';
import {
  MessageCircle,
  Phone,
  Image,
  FileText,
  CheckCircle,
  ArrowRight,
  MessageSquare,
  Send,
  Users,
  Clock,
} from 'lucide-react';

const features = [
  {
    icon: MessageSquare,
    title: 'Mensajes bidireccionales',
    description: 'Enviá y recibí mensajes de WhatsApp directamente desde la plataforma, sin cambiar de app.',
  },
  {
    icon: Image,
    title: 'Multimedia completo',
    description: 'Imágenes, documentos, audios y videos. Compartí lo que necesites con tus clientes.',
  },
  {
    icon: FileText,
    title: 'Plantillas oficiales de Meta',
    description: 'Usá las plantillas aprobadas para enviar notificaciones proactivas a tus clientes.',
  },
  {
    icon: Clock,
    title: 'Historial unificado',
    description: 'Todas las conversaciones de WhatsApp en un mismo panel junto al resto de canales.',
  },
];

const templates = [
  { name: 'Confirmación de solicitud', description: 'Al recibir consulta' },
  { name: 'Estado de caso', description: 'Actualización automática' },
  { name: 'Encuesta CSAT', description: 'Post-atención' },
  { name: 'Seguimiento de ticket', description: 'Ticketing activo' },
];

export function WhatsAppIntegration() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm font-medium mb-4">
              WhatsApp Business
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Tus clientes ya están en WhatsApp
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              El 98% de tus clientes prefiere WhatsApp.
              Conectá tus canales de atención y respondé donde ya están.
            </p>
          </motion.div>
        </div>

        {/* Main Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-12 items-center mb-16"
        >
          {/* WhatsApp Mockup */}
          <div className="relative mx-auto max-w-[320px]">
            <div className="bg-white rounded-[2.5rem] p-4 shadow-2xl">
              {/* Header */}
              <div className="bg-green-500 rounded-t-2xl -m-4 mb-4 p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">Empresa Demo</h4>
                  <p className="text-green-100 text-xs">Responde usualmente en minutos</p>
                </div>
              </div>

              {/* Messages */}
              <div className="space-y-3 px-2">
                <div className="flex items-start gap-2">
                  <div className="bg-gray-100 rounded-2xl rounded-bl-sm p-3 max-w-[80%]">
                    <p className="text-sm text-gray-700">
                      Hola! Quiero consultar el estado de mi pedido #45123
                    </p>
                    <p className="text-xs text-gray-400 mt-1">10:30</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 flex-row-reverse">
                  <div className="bg-green-500 rounded-2xl rounded-br-sm p-3 max-w-[80%]">
                    <p className="text-sm text-white">
                      ¡Hola! Tu pedido #45123 fue despachado hoy.
                      Llega mañana antes de las 18hs.
                      ¿Necesitás algo más?
                    </p>
                    <p className="text-xs text-green-200 mt-1">10:31 ✓✓</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="bg-gray-100 rounded-2xl rounded-bl-sm p-3 max-w-[80%]">
                    <p className="text-sm text-gray-700">
                      Genial, gracias! ¿Puedo cambiar la dirección?
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 flex-row-reverse">
                  <div className="bg-green-500 rounded-2xl rounded-br-sm p-3 max-w-[80%]">
                    <p className="text-sm text-white">
                      Te derivo con un asesor para coordinar el cambio. Un momento.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">
              WhatsApp integrado en tu plataforma de atención
            </h3>

            <div className="space-y-4">
              {features.map((feature) => (
                <div key={feature.title} className="flex items-start gap-4 group">
                  <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/30 transition-colors">
                    <feature.icon className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="#demo"
              className="inline-flex items-center gap-2 mt-8 text-green-400 font-medium hover:gap-3 transition-all"
            >
              Solicitar demo de WhatsApp <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>

        {/* Templates Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-center font-semibold text-white mb-8">
            Notificaciones automáticas por WhatsApp
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {templates.map((template) => (
              <div
                key={template.name}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center hover:border-green-500/50 hover:bg-gray-800/80 transition-all cursor-default"
              >
                <MessageCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
                <p className="text-white font-medium text-sm">{template.name}</p>
                <p className="text-gray-500 text-xs mt-1">{template.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 rounded-full shadow-lg shadow-green-500/25">
            <Phone className="w-5 h-5 text-white" />
            <span className="text-white font-medium">
              Configuramos tu WhatsApp Business sin costo adicional
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
