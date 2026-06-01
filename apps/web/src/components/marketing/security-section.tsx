'use client';

import { motion } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  UserCheck, 
  FileText, 
  Eye,
  EyeOff,
  Database,
  CheckCircle,
  Server
} from 'lucide-react';

const features = [
  {
    icon: Lock,
    title: 'Encriptación AES-256',
    description: 'Todos los datos en reposo y en tránsito',
  },
  {
    icon: UserCheck,
    title: 'RBAC Avanzado',
    description: 'Permisos granulares por rol y usuario',
  },
  {
    icon: FileText,
    title: 'Auditoría Completa',
    description: '100% de acciones registradas',
  },
  {
    icon: Database,
    title: 'Aislamiento Multi-tenant',
    description: 'Cada empresa tiene datos completamente separados',
  },
];

const compliance = [
  'GDPR Ready',
  'Ley 25.326 (Argentina)',
  'HIPAA Ready',
  'SOC 2 Type II',
  'ISO 27001',
];

export function Security() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 bg-success-100 text-success-700 rounded-full text-sm font-medium mb-4">
              Seguridad
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Seguridad enterprise diseñada desde el núcleo
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Tus datos empresariales son altamente sensibles.
              Diseñado desde cero con los estándares de seguridad más exigentes.
            </p>

            <div className="space-y-4">
              {features.map((feature) => (
                <div key={feature.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-success-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-success-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 shadow-xl"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Ejemplo de auditoría
            </h3>
            
            <div className="space-y-3">
              {[
                { time: '10:32:15', action: ' login', user: 'admin@empresa.demo', ip: '192.168.1.100' },
                { time: '10:32:20', action: ' VIEW conversation', user: 'admin', id: 'conv_123' },
                { time: '10:33:45', action: ' EXPORT report', user: 'admin', format: 'CSV' },
                { time: '10:35:02', action: ' UPDATE settings', user: 'admin', field: 'whatsapp' },
              ].map((log, i) => (
                <div key={i} className="flex items-center gap-3 text-sm bg-gray-50 rounded-lg p-3">
                  <span className="text-gray-400 font-mono w-20">{log.time}</span>
                  <span className="text-gray-700 font-medium w-40">{log.action}</span>
                  <span className="text-gray-500 w-32 truncate">{log.user}</span>
                  <span className="text-gray-400 text-xs">{log.ip || log.id || log.format}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-500 mb-3">Compliance:</p>
              <div className="flex flex-wrap gap-2">
                {compliance.map((item) => (
                  <span key={item} className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}