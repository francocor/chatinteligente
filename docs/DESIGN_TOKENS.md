# Sistema de Diseño - Plataforma de Atención Inteligente

## Overview

Este documento define el sistema de diseño completo para la Plataforma de Atención Inteligente, un sistema visual premium, moderno, tecnológico, corporativo, confiable y claro, ideal para el sector salud y empresarial.

---

## 1. Paleta de Colores

### 1.1 Colores Primarios

| Color | Hex | Uso |
|-------|-----|-----|
| Primary 50 | `#f0f9ff` | Fondos muy claros |
| Primary 100 | `#e0f2fe` | Fondos claros |
| Primary 200 | `#bae6fd` | Bordes activos |
| Primary 300 | `#7dd3fc` | Texto deshabilitado |
| Primary 400 | `#38bdf8` | Énfasis secundario |
| **Primary 500** | **`#0ea5e9`** | **Color principal** |
| Primary 600 | `#0284c7` | Hover principal |
| Primary 700 | `#0369a1` | Active state |
| Primary 800 | `#075985` | Texto oscuro |
| Primary 900 | `#0c4a6e` | Fondos oscuros |

### 1.2 Colores Secundarios (Violeta)

| Color | Hex | Uso |
|-------|-----|-----|
| Secondary 500 | `#a855f7` | Énfasis alternativo |
| Secondary 600 | `#9333ea` | Hover secundario |

### 1.3 Colores Semánticos

| Color | Hex | Significado |
|-------|-----|----------|
| Success 500 | `#22c55e` | Éxito, confirmado |
| Warning 500 | `#eab308` | Advertencia |
| Danger 500 | `#ef4444` | Error, peligro |
| Info 500 | `#0ea5e9` | Información |

### 1.4 Colores Neutral

| Color | Hex | Uso |
|-------|-----|-----|
| Neutral 50 | `#fafafa` | Fondo página |
| Neutral 100 | `#f4f4f5` | Fondo alternativa |
| Neutral 200 | `#e4e4e7` | Bordes |
| Neutral 300 | `#d4d4d8` | Bordes oscuros |
| Neutral 400 | `#a1a1aa` | Placeholder |
| Neutral 500 | `#71717a` | Texto secundario |
| Neutral 600 | `#52525b` | Texto cuerpo |
| Neutral 700 | `#3f3f46` | Texto headings |
| Neutral 800 | `#27272a` | Fondo oscuro UI |
| Neutral 900 | `#18181b` | Fondo app |
| Neutral 950 | `#09090b` | Negro app |

---

## 2. Tipografía

### 2.1 Familia de Fuente

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### 2.2 Tamaños

| Token | Tamaño | Line Height | Uso |
|-------|--------|------------|-----|
| `text-xs` | 0.75rem (12px) | 1rem | Labels pequeños |
| `text-sm` | 0.875rem (14px) | 1.25rem | Texto secundario |
| `text-base` | 1rem (16px) | 1.5rem | Cuerpo |
| `text-lg` | 1.125rem (18px) | 1.75rem | Subtítulos |
| `text-xl` | 1.25rem (20px) | 1.75rem | Títulos sección |
| `text-2xl` | 1.5rem (24px) | 2rem | Títulos página |
| `text-3xl` | 1.875rem (30px) | 2.25rem | Headlines |
| `text-4xl` | 2.25rem (36px) | 2.5rem | H1 Landing |
| `text-5xl` | 3rem (48px) | 1 | H1 Hero |

### 2.3 Pesos

| Token | Peso | Uso |
|-------|------|-----|
| `font-light` | 300 | Texto ligero |
| `font-normal` | 400 | Cuerpo estándar |
| `font-medium` | 500 | Labels, navegación |
| `font-semibold` | 600 | Títulos, headings |
| `font-bold` | 700 | Énfasis máximo |

---

## 3. Espaciados

| Token | Valor |
|-------|-------|
| `space-1` | 0.25rem (4px) |
| `space-2` | 0.5rem (8px) |
| `space-3` | 0.75rem (12px) |
| `space-4` | 1rem (16px) |
| `space-5` | 1.25rem (20px) |
| `space-6` | 1.5rem (24px) |
| `space-8` | 2rem (32px) |
| `space-10` | 2.5rem (40px) |
| `space-12` | 3rem (48px) |
| `space-16` | 4rem (64px) |
| `space-20` | 5rem (80px) |
| `space-24` | 6rem (96px) |

---

## 4. Radios

| Token | Valor | Uso |
|-------|-------|-----|
| `rounded-none` | 0 | Botones inline |
| `rounded-sm` | 0.25rem (4px) | Small elements |
| `rounded` / `rounded-md` | 0.5rem (8px) | Default |
| `rounded-lg` | 0.75rem (12px) | Buttons, inputs |
| `rounded-xl` | 1rem (16px) | Cards |
| `rounded-2xl` | 1.5rem (24px) | Modals |
| `rounded-3xl` | 2rem (32px) | Hero sections |
| `rounded-full` | 9999px | Avatars, badges |

---

## 5. Sombras

| Token | Valor |
|-------|-------|
| `shadow-sm` | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` |
| `shadow` | `0 1px 3px 0 rgba(0, 0, 0, 0.1)` |
| `shadow-md` | `0 4px 6px -1px rgba(0, 0, 0, 0.1)` |
| `shadow-lg` | `0 10px 15px -3px rgba(0, 0, 0, 0.1)` |
| `shadow-xl` | `0 20px 25px -5px rgba(0, 0, 0, 0.1)` |
| `shadow-2xl` | `0 25px 50px -12px rgba(0, 0, 0, 0.25)` |
| `shadow-card` | `0 2px 8px rgba(0, 0, 0, 0.08)` |
| `shadow-card-hover` | `0 8px 24px rgba(0, 0, 0, 0.12)` |
| `shadow-modal` | `0 25px 50px -12px rgba(0, 0, 0, 0.25)` |

---

## 6. Transiciones

| Token | Valor |
|-------|-------|
| `duration-faster` | 100ms |
| `duration-fast` | 150ms |
| `duration` | 200ms |
| `duration-slow` | 300ms |
| `duration-slower` | 500ms |

---

## 7. Animaciones

| Animation | Descripción |
|-----------|------------|
| `animate-fade-in` | Fade in 0.3s |
| `animate-fade-out` | Fade out 0.3s |
| `animate-slide-up` | Slide up 0.4s |
| `animate-slide-down` | Slide down 0.4s |
| `animate-scale-in` | Scale in 0.2s |
| `animate-shake` | Shake 0.5s |
| `animate-ping` | Ping effect |

---

## 8. Componentes UI

### 8.1 Button

```tsx
import { Button } from '@/components/ui/button';

<Button variant="primary" size="md">Texto</Button>
<Button variant="outline" size="sm">Outline</Button>
<Button variant="ghost" size="lg">Ghost</Button>
<Button variant="danger" loading>Eliminar</Button>
```

**Variantes:** `primary`, `secondary`, `outline`, `ghost`, `danger`, `success`

### 8.2 Input

```tsx
import { Input, Textarea, Select } from '@/components/ui/input';

<Input label="Email" placeholder="correo@ejemplo.com" />
<Textarea label="Mensaje" rows={4} />
<Select options={[{value: '1', label: 'Opción 1'}]} />
```

### 8.3 Card

```tsx
import { Card, CardHeader, CardBody, CardFooter, StatCard } from '@/components/ui/card';

<Card padding="lg" hover>
  <CardHeader title="Título" subtitle="Subtítulo" />
  <CardBody>Contenido</CardBody>
  <CardFooter align="spread">Footer</CardFooter>
</Card>

<StatCard title="Pacientes" value="1,234" change="+12%" positive icon={<Icon />} />
```

### 8.4 Badge

```tsx
import { Badge, StatusBadge, CountBadge } from '@/components/ui/badge';

<Badge variant="primary">Nuevo</Badge>
<Badge variant="success" dot="left">Etiqueta</Badge>
<StatusBadge status="online" showLabel />
<CountBadge count={5} />
```

### 8.5 Table

```tsx
import { Table } from '@/components/ui/table';

<Table 
  columns={[
    { key: 'name', header: 'Nombre', sortable: true },
    { key: 'status', header: 'Estado', render: (row) => <Badge>{row.status}</Badge> }
  ]} 
  data={data}
  onRowClick={(row) => console.log(row)}
/>
```

### 8.6 Modal

```tsx
import { Modal, ConfirmDialog, Drawer } from '@/components/ui/modal';

<Modal open={open} onClose={() => setOpen(false)} title="Título">
  Contenido
  <Modal.Footer>
    <Button variant="outline">Cancelar</Button>
    <Button>Confirmar</Button>
  </Modal.Footer>
</Modal>
```

### 8.7 Alert

```tsx
import { Alert, AlertBox, InlineAlert } from '@/components/ui/alert';

<Alert variant="info" title="Información">
  Mensaje de alerta
</Alert>

<InlineAlert type="error" message="Campo requerido" />
```

### 8.8 Toast

```tsx
import { ToastProvider, useToast } from '@/components/ui/toast';

function Componente() {
  const { success, error } = useToast();
  
  success('Guardado correctamente');
  error('Error al guardar');
}

<ToastProvider>
  <App />
</ToastProvider>
```

### 8.9 Tabs

```tsx
import { Tabs, TabsVertical, Accordion } from '@/components/ui/tabs';

<Tabs 
  tabs={[
    { id: '1', label: 'Tab 1', content: <div>Contenido</div> },
    { id: '2', label: 'Tab 2', icon: <Icon />, badge: 5 }
  ]}
  variant="underline"
/>
```

### 8.10 Sidebar

```tsx
import { Sidebar, Header } from '@/components/ui/sidebar';

<Header 
  title="Dashboard" 
  search 
  notificationCount={3}
  user={{ name: 'Dr. Juan' }}
/>
```

### 8.11 Widgets

```tsx
import { StatWidget, ChartWidget, ActivityWidget, ProgressWidget } from '@/components/ui/widgets';

<StatWidget 
  title="Pacientes hoy" 
  value={24} 
  change="+12%" 
  positive 
  icon={<Icon />}
/>

<ChartWidget title="Evolución" subtitle="Últimos 12 meses" />

<ActivityWidget items={activities} />

<ProgressWidget 
  items={[
    { label: 'Completados', value: 80, max: 100, color: 'success' }
  ]}
/>
```

---

## 9. Iconografía

### 9.1 Sistema de Iconos Recomendado

- **Heroicons** (SVG) - Iconos de línea recomendados
- **Phosphor Icons** - Alternativa con más estilos
- **Lucide** - Iconos minimalistas

### 9.2 Tamaños de Iconos

| Tamaño | Pixel | Uso |
|--------|-------|-----|
| `w-4 h-4` | 16px | Iconos inline pequeños |
| `w-5 h-5` | 20px | Iconos de navegación |
| `w-6 h-6` | 24px | Iconos de acciones |
| `w-8 h-8` | 32px | Iconos destacados |
| `w-12 h-12` | 48px | Iconos de impacto |

---

## 10. Layout

### 10.1 Dimensiones Estándar

| Element | Tamaño |
|---------|--------|
| Header | `h-16` (64px) |
| Sidebar expandida | `w-64` (256px) |
| Sidebar colapsada | `w-16` (64px) |
| Contenedor max | `max-w-7xl` (1280px) |

### 10.2 Breakpoints

| Breakpoint | pixel |
|------------|-------|
| xs | 375px |
| sm | 640px |
| md | 768px |
| lg | 1024px |
| xl | 1280px |
| 2xl | 1536px |

---

## 11. Tokens CSS (Variables)

Los tokens están definidos en `globals.css` como variables CSS para acceso dinámico:

```css
:root {
  --color-primary-500: #0ea5e9;
  --color-success-500: #22c55e;
  --radius-lg: 0.75rem;
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --transition-base: 200ms;
  --header-height: 4rem;
  --sidebar-width: 16rem;
}
```

---

## 12. Guías de Estilo

### 12.1 Fondos

- Fondo página: `bg-neutral-50`
- Fondo tarjetas: `bg-white dark:bg-neutral-800`
- Fondo inputs: `bg-white dark:bg-neutral-800`

### 12.2 Texto

- Headings: `text-neutral-900 dark:text-neutral-100`
- Cuerpo: `text-neutral-700 dark:text-neutral-300`
- Secundario: `text-neutral-500`
- Placeholder: `text-neutral-400`

### 12.3 Bordes

- Predeterminado: `border-neutral-200 dark:border-neutral-700`
- Focus: `ring-primary-500`

### 12.4 Estados

| Estado | Estilo |
|--------|--------|
| Hover | `hover:bg-primary-50` |
| Active | `active:bg-primary-100` |
| Focus | `focus:ring-primary-500` |
| Disabled | `opacity-50 cursor-not-allowed` |

---

## 13. Uso con Dark Mode

El sistema incluye soporte completo para dark mode via la clase `.dark` en el elemento html:

```tsx
// Toggle dark mode
document.documentElement.classList.toggle('dark');
```

Todos los componentes automáticamente ajustan sus colores para dark mode.

---

## 14. Archivos del Sistema

```
apps/web/
├── tailwind.config.ts          # Configuración completa
├── src/app/globals.css       # Variables CSS y utilities
└── src/components/ui/
    ├── button.tsx            # Buttons
    ├── input.tsx            # Inputs, Textarea, Select
    ├── card.tsx             # Cards
    ├── badge.tsx           # Badges, Status, Count
    ├── table.tsx            # Tables
    ├── modal.tsx           # Modals, Dialogs
    ├── alert.tsx           # Alerts
    ├── toast.tsx           # Toasts
    ├── tabs.tsx            # Tabs, Accordion
    ├── sidebar.tsx          # Sidebar, Header
    └── widgets.tsx          # Dashboard widgets
```

---

## 15. Mejores Prácticas

1. **Usar tokens**: Siempre usar los tokens definidos en lugar de valores hardcoded
2. **Componer componentes**: Preferir composición de componentes existentes
3. **Consistencia**: Mantener consistencia visual en toda la aplicación
4. **Accesibilidad**: Verificar contraste y navegación por teclado
5. **Dark mode**: Testear en ambos modos
6. **Responsive**: Verificar en todos los breakpoints

---

**Versión**: 1.0.0  
**Última actualización**: 2024
**Mantenido por**: Equipo de Diseño