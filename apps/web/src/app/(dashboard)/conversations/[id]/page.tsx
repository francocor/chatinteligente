'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Send,
  Paperclip,
  MoreHorizontal,
  Phone,
  Mail,
  Globe,
  Clock,
  Tag,
  UserCheck,
  AlertCircle,
  Check,
  X,
  ChevronDown,
  StickyNote,
  ArrowUpCircle,
  ArrowDownCircle,
  MessageSquare,
  Users,
  Filter,
  CheckCircle,
  History,
  Info,
  Sparkles,
  Lock,
  RefreshCw,
} from 'lucide-react';
import { mockConversations, mockMessages, mockInternalNotes } from '@/data/mocks/conversations';

type Tab = 'chat' | 'notes' | 'info' | 'analytics';

const statusOptions = [
  { value: 'ACTIVE', label: 'Activa' },
  { value: 'WAITING', label: 'En espera' },
  { value: 'IN_PROGRESS', label: 'En proceso' },
  { value: 'RESOLVED', label: 'Resuelta' },
  { value: 'CLOSED', label: 'Cerrada' },
  { value: 'ESCALATED', label: 'Escalada' },
];

const priorityOptions = [
  { value: 'LOW', label: 'Baja' },
  { value: 'NORMAL', label: 'Normal' },
  { value: 'HIGH', label: 'Alta' },
  { value: 'CRITICAL', label: 'Crítica' },
];

const agentOptions = [
  { id: 'unassigned', label: 'Sin asignar' },
  { id: 'agent-1', label: 'María González' },
  { id: 'agent-2', label: 'Carlos Mendoza' },
  { id: 'agent-3', label: 'Ana Silva' },
  { id: 'agent-4', label: 'Roberto Díaz' },
];

export default function ConversationDetailPage() {
  const params = useParams();
  const conversationId = params.id as string;
  
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [internalNote, setInternalNote] = useState('');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showAgentDropdown, setShowAgentDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const conversation = mockConversations.find(c => c.id === conversationId);
  const messages = mockMessages.filter(m => m.conversationId === conversationId);
  const notes = mockInternalNotes.filter(n => n.conversationId === conversationId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    setIsSending(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setMessage('');
    setIsSending(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-neutral-400" />
        </div>
        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
          Conversación no encontrada
        </h3>
        <Link
          href="/dashboard/conversations"
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a conversaciones
        </Link>
      </div>
    );
  }

  const ChannelIcon = {
    WHATSAPP: Phone,
    WEB: Globe,
    INSTAGRAM: MessageSquare,
    TELEGRAM: Send,
    EMAIL: Mail,
  }[conversation.channel] || MessageSquare;

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Chat Panel - Main */}
      <div className="flex-1 flex flex-col bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/conversations"
              className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
              <span className="text-primary-600 font-medium">
                {conversation.contact?.name?.charAt(0) || 'A'}
              </span>
            </div>
            <div>
              <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">
                {conversation.contact?.name || 'Anónimo'}
              </h2>
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <ChannelIcon className="w-3 h-3" />
                <span>#{conversation.conversationNumber}</span>
                <span>·</span>
                <span>{conversation.channel}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Status Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700"
              >
                <span className="w-2 h-2 rounded-full bg-green-500" />
                {statusOptions.find(s => s.value === conversation.status)?.label}
                <ChevronDown className="w-4 h-4 text-neutral-400" />
              </button>
              {showStatusDropdown && (
                <div className="absolute top-full right-0 mt-1 w-40 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg z-10">
                  {statusOptions.map((status) => (
                    <button
                      key={status.value}
                      onClick={() => setShowStatusDropdown(false)}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Priority Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm border rounded-lg ${
                  conversation.priority === 'CRITICAL' 
                    ? 'border-red-300 bg-red-50 text-red-700' 
                    : 'border-neutral-200 dark:border-neutral-700'
                }`}
              >
                <AlertCircle className={`w-4 h-4 ${
                  conversation.priority === 'CRITICAL' ? 'text-red-500' : 'text-neutral-400'
                }`} />
                {priorityOptions.find(p => p.value === conversation.priority)?.label}
                <ChevronDown className="w-4 h-4 text-neutral-400" />
              </button>
              {showPriorityDropdown && (
                <div className="absolute top-full right-0 mt-1 w-40 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg z-10">
                  {priorityOptions.map((priority) => (
                    <button
                      key={priority.value}
                      onClick={() => setShowPriorityDropdown(false)}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    >
                      {priority.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-700">
          {[
            { id: 'chat', label: 'Chat', icon: MessageSquare },
            { id: 'notes', label: 'Notas', icon: StickyNote },
            { id: 'info', label: 'Info', icon: Info },
            { id: 'analytics', label: 'Estadísticas', icon: History },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'chat' && (
            <div className="h-full flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => {
                  const isUser = msg.direction === 'INBOUND';
                  const showTimestamp = index === 0 || 
                    new Date(messages[index - 1].sentAt).getTime() - new Date(msg.sentAt).getTime() > 300000;

                  return (
                    <div key={msg.id}>
                      {showTimestamp && (
                        <div className="flex items-center justify-center my-4">
                          <span className="text-xs text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
                            {new Date(msg.sentAt).toLocaleString('es-CL', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      )}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${isUser ? 'justify-start' : 'justify-end'}`}
                      >
                        <div className={`max-w-[70%] ${isUser ? 'order-1' : ''}`}>
                          <div className={`px-4 py-3 rounded-2xl ${
                            isUser
                              ? 'bg-neutral-100 dark:bg-neutral-700 rounded-tl-none'
                              : 'bg-primary-500 text-white rounded-tr-none'
                          }`}>
                            {msg.quickReply && (
                              <div className="mb-2 pb-2 border-b border-neutral-200/20">
                                <span className="text-xs opacity-70">{msg.quickReply.label}</span>
                              </div>
                            )}
                            <p className="text-sm">{msg.text}</p>
                          </div>
                          <div className={`flex items-center gap-2 mt-1 text-xs text-neutral-400 ${
                            isUser ? 'justify-start' : 'justify-end'
                          }`}>
                            <span>{msg.fromName}</span>
                            <span>·</span>
                            <span>{new Date(msg.sentAt).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</span>
                            {msg.sentiment && (
                              <>
                                <span>·</span>
                                <span className={`${
                                  msg.sentiment === 'POSITIVE' ? 'text-green-500' :
                                  msg.sentiment === 'NEGATIVE' ? 'text-red-500' :
                                  'text-neutral-400'
                                }`}>
                                  {msg.sentiment === 'POSITIVE' ? '😊' : 
                                   msg.sentiment === 'NEGATIVE' ? '😞' : '😐'}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies */}
              {conversation.status !== 'CLOSED' && (
                <div className="px-4 py-2 border-t border-neutral-200 dark:border-neutral-700">
                  <div className="flex flex-wrap gap-2">
                    {['Hola', 'Gracias', 'Perfecto', 'Entiendo'].map((reply) => (
                      <button
                        key={reply}
                        onClick={() => setMessage(reply)}
                        className="px-3 py-1 text-xs bg-neutral-100 dark:bg-neutral-700 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-600"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              {conversation.status !== 'CLOSED' ? (
                <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-end gap-3">
                    <button className="p-2 text-neutral-400 hover:text-neutral-600">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <div className="flex-1">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Escribe un mensaje..."
                        rows={1}
                        className="w-full px-4 py-3 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-900 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!message.trim() || isSending}
                      className="p-3 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white"
                    >
                      {isSending ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 text-center">
                  <p className="text-sm text-neutral-500">
                    Esta conversación está cerrada
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="h-full overflow-y-auto p-4">
              <div className="mb-4">
                <textarea
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  placeholder="Escribe una nota interna..."
                  rows={3}
                  className="w-full px-4 py-3 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-900 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <div className="flex items-center justify-between mt-2">
                  <label className="flex items-center gap-2 text-xs text-neutral-500">
                    <Lock className="w-3 h-3" />
                    Nota privada (no visible para el cliente)
                  </label>
                  <button className="px-4 py-2 text-sm bg-primary-500 hover:bg-primary-600 text-white rounded-lg">
                    Agregar Nota
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className={`p-4 rounded-xl ${
                      note.isPrivate 
                        ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' 
                        : 'bg-neutral-50 dark:bg-neutral-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-xs font-medium text-primary-600">
                          {note.createdBy?.displayName?.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          {note.createdBy?.displayName}
                        </span>
                        {note.isPrivate && (
                          <span className="flex items-center gap-1 px-2 py-0.5 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded">
                            <Lock className="w-3 h-3" />
                            Privada
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-neutral-400">
                        {new Date(note.createdAt).toLocaleString('es-CL', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300">
                      {note.content}
                    </p>
                  </div>
                ))}

                {notes.length === 0 && (
                  <div className="text-center py-8">
                    <StickyNote className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                    <p className="text-sm text-neutral-500">No hay notas internas</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'info' && (
            <div className="h-full overflow-y-auto p-4 space-y-6">
              {/* Contact Info */}
              <div>
                <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-3">
                  INFORMACIÓN DEL CLIENTE
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-700">
                    <span className="text-sm text-neutral-500">Nombre</span>
                    <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {conversation.contact?.name || 'No registrado'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-700">
                    <span className="text-sm text-neutral-500">Email</span>
                    <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {conversation.contact?.email || 'No registrado'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-700">
                    <span className="text-sm text-neutral-500">Teléfono</span>
                    <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {conversation.contact?.phone || 'No registrado'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-700">
                    <span className="text-sm text-neutral-500">Ciudad</span>
                    <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {conversation.contact?.city || 'No registrado'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Assignment */}
              <div>
                <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-3">
                  ASIGNACIÓN
                </h3>
                <div className="relative">
                  <button
                    onClick={() => setShowAgentDropdown(!showAgentDropdown)}
                    className="w-full flex items-center justify-between p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-sm font-medium text-primary-600">
                        {conversation.assignedAgent?.user.displayName.charAt(0) || '?'}
                      </div>
                      <span className="text-sm">
                        {conversation.assignedAgent?.user.displayName || 'Sin asignar'}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-neutral-400" />
                  </button>
                  {showAgentDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg z-10">
                      {agentOptions.map((agent) => (
                        <button
                          key={agent.id}
                          onClick={() => setShowAgentDropdown(false)}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700"
                        >
                          {agent.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-3">
                  ETIQUETAS
                </h3>
                <div className="flex flex-wrap gap-2">
                  {conversation.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 rounded"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                  <button className="px-2 py-1 text-xs border border-dashed border-neutral-300 dark:border-neutral-600 rounded hover:bg-neutral-50 dark:hover:bg-neutral-700">
                    + Agregar
                  </button>
                </div>
              </div>

              {/* Escalation */}
              {conversation.humanAssistanceRequested && (
                <div>
                  <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-3">
                    DERIVACIÓN A HUMANO
                  </h3>
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <UserCheck className="w-5 h-5 text-red-500" />
                      <span className="font-medium text-red-700 dark:text-red-300">
                        Solicitud de derivación
                      </span>
                    </div>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {conversation.humanAssistanceReason}
                    </p>
                    <button className="mt-3 w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium">
                      Derivar a Supervisor
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="h-full overflow-y-auto p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                  <p className="text-xs text-neutral-500">Tiempo de primera respuesta</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                    {conversation.responseTimeMs ? `${Math.round(conversation.responseTimeMs / 60000)}min` : '-'}
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                  <p className="text-xs text-neutral-500">Tiempo de resolución</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                    {conversation.resolutionTimeMs ? `${Math.round(conversation.resolutionTimeMs / 60000)}min` : '-'}
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                  <p className="text-xs text-neutral-500">Mensajes totales</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                    {messages.length}
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                  <p className="text-xs text-neutral-500">CSAT</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                    {conversation.csatScore || '-'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar - Customer Info */}
      <div className="w-80 space-y-6">
        {/* Quick Info Card */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-xl font-bold text-primary-600">
              {conversation.contact?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                {conversation.contact?.name || 'Anónimo'}
              </h3>
              <p className="text-xs text-neutral-500">
                Cliente desde {conversation.contact?.createdAt ? new Date(conversation.contact.createdAt).toLocaleDateString('es-CL', { year: 'numeric', month: 'short' }) : 'N/A'}
              </p>
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Conversaciones</span>
              <span className="font-medium">{conversation.contact?.totalConversations || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">CSAT promedio</span>
              <span className="font-medium text-green-600">
                {conversation.contact?.avgSatisfaction?.toFixed(1) || '-'}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Actions */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4">
          <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-3">
            ACCIONES
          </h3>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 p-3 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded-lg">
              <Mail className="w-4 h-4 text-neutral-400" />
              Enviar email
            </button>
            <button className="w-full flex items-center gap-3 p-3 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded-lg">
              <Phone className="w-4 h-4 text-neutral-400" />
              Llamar
            </button>
            <button className="w-full flex items-center gap-3 p-3 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded-lg">
              <History className="w-4 h-4 text-neutral-400" />
              Ver historial
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4">
          <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-3">
            GESTIÓN
          </h3>
          <div className="space-y-2">
            {conversation.status !== 'RESOLVED' && conversation.status !== 'CLOSED' && (
              <button className="w-full flex items-center gap-3 p-3 text-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg">
                <CheckCircle className="w-4 h-4" />
                Marcar como resuelta
              </button>
            )}
            {conversation.status !== 'CLOSED' && (
              <button className="w-full flex items-center gap-3 p-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                <X className="w-4 h-4" />
                Cerrar conversación
              </button>
            )}
            <button className="w-full flex items-center gap-3 p-3 text-sm text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg">
              <ArrowUpCircle className="w-4 h-4" />
              Escalar a supervisor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
