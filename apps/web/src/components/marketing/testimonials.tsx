'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Pablo Torres',
    role: 'Gerente de Atención al Cliente',
    company: 'Nova Commerce',
    image: 'PT',
    stars: 5,
    text: 'Automatizamos el 70% de las consultas sobre pedidos y devoluciones. Nuestro equipo ahora se enfoca en los casos que realmente importan. El ROI fue evidente en el primer mes.',
  },
  {
    name: 'Laura Méndez',
    role: 'Directora de Operaciones',
    company: 'InmoPlus Propiedades',
    image: 'LM',
    stars: 5,
    text: 'La integración con WhatsApp fue clave. El 80% de nuestros clientes prefiere WhatsApp para consultar propiedades y coordinar visitas. Multiplicamos nuestra capacidad sin ampliar el equipo.',
  },
  {
    name: 'Sebastián Vidal',
    role: 'Head of Customer Success',
    company: 'DataFlow Soluciones',
    image: 'SV',
    stars: 5,
    text: 'Las analíticas nos permiten optimizar horarios y recursos. Bajamos el tiempo de primera respuesta de 4 horas a 8 minutos. Ya no podemos imaginar operar sin esta plataforma.',
  },
];

const stats = [
  { value: '500+', label: 'Empresas confían' },
  { value: '2.5M+', label: 'Conversaciones/mes' },
  { value: '94%', label: 'Satisfacción' },
  { value: '99.9%', label: 'Uptime' },
];

export function Testimonials() {
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
              Testimonios
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Lo que dicen nuestros clientes
            </h2>
          </motion.div>
        </div>

        {/* Testimonials Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-2xl p-6 relative"
            >
              <Quote className="w-10 h-10 text-primary-200 absolute top-4 right-4" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.stars }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-warning-500 text-warning-500" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 relative z-10">
                &quot;{testimonial.text}&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold">{testimonial.image}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl font-bold text-primary-600">{stat.value}</p>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
