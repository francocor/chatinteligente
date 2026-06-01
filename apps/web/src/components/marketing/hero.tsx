'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Star, CheckCircle, Bot, Headphones, BarChart3, Calendar, MessageCircle, Sparkles } from 'lucide-react';

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = 600;
    };

    const createParticle = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.1,
    });

    const init = () => {
      particles = Array.from({ length: 50 }, createParticle);
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(14, 165, 233, ${p.opacity})`;
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(animate);
    };

    resize();
    init();
    animate();

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Animated Background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-primary-500" />
                <span className="text-sm font-medium text-primary-700">
                  🎉 Nuevo: WhatsApp Business + IA integrados
                </span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
            >
              La atención al cliente{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-600">
                redefinida por IA
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Centralizá la atención de tu empresa con IA conversacional 24/7.
              Automatizá consultas frecuentes, derivá a agentes humanos cuando sea necesario
              y medí el rendimiento de tu equipo en tiempo real.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10"
            >
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-1"
              >
                Probar Gratis 14 Días
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#demo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-200 hover:border-primary-300 text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg transition-all hover:bg-gray-50"
              >
                Ver Demo
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-6"
            >
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CheckCircle className="w-5 h-5 text-success-500" />
                <span>Sin tarjeta requerida</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CheckCircle className="w-5 h-5 text-success-500" />
                <span>Configuración en 5 min</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CheckCircle className="w-5 h-5 text-success-500" />
                <span>Soporte en español</span>
              </div>
            </motion.div>
          </div>

          {/* Right Visual - Chat Demo */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Chat Window */}
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden max-w-md mx-auto">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Asistente IA</h3>
                        <p className="text-primary-100 text-sm">En línea ahora</p>
                      </div>
                    </div>
                    <div className="w-3 h-3 bg-success-400 rounded-full animate-pulse" />
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-5 space-y-4 min-h-[300px]">
                  {/* AI Message */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary-600" />
                    </div>
                    <div className="bg-gray-100 rounded-2xl rounded-tl-sm p-3 max-w-[80%]">
                      <p className="text-sm text-gray-700">
                        👋 Hola! Soy el asistente virtual.
                        Puedo ayudarte con{' '}
                        <span className="font-semibold text-primary-600">consultas, precios y soporte</span>.
                        {' '}¿En qué puedo ayudarte hoy?
                      </p>
                    </div>
                  </div>

                  {/* User Message */}
                  <div className="flex items-start gap-3 flex-row-reverse">
                    <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">MG</span>
                    </div>
                    <div className="bg-primary-500 rounded-2xl rounded-tr-sm p-3 max-w-[80%]">
                      <p className="text-sm text-white">
                        Necesito saber el precio del plan empresarial
                      </p>
                    </div>
                  </div>

                  {/* AI Message */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary-600" />
                    </div>
                    <div className="bg-gray-100 rounded-2xl rounded-tl-sm p-3 max-w-[80%]">
                      <p className="text-sm text-gray-700 mb-2">
                        El plan empresarial incluye agentes ilimitados y soporte prioritario.
                        ¿Querés que te envíe la propuesta o preferís hablar con un asesor?
                      </p>
                      <div className="flex gap-2 mt-2">
                        <button className="px-3 py-1 bg-primary-100 text-primary-600 rounded-lg text-xs font-medium">
                          Ver propuesta
                        </button>
                        <button className="px-3 py-1 bg-primary-100 text-primary-600 rounded-lg text-xs font-medium">
                          Hablar con asesor
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Typing Indicator */}
                  <div className="flex items-center gap-1 ml-11">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-2">
                    <input
                      type="text"
                      placeholder="Escribe tu mensaje..."
                      className="flex-1 bg-transparent text-sm outline-none px-2"
                    />
                    <button className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute -left-8 top-20 bg-white rounded-2xl shadow-xl border border-gray-100 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-success-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">68%</p>
                    <p className="text-xs text-gray-500">resuelto por IA</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="absolute -right-8 bottom-20 bg-white rounded-2xl shadow-xl border border-gray-100 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                    <p className="text-xs text-gray-500">consultas hoy</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}