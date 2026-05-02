'use client';

/* =====================================================
   FLOW EDITOR PAGE
   Plataforma de Atención Inteligente
   ===================================================== */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Send,
  Play,
  Pause,
  Copy,
  Trash2,
  Plus,
  Minus,
  Settings,
  Globe,
  MessageSquare,
  Phone,
  Mail,
  Tag,
  Users,
  Zap,
  AlertCircle,
  Check,
  X,
  ChevronRight,
  Layers,
  GitBranch,
  Clock,
  Calendar,
  FileText,
  HelpCircle,
  ArrowRight,
  MessageCircle,
  UserCheck,
  Bot,
  Webhook,
  RefreshCw,
  Eye,
  BarChart3,
  MoreHorizontal,
} from 'lucide-react';

/* =====================================================
   NODE TYPES
   ===================================================== */

const NODE_TYPES = {
  trigger: {
    label: 'Disparador',
    icon: Zap,
    color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20',
    description: 'Palabras clave que activan el flujo',
  },
  question: {
    label: 'Pregunta',
    icon: HelpCircle,
    color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
    description: 'Solicita información al usuario',
  },
  choice: {
    label: 'Selección',
    icon: GitBranch,
    color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20',
    description: 'Opciones de respuesta rápida',
  },
  message: {
    label: 'Mensaje',
    icon: MessageSquare,
    color: 'text-green-500 bg-green-50 dark:bg-green-900/20',
    description: 'Mensaje de texto del bot',
    },
  ai_response: {
    label: 'Respuesta IA',
    icon: Bot,
    color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-900/20',
    description: 'Respuesta generada por IA',
  },
  condition: {
    label: 'Condición',
    icon: GitBranch,
    color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
    description: 'Lógica condicional',
  },
  transfer: {
    label: 'Derivar',
    icon: UserCheck,
    color: 'text-red-500 bg-red-50 dark:bg-red-900/20',
    description: 'Transferir a agente humano',
  },
  webhook: {
    label: 'Webhook',
    icon: Webhook,
    color: 'text-pink-500 bg-pink-50 dark:bg-pink-900/20',
    description: 'Llamada a API externa',
  },
  close: {
    label: 'Cerrar',
    icon: X,
    color: 'text-neutral-500 bg-neutral-100 dark:bg-neutral-800',
    description: 'Finaliza la conversación',
  },
  delay: {
    label: 'Retraso',
    icon: Clock,
    color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20',
    description: 'Espera antes de continuar',
  },
};

/* =====================================================
   SAMPLE FLOW STRUCTURE
   ===================================================== */

const sampleNodes = [
  {
    id: 'node-1',
    type: 'trigger',
    position: { x: 100, y: 200 },
    data: {
      keywords: ['turno', 'cita', 'reservar', 'agenda', 'hora'],
      ignoreCase: true,
    },
  },
  {
    id: 'node-2',
    type: 'message',
    position: { x: 350, y: 200 },
    data: {
      text: '¡Hola! Soy el asistente de Clínica San Juan. Puedo ayudarte a agendar una cita médica. ¿Qué tipo de atención necesitas?',
      quickReplies: ['Turno nuevo', 'Cambiar turno', 'Consultar horario', 'Hablar con persona'],
    },
  },
  {
    id: 'node-3',
    type: 'choice',
    position: { x: 600, y: 200 },
    data: {
      options: [
        { label: 'Turno nuevo', nextNode: 'node-4' },
        { label: 'Cambiar turno', nextNode: 'node-5' },
        { label: 'Consultar horario', nextNode: 'node-6' },
        { label: 'Hablar con persona', nextNode: 'node-transfer' },
      ],
    },
  },
  {
    id: 'node-4',
    type: 'question',
    position: { x: 850, y: 100 },
    data: {
      text: '¿Para qué especialidad necesitas la cita?',
      entity: 'specialty',
      required: true,
    },
  },
  {
    id: 'node-transfer',
    type: 'transfer',
    position: { x: 850, y: 350 },
    data: {
      target: 'queue',
      queueId: 'recepcion',
      reason: 'El cliente requiere atención personalizada',
      priority: 'high',
    },
  },
];

const sampleEdges = [
  { id: 'edge-1', source: 'node-1', target: 'node-2' },
  { id: 'edge-2', source: 'node-2', target: 'node-3' },
  { id: 'edge-3', source: 'node-3', target: 'node-4', label: 'Turno nuevo' },
  { id: 'edge-4', source: 'node-3', target: 'node-5', label: 'Cambiar' },
  { id: 'edge-5', source: 'node-3', target: 'node-6', label: 'Horario' },
  { id: 'edge-6', source: 'node-3', target: 'node-transfer', label: 'Persona' },
];

/* =====================================================
   COMPONENTS
   ===================================================== */

function NodeCard({ node, onClick, isSelected }: { node: any; onClick?: () => void; isSelected?: boolean }) {
  const config = NODE_TYPES[node.type as keyof typeof NODE_TYPES] || NODE_TYPES.message;
  const Icon = config.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`absolute w-48 p-3 rounded-xl border-2 cursor-pointer transition-all ${
        isSelected
          ? 'border-primary-500 shadow-lg shadow-primary-500/20'
          : 'border-neutral-200 dark:border-neutral-700 hover:border-primary-300'
      } bg-white dark:bg-neutral-800`}
      style={{
        left: node.position.x,
        top: node.position.y,
      }}
    >
      <div className={`w-8 h-8 rounded-lg ${config.color} flex items-center justify-center mb-2`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
        {config.label}
      </p>
      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
        {config.description}
      </p>
    </motion.div>
  );
}

function QuickReplyEditor({
  quickReplies,
  onChange,
}: {
  quickReplies: string[];
  onChange: (replies: string[]) => void;
}) {
  const addReply = () => {
    onChange([...quickReplies, '']);
  };

  const updateReply = (index: number, value: string) => {
    const newReplies = [...quickReplies];
    newReplies[index] = value;
    onChange(newReplies);
  };

  const removeReply = (index: number) => {
    onChange(quickReplies.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {quickReplies.map((reply, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="text"
            value={reply}
            onChange={(e) => updateReply(index, e.target.value)}
            placeholder={`Opción ${index + 1}`}
            className="flex-1 px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
          />
          <button
            onClick={() => removeReply(index)}
            className="p-2 text-neutral-400 hover:text-danger-500"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        onClick={addReply}
        className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
      >
        <Plus className="w-4 h-4" />
        Agregar opción
      </button>
    </div>
  );
}

/* =====================================================
   MAIN COMPONENT
   ===================================================== */

export default function FlowEditorPage() {
  const router = useRouter();
  const params = useParams();
  const flowId = params.id as string;
  const isNew = flowId === 'new';

  const [activeTab, setActiveTab] = useState('config');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: isNew ? '' : 'Turnos y Citas',
    description: isNew ? '' : 'Gestión completa de agendamiento de citas médicas',
    triggerKeywords: isNew ? [] : ['turno', 'cita', 'reservar', 'hora', 'agenda'],
    channel: 'all',
    department: 'atencion',
    fallbackMessage: isNew ? '' : 'No entiendo tu consulta. ¿Quieres hablar con una persona?',
    enableHumanHandoff: true,
    handoffThreshold: 3,
    nodes: sampleNodes,
    edges: sampleEdges,
  });

  const [quickReplies, setQuickReplies] = useState<string[]>([
    'Turno nuevo',
    'Cambiar turno',
    'Consultar horario',
    'Hablar con persona',
  ]);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    router.push('/dashboard/flows');
  };

  const tabs = [
    { id: 'config', label: 'Configuración', icon: Settings },
    { id: 'builder', label: 'Constructor', icon: GitBranch },
    { id: 'quickreplies', label: 'Respuestas Rápidas', icon: MessageSquare },
    { id: 'fallback', label: 'Fallback', icon: AlertCircle },
    { id: 'handoff', label: 'Derivación', icon: UserCheck },
    { id: 'analytics', label: 'Estadísticas', icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      /* =====================================================
         HEADER
         ===================================================== */
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/flows"
            className="p-2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
              {isNew ? 'Crear Nuevo Flujo' : `Editar: ${formData.name}`}
            </h1>
            <p className="text-sm text-neutral-500">
              {isNew ? 'Configura un nuevo flujo conversacional' : 'Modifica la configuración y nodos del flujo'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-neutral-500 hover:text-neutral-700 border border-neutral-200 dark:border-neutral-700 rounded-lg">
            <Eye className="w-5 h-5" />
          </button>
          <button className="p-2 text-neutral-500 hover:text-neutral-700 border border-neutral-200 dark:border-neutral-700 rounded-lg">
            <Copy className="w-5 h-5" />
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Guardar
              </>
            )}
          </button>
        </div>
      </div>

      /* =====================================================
         TABS
         ===================================================== */
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-1">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      /* =====================================================
         TAB CONTENT
         ===================================================== */
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'config' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 space-y-6"
            >
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Configuración General
              </h2>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Nombre del Flujo *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Turnos y Citas"
                  className="w-full px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe qué hace este flujo..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                />
              </div>

              {/* Trigger Keywords */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Palabras Clave (separadas por coma) *
                </label>
                <input
                  type="text"
                  value={formData.triggerKeywords.join(', ')}
                  onChange={(e) => setFormData({
                    ...formData,
                    triggerKeywords: e.target.value.split(',').map(k => k.trim()).filter(k => k)
                  })}
                  placeholder="turno, cita, reserva, agenda"
                  className="w-full px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Palabras que activarán este flujo cuando el usuario las escriba
                </p>
              </div>

              {/* Channel & Department */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Canal
                  </label>
                  <select
                    value={formData.channel}
                    onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                    className="w-full px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                  >
                    <option value="all">Todos los canales</option>
                    <option value="web">Web</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="email">Email</option>
                    <option value="telegram">Telegram</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Departamento
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                  >
                    <option value="atencion">Atención al Cliente</option>
                    <option value="soporte">Soporte Técnico</option>
                    <option value="ventas">Ventas</option>
                    <option value="cobranzas">Cobranzas</option>
                    <option value="emergencias">Emergencias</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'builder' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden"
            >
              {/* Canvas Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50">
                <div className="flex items-center gap-2">
                  <button className="p-1.5 text-neutral-500 hover:text-neutral-700 rounded">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-neutral-500">100%</span>
                  <button className="p-1.5 text-neutral-500 hover:text-neutral-700 rounded">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400">Zoom al 100%</span>
                </div>
              </div>

              {/* Canvas */}
              <div className="relative h-[500px] overflow-auto bg-neutral-50 dark:bg-neutral-900/50">
                {/* Grid Background */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                />

                {/* Node Canvas - Example */}
                <div className="relative min-w-[1200px] min-h-[600px] p-8">
                  {sampleNodes.map((node) => (
                    <NodeCard
                      key={node.id}
                      node={node}
                      onClick={() => setSelectedNode(node.id)}
                      isSelected={selectedNode === node.id}
                    />
                  ))}
                </div>
              </div>

              {/* Nodes Panel */}
              <div className="border-t border-neutral-200 dark:border-neutral-700 p-4 bg-white dark:bg-neutral-800">
                <p className="text-xs font-medium text-neutral-500 mb-3 uppercase">Arrastra un nodo al canvas</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(NODE_TYPES).map(([type, config]: [string, any]) => (
                    <div
                      key={type}
                      draggable
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 cursor-grab hover:border-primary-300 dark:hover:border-primary-700"
                    >
                      <config.icon className="w-4 h-4" />
                      <span className="text-xs font-medium">{config.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'quickreplies' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 space-y-6"
            >
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                  Respuestas Rápidas
                </h2>
                <p className="text-sm text-neutral-500">
                  Configura las opciones de selección rápida que aparecerán como botones en los mensajes del flujo.
                </p>
              </div>
              <QuickReplyEditor quickReplies={quickReplies} onChange={setQuickReplies} />
            </motion.div>
          )}

          {activeTab === 'fallback' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 space-y-6"
            >
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                  Mensaje de Fallback
                </h2>
                <p className="text-sm text-neutral-500">
                  Mensaje shown cuando el flujo no reconoce la intención del usuario.
                </p>
              </div>
              <textarea
                value={formData.fallbackMessage}
                onChange={(e) => setFormData({ ...formData, fallbackMessage: e.target.value })}
                placeholder="No entiendo tu consulta. ¿Quieres hablar con una persona?"
                rows={4}
                className="w-full px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
              />
              <div className="flex items-center gap-3 p-4 bg-info-50 dark:bg-info-900/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-info-500" />
                <p className="text-sm text-info-700 dark:text-info-300">
                  Después de 3 intentos fallidos, el sistema sugerirá derivar a un agente humano.
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'handoff' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 space-y-6"
            >
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                  Configuración de Derivación a Humano
                </h2>
                <p className="text-sm text-neutral-500">
                  Define cuándo y cómo transferir la conversación a un agente humano.
                </p>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-3 p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                  <input
                    type="checkbox"
                    checked={formData.enableHumanHandoff}
                    onChange={(e) => setFormData({ ...formData, enableHumanHandoff: e.target.checked })}
                    className="w-5 h-5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">
                      Habilitar derivación automática
                    </p>
                    <p className="text-sm text-neutral-500">
                      Transferir automáticamente cuando se cumplan las condiciones
                    </p>
                  </div>
                </label>

                <div className="pl-9">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Intentos máximos antes de derivar
                  </label>
                  <input
                    type="number"
                    value={formData.handoffThreshold}
                    onChange={(e) => setFormData({ ...formData, handoffThreshold: parseInt(e.target.value) })}
                    min={1}
                    max={10}
                    className="w-24 px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg"
                  />
                </div>

                <div className="pl-9">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Cola de destination
                  </label>
                  <select className="w-full max-w-xs px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                    <option value="recepcion">Recepción - General</option>
                    <option value="soporte">Soporte Técnico</option>
                    <option value="ventas">Ventas</option>
                    <option value="emergencias">Emergencias</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6"
            >
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                Estadísticas del Flujo
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Inicios totales', value: '4,523' },
                  { label: 'Completados', value: '3,842' },
                  { label: 'Tasa abandono', value: '15.1%' },
                  { label: 'Tiempo promedio', value: '2:34' },
                ].map((stat) => (
                  <div key={stat.label} className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                    <p className="text-sm text-neutral-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar - Properties */}
        <div className="space-y-6">
          {selectedNode ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                  Propiedades del Nodo
                </h3>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-1 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                  <p className="text-xs text-neutral-500 mb-1">Tipo de nodo</p>
                  <p className="font-medium capitalize">{sampleNodes.find(n => n.id === selectedNode)?.type}</p>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1">ID del nodo</label>
                  <input
                    type="text"
                    value={selectedNode}
                    readOnly
                    className="w-full px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900"
                  />
                </div>

                <button className="w-full py-2 text-sm text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-lg">
                  Eliminar nodo
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 text-center">
              <GitBranch className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
              <p className="text-sm text-neutral-500">
                Selecciona un nodo en el constructor para ver sus propiedades
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}