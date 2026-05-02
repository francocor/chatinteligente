'use client';

/* =====================================================
   REGISTER PAGE - Enterprise Registration
   Plataforma de Atención Inteligente
   ===================================================== */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MessageSquare, Building2, User, Mail, Lock, Phone, Globe, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

export default function RegisterPage() {
  const router = useRouter();
  const { registerEnterprise, isAuthenticated, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    companyName: '',
    slug: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    domain: '',
    phone: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [step, setStep] = useState(1);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.replace('/dashboard/conversations');
    }
  }, [isAuthenticated, isLoading, router]);

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.companyName || formData.companyName.length < 2) {
      newErrors.companyName = 'Nombre de empresa requerido';
    }
    if (!formData.slug || formData.slug.length < 3) {
      newErrors.slug = 'URL requerido (mínimo 3 caracteres)';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Solo letras minúsculas, números y guiones';
    }
    if (!formData.domain) {
      newErrors.domain = 'Dominio web requerido';
    } else if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(formData.domain)) {
      newErrors.domain = 'Formato de dominio inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Correo electrónico válido requerido';
    }
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Mínimo 8 caracteres';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
      newErrors.password = 'Debe tener: mayúscula, minúscula, número y carácter especial';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    if (!formData.firstName) {
      newErrors.firstName = 'Nombre requerido';
    }
    if (!formData.lastName) {
      newErrors.lastName = 'Apellido requerido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      setErrors({});
    }
  };

  const handleBack = () => {
    setStep(1);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) return;
    
    setApiError('');
    setIsSubmitting(true);

    try {
      await registerEnterprise({
        companyName: formData.companyName,
        slug: formData.slug,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        domain: formData.domain,
        phone: formData.phone,
      });
    } catch (err: any) {
      setApiError(err.message || 'Error al registrar empresa. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSlugChange = (value: string) => {
    const slug = value.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-');
    setFormData({ ...formData, slug });
  };

  const inputClasses = `
    w-full px-4 py-3 rounded-xl border bg-white
    text-neutral-900 placeholder:text-neutral-400
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
  `;

  const inputErrorClasses = `
    ${inputClasses} border-danger-500 focus:ring-danger-500 focus:border-danger-500
  `;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-neutral-50">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-neutral-900">Atención Inteligente</h1>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary-600' : 'text-neutral-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? 'bg-primary-500 text-white' : 'bg-neutral-200'}`}>
                1
              </div>
              <span className="text-sm">Empresa</span>
            </div>
            <div className="w-12 h-0.5 bg-neutral-200">
              <div className={`h-full bg-primary-500 transition-all ${step === 2 ? 'w-full' : 'w-0'}`} />
            </div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary-600' : 'text-neutral-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? 'bg-primary-500 text-white' : 'bg-neutral-200'}`}>
                2
              </div>
              <span className="text-sm">Administrador</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-neutral-900 text-center mb-2">
            {step === 1 ? 'Datos de tu Empresa' : 'Datos del Administrador'}
          </h2>
          <p className="text-neutral-500 text-center mb-8">
            {step === 1 
              ? 'Ingresa los datos de tu organización' 
              : 'Crea la cuenta de administrador'}
          </p>

          {/* API Error */}
          {apiError && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-danger-50 border border-danger-200 mb-6">
              <AlertCircle className="w-5 h-5 text-danger-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-danger-700">{apiError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Company Info */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Nombre de la Empresa
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Building2 className="w-5 h-5 text-neutral-400" />
                    </div>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className={errors.companyName ? inputErrorClasses : `${inputClasses} pl-12`}
                      placeholder="Clínica San Juan"
                    />
                  </div>
                  {errors.companyName && (
                    <p className="mt-1 text-sm text-danger-500">{errors.companyName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    URL de tu Plataforma
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Globe className="w-5 h-5 text-neutral-400" />
                    </div>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 px-4 py-3 bg-neutral-100 border border-r-0 border-neutral-200 rounded-l-xl text-neutral-500 text-sm">
                        https://
                      </div>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => handleSlugChange(e.target.value)}
                        className={`${errors.slug ? inputErrorClasses : inputClasses} rounded-l-none flex-1`}
                        placeholder="mi-clinica"
                      />
                      <div className="flex-shrink-0 px-4 py-3 bg-neutral-100 border border-l-0 border-neutral-200 rounded-r-xl text-neutral-500 text-sm">
                        .ai
                      </div>
                    </div>
                  </div>
                  {errors.slug && (
                    <p className="mt-1 text-sm text-danger-500">{errors.slug}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Dominio Web (opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    className={errors.domain ? inputErrorClasses : inputClasses}
                    placeholder="www.miclinica.com"
                  />
                  {errors.domain && (
                    <p className="mt-1 text-sm text-danger-500">{errors.domain}</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full px-4 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-medium"
                >
                  Continuar
                </button>
              </div>
            )}

            {/* Step 2: Admin Info */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Nombre
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="w-5 h-5 text-neutral-400" />
                      </div>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className={errors.firstName ? inputErrorClasses : `${inputClasses} pl-12`}
                        placeholder="Juan"
                      />
                    </div>
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-danger-500">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Apellido
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className={errors.lastName ? inputErrorClasses : inputClasses}
                      placeholder="Pérez"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-danger-500">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-neutral-400" />
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={errors.email ? inputErrorClasses : `${inputClasses} pl-12`}
                      placeholder="juan@tuempresa.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-danger-500">{errors.email}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Contraseña
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="w-5 h-5 text-neutral-400" />
                      </div>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className={errors.password ? inputErrorClasses : `${inputClasses} pl-12`}
                        placeholder="••••••••"
                      />
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-danger-500">{errors.password}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Confirmar
                    </label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className={errors.confirmPassword ? inputErrorClasses : inputClasses}
                      placeholder="••••••••"
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-danger-500">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Teléfono (opcional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="w-5 h-5 text-neutral-400" />
                    </div>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`${inputClasses} pl-12`}
                      placeholder="+1234567890"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 px-4 py-3 rounded-xl border border-neutral-200 text-neutral-700 font-medium hover:bg-neutral-50"
                  >
                    Atrás
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-medium disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Creando...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Crear Cuenta</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-neutral-600">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Iniciar sesión
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-neutral-400 mt-4">
          Al registrarte, aceptas nuestros Términos de Servicio y Política de Privacidad
        </p>
      </div>
    </div>
  );
}
