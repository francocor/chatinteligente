'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Menu, X, ChevronDown } from 'lucide-react';

const navigation = [
  { name: 'Características', href: '#features' },
  { name: 'Cómo Funciona', href: '#how-it-works' },
  { name: 'Precios', href: '#pricing' },
  { name: 'Contacto', href: '#contact' },
];

const solutions = [
  { name: 'E-commerce', href: '/demo' },
  { name: 'Salud y Bienestar', href: '/demo' },
  { name: 'Soporte Técnico', href: '/demo' },
  { name: 'Servicios Profesionales', href: '/demo' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className={`text-xl font-bold transition-colors ${scrolled ? 'text-gray-900' : 'text-gray-900 lg:text-white'}`}>
              Atención IA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary-500 ${
                  scrolled ? 'text-gray-600' : 'text-gray-600 lg:text-gray-200'
                }`}
              >
                {item.name}
              </a>
            ))}
            
            {/* Solutions Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSolutionsOpen(!solutionsOpen)}
                className={`flex items-center text-sm font-medium transition-colors hover:text-primary-500 ${
                  scrolled ? 'text-gray-600' : 'text-gray-600 lg:text-gray-200'
                }`}
              >
                Soluciones
                <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${solutionsOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {solutionsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2"
                  >
                    {solutions.map((solution) => (
                      <a
                        key={solution.name}
                        href={solution.href}
                        className="block px-4 py-2 text-sm text-gray-600 hover:bg-primary-50 hover:text-primary-600"
                      >
                        {solution.name}
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* CTAs */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href="/login"
              className={`text-sm font-medium transition-colors hover:text-primary-500 ${
                scrolled ? 'text-gray-600' : 'text-gray-600 lg:text-gray-200'
              }`}
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/register"
              className="bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5"
            >
              Comenzar Prueba
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-900" />
            ) : (
              <Menu className="w-6 h-6 text-gray-900" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100"
          >
            <div className="px-4 py-4 space-y-3">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block py-2 text-gray-600 font-medium"
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-4 space-y-3">
                <Link
                  href="/login"
                  className="block w-full text-center py-3 text-gray-600 font-medium border border-gray-200 rounded-xl"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className="block w-full text-center py-3 bg-primary-500 text-white font-medium rounded-xl"
                >
                  Comenzar Prueba Gratis
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}