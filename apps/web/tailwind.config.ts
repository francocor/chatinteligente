import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      /* =====================================================
         1. COLORS - Sistema de Diseño Completo
         ===================================================== */
      colors: {
        /* ---------- Brand Colors ---------- */
        brand: {
          primary: '#0ea5e9',
          primaryDark: '#0284c7',
          secondary: '#6366f1',
          accent: '#14b8a6',
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
        },

        /* Primary - Azul Médico/Corporativo */
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        
        /* Secondary - Violeta/Indicadores */
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        
        /* Success - Verde Salud */
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        
        /* Warning - Naranja/Alerta */
        warning: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        
        /* Danger - Rojo Error */
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        
        /* Neutral - Gris Corporativo */
        neutral: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },

        /* Info - Azul Información */
        info: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },

        /* Canvas specific */
        canvas: {
          bg: '#f8fafc',
          'bg-dark': '#0f172a',
          border: '#e2e8f0',
          'border-dark': '#1e293b',
        },

        /* Semantic - backgrounds */
        surface: {
          primary: '#0ea5e9',
          secondary: '#6366f1',
          success: '#22c55e',
          warning: '#f59e0b',
          danger: '#ef4444',
          info: '#0ea5e9',
        },

        /* Status colors for UI states */
        status: {
          online: '#22c55e',
          offline: '#71717a',
          busy: '#ef4444',
          away: '#f59e0b',
          'last-seen': '#94a3b8',
        },

        /* Chat bubble colors */
        chat: {
          user: '#0ea5e9',
          userDark: '#0284c7',
          bot: '#f1f5f9',
          botDark: '#1e293b',
          system: '#fef3c7',
        },
      },

      /* =====================================================
         2. BACKGROUND OPACITY & GRADIENTS
         ===================================================== */
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
        'gradient-success': 'linear-gradient(135deg, #22c55e 0%, #14b8a6 100%)',
        'gradient-danger': 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        'gradient-warning': 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
        'gradient-subtle': 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
        'gradient-card': 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
        'gradient-dark': 'linear-gradient(180deg, #18181b 0%, #0f172a 100%)',
        'gradient-mesh': 'radial-gradient(at 40% 20%, hsla(199,89%,48%,0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(262,83%,58%,0.3) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(174,100%,50%,0.1) 0px, transparent 50%)',
      },

      /* =====================================================
         3. TYPOGRAPHY
         ===================================================== */
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem', fontWeight: '400' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }],
        'base': ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem', fontWeight: '400' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '500' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', fontWeight: '500' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem', fontWeight: '600' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem', fontWeight: '600' }],
        '5xl': ['3rem', { lineHeight: '1', fontWeight: '700' }],
        '6xl': ['3.75rem', { lineHeight: '1', fontWeight: '700' }],
      },
      
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
      
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
      },
      
      /* =====================================================
         4. SPACING
         ===================================================== */
      spacing: {
        '0': '0px',
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '7': '1.75rem',
        '8': '2rem',
        '9': '2.25rem',
        '10': '2.5rem',
        '11': '2.75rem',
        '12': '3rem',
        '14': '3.5rem',
        '16': '4rem',
        '18': '4.5rem',
        '20': '5rem',
        '24': '6rem',
        '28': '7rem',
        '32': '8rem',
        '36': '9rem',
        '40': '10rem',
        '44': '11rem',
        '48': '12rem',
      },

      /* Container sizes */
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px',
        },
      },

      /* =====================================================
         5. BORDER RADIUS
         ===================================================== */
      borderRadius: {
        none: '0px',
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
        full: '9999px',
      },

      /* =====================================================
         6. SHADOWS
         ===================================================== */
      boxShadow: {
        /* Base shadows */
        'none': 'none',
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

        /* Colored shadows */
        'primary-sm': '0 1px 2px 0 rgba(14, 165, 233, 0.2)',
        'primary-md': '0 4px 6px -1px rgba(14, 165, 233, 0.3), 0 2px 4px -2px rgba(14, 165, 233, 0.2)',
        'primary-lg': '0 10px 15px -3px rgba(14, 165, 233, 0.4), 0 4px 6px -4px rgba(14, 165, 233, 0.3)',
        'primary-glow': '0 0 20px rgba(14, 165, 233, 0.4)',
        'primary-xl': '0 0 40px rgba(14, 165, 233, 0.3)',

        'success-sm': '0 1px 2px 0 rgba(34, 197, 94, 0.2)',
        'success-md': '0 4px 6px -1px rgba(34, 197, 94, 0.3), 0 2px 4px -2px rgba(34, 197, 94, 0.2)',
        'success-lg': '0 10px 15px -3px rgba(34, 197, 94, 0.3), 0 4px 6px -4px rgba(34, 197, 94, 0.2)',

        'danger-sm': '0 1px 2px 0 rgba(239, 68, 68, 0.2)',
        'danger-md': '0 4px 6px -1px rgba(239, 68, 68, 0.3), 0 2px 4px -2px rgba(239, 68, 68, 0.2)',
        'danger-lg': '0 10px 15px -3px rgba(239, 68, 68, 0.3), 0 4px 6px -4px rgba(239, 68, 68, 0.2)',

        'warning-sm': '0 1px 2px 0 rgba(234, 179, 8, 0.2)',
        'warning-md': '0 4px 6px -1px rgba(234, 179, 8, 0.3), 0 2px 4px -2px rgba(234, 179, 8, 0.2)',

        'secondary-sm': '0 1px 2px 0 rgba(168, 85, 247, 0.2)',
        'secondary-md': '0 4px 6px -1px rgba(168, 85, 247, 0.3), 0 2px 4px -2px rgba(168, 85, 247, 0.2)',

        /* Inner shadows */
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
        'inner-sm': 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'inner-lg': 'inset 0 4px 6px -1px rgba(0, 0, 0, 0.1)',

        /* Card/Elevated shadows */
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'card-elevated': '0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',

        /* Sidebar */
        'sidebar': '4px 0 24px rgba(0, 0, 0, 0.08)',
        'sidebar-collapsed': '-4px 0 24px rgba(0, 0, 0, 0.08)',

        /* Modal */
        'modal': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

        /* Floating */
        'floating': '0 10px 40px rgba(0, 0, 0, 0.15)',
      },

      /* =====================================================
         7. ANIMATIONS
         ===================================================== */
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-out': 'fadeOut 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.4s ease-out',
        'fade-in-down': 'fadeInDown 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'slide-left': 'slideLeft 0.4s ease-out',
        'slide-right': 'slideRight 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'scale-out': 'scaleOut 0.2s ease-out',
        'spin-slow': 'spin 2s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'shake': 'shake 0.5s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        
        /* Special animations */
        'float': 'float 3s ease-in-out infinite',
        'pulse-ring': 'pulseRing 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'draw': 'draw 1s ease-out forwards',
        'draw-in': 'drawIn 0.8s ease-out forwards',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        ping: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '75%, 100%': { transform: 'scale(2)', opacity: '0' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        draw: {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
        drawIn: {
          '0%': { strokeDashoffset: '100', opacity: '0' },
          '100%': { strokeDashoffset: '0', opacity: '1' },
        },
      },

      /* =====================================================
         8. TRANSITIONS
         ===================================================== */
      transitionDuration: {
        faster: '100ms',
        fast: '150ms',
        DEFAULT: '200ms',
        slow: '300ms',
        slower: '500ms',
        slowest: '700ms',
      },
      
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'out-back': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },

      /* =====================================================
         9. Z-INDEX
         ===================================================== */
      zIndex: {
        '0': '0',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        dropdown: '1000',
        sticky: '1020',
        fixed: '1030',
        'modal-backdrop': '1040',
        modal: '1050',
        popover: '1060',
        tooltip: '1070',
        toast: '1080',
        'cookie': '1090',
      },

      /* =====================================================
         10. ASPECT RATIOS
         ===================================================== */
      aspectRatio: {
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4',
        '6': '6',
        '8': '8',
        '12': '12',
        '16': '16',
        '21': '21',
        '3/2': '1.5',
        '3/4': '0.75',
        '4/3': '1.333',
        '9/16': '0.5625',
        '16/9': '1.778',
      },

      /* =====================================================
         11. MAX WIDTHS
         ===================================================== */
      maxWidth: {
        'xs': '20rem',
        'sm': '24rem',
        'md': '28rem',
        'lg': '32rem',
        'xl': '36rem',
        '2xl': '42rem',
        '3xl': '48rem',
        '4xl': '56rem',
        '5xl': '64rem',
        '6xl': '72rem',
        '7xl': '80rem',
        'prose': '65ch',
      },

      /* =====================================================
         12. MIN WIDTHS
         ===================================================== */
      minWidth: {
        '0': '0',
        'xs': '16rem',
        'sm': '20rem',
        'md': '24rem',
        'lg': '32rem',
        'xl': '36rem',
      },

      /* =====================================================
         13. HEIGHTS
         ===================================================== */
      height: {
        'screen-sm': '480px',
        'screen-md': '640px',
        'screen-lg': '768px',
        'screen-xl': '896px',
        'screen-2xl': '1024px',
        'header': '4rem',
        'sidebar': 'calc(100vh - 4rem)',
        'toolbar': '3.5rem',
      },

      /* =====================================================
         14. WIDTHS
         ===================================================== */
      width: {
        'screen-sm': '480px',
        'screen-md': '640px',
        'screen-lg': '768px',
        'screen-xl': '896px',
        'screen-2xl': '1024px',
        'sidebar': '16rem',
        'sidebar-collapsed': '4rem',
        'sidebar-expanded': '280px',
        'toolbar': '3.5rem',
      },

      /* =====================================================
         15. BREAKPOINTS (for reference)
         ===================================================== */
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
      },
    },
  },

  /* =====================================================
     16. TAILWIND PLUGINS
     ===================================================== */
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};

export default config;