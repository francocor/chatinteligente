'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageSquare, ArrowRight, Mail, Phone, MapPin, Twitter, Linkedin, Instagram, Github } from 'lucide-react';

export function CTA() {
  return (
    <section id="contact" className="py-24 bg-gradient-to-br from-primary-600 to-primary-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Transforma tu atención hoy
          </h2>
          <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            Únete a las 500+ empresas que ya están ofreciendo
            atención inteligente 24/7. Prueba gratis 14 días, sin compromiso.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-xl"
            >
             Comenzar prueba gratis
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#demo"
              className="inline-flex items-center gap-2 bg-transparent border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/10 transition-all"
            >
              Solicitar demo
            </a>
          </div>

          <div className="flex items-center justify-center gap-8 mt-8 text-primary-100 text-sm">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" /> Sin tarjeta
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" /> Configuración en 5 min
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" /> Cancelación flexible
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Check({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Atención IA</span>
            </Link>
            <p className="text-gray-400 text-sm mb-6 max-w-xs">
              La plataforma de atención al cliente impulsada por inteligencia artificial.
              Para empresas de todos los rubros.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Producto</h4>
            <ul className="space-y-3">
              <li><a href="#features" className="text-gray-400 hover:text-white text-sm">Características</a></li>
              <li><a href="#pricing" className="text-gray-400 hover:text-white text-sm">Precios</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Integraciones</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">API Docs</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Empresa</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Sobre Nosotros</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Carreras</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-white text-sm">Contacto</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Privacidad</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Términos</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Cookies</a></li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="flex flex-wrap items-center justify-center gap-8 text-gray-400 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>hola@atencionia.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>+54 11 1234-5678</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Buenos Aires, Argentina</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 text-sm">
          <p>© {currentYear} Atención IA. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}