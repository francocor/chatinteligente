'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  MessageSquare,
  Bot,
  Clock,
  Star,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  Calendar,
  ChevronDown,
  PieChart,
  Activity,
  CheckCircle,
  AlertTriangle,
  Globe,
  Phone,
  Mail,
  MessageCircle,
} from 'lucide-react';

import { mockDailyData } from '@/data/mocks/analytics';

const channelIcons: Record<string, any> = {
  WHATSAPP: Phone,
  WEB: Globe,
  EMAIL: Mail,
  INSTAGRAM: MessageCircle,
  FACEBOOK: MessageCircle,
  TELEGRAM: MessageCircle,
};

const periodKPIs: Record<string, Array<{ id: string; label: string; value: string | number; trend: 'up' | 'down'; changePercentage: number }>> = {
  'last7days': [
    { id: '1', label: 'Conversaciones', value: 1134, trend: 'up', changePercentage: 8.2 },
    { id: '2', label: 'Resolución IA', value: '69%', trend: 'up', changePercentage: 3.1 },
    { id: '3', label: 'Tiempo Prom.', value: '1m 58s', trend: 'up', changePercentage: 12.4 },
    { id: '4', label: 'CSAT', value: '4.4', trend: 'up', changePercentage: 2.3 },
    { id: '5', label: 'Tasa Derivación', value: '17.2%', trend: 'down', changePercentage: -2.1 },
    { id: '6', label: 'Cumpl. SLA', value: '91.3%', trend: 'up', changePercentage: 1.8 },
  ],
  'last30days': [
    { id: '1', label: 'Conversaciones', value: 4523, trend: 'up', changePercentage: 6.8 },
    { id: '2', label: 'Resolución IA', value: '71.8%', trend: 'up', changePercentage: 4.2 },
    { id: '3', label: 'Tiempo Prom.', value: '2m 15s', trend: 'up', changePercentage: 15.3 },
    { id: '4', label: 'CSAT', value: '4.3', trend: 'up', changePercentage: 1.5 },
    { id: '5', label: 'Tasa Derivación', value: '18.9%', trend: 'down', changePercentage: -3.2 },
    { id: '6', label: 'Cumpl. SLA', value: '89.2%', trend: 'up', changePercentage: 2.4 },
  ],
  'thisMonth': [
    { id: '1', label: 'Conversaciones', value: 4312, trend: 'up', changePercentage: 5.1 },
    { id: '2', label: 'Resolución IA', value: '70.2%', trend: 'up', changePercentage: 2.8 },
    { id: '3', label: 'Tiempo Prom.', value: '2m 08s', trend: 'up', changePercentage: 11.2 },
    { id: '4', label: 'CSAT', value: '4.2', trend: 'down', changePercentage: -0.8 },
    { id: '5', label: 'Tasa Derivación', value: '19.4%', trend: 'down', changePercentage: -1.5 },
    { id: '6', label: 'Cumpl. SLA', value: '88.7%', trend: 'up', changePercentage: 1.2 },
  ],
  'lastMonth': [
    { id: '1', label: 'Conversaciones', value: 4089, trend: 'down', changePercentage: -2.3 },
    { id: '2', label: 'Resolución IA', value: '68.5%', trend: 'down', changePercentage: -1.4 },
    { id: '3', label: 'Tiempo Prom.', value: '2m 34s', trend: 'down', changePercentage: -5.8 },
    { id: '4', label: 'CSAT', value: '4.1', trend: 'down', changePercentage: -2.1 },
    { id: '5', label: 'Tasa Derivación', value: '21.2%', trend: 'up', changePercentage: 2.8 },
    { id: '6', label: 'Cumpl. SLA', value: '86.4%', trend: 'down', changePercentage: -3.1 },
  ],
};

type StrKPI = { metric: string; current: string | number; unit: string; status: 'good' | 'warning' | 'bad' };

const periodAnalytics: Record<string, {
  channels: { channel: string; count: number; percentage: number }[];
  hourly: { hour: number; conversations: number; messages: number }[];
  topics: { topic: string; count: number; percentage: number }[];
  intents: { intent: string; count: number; percentage: number; avgConfidence: number; resolutionRate: number }[];
  agents: { agentId: string; agentName: string; conversations: number; resolved: number; avgResponseTime: number; csatScore: number }[];
  strategic: { eficiencia: StrKPI[]; satisfaccion: StrKPI[]; automatizacion: StrKPI[]; operasional: StrKPI[] };
}> = {
  last7days: {
    channels: [
      { channel: 'WHATSAPP', count: 590, percentage: 52.1 },
      { channel: 'WEB', count: 328, percentage: 29.0 },
      { channel: 'INSTAGRAM', count: 102, percentage: 9.0 },
      { channel: 'FACEBOOK', count: 68, percentage: 6.0 },
      { channel: 'TELEGRAM', count: 27, percentage: 2.4 },
      { channel: 'EMAIL', count: 19, percentage: 1.5 },
    ],
    hourly: [
      { hour: 8, conversations: 15, messages: 58 }, { hour: 9, conversations: 28, messages: 112 },
      { hour: 10, conversations: 42, messages: 178 }, { hour: 11, conversations: 55, messages: 245 },
      { hour: 12, conversations: 38, messages: 152 }, { hour: 13, conversations: 22, messages: 88 },
      { hour: 14, conversations: 51, messages: 210 }, { hour: 15, conversations: 65, messages: 278 },
      { hour: 16, conversations: 75, messages: 318 }, { hour: 17, conversations: 62, messages: 265 },
      { hour: 18, conversations: 45, messages: 188 }, { hour: 19, conversations: 22, messages: 92 },
      { hour: 20, conversations: 10, messages: 42 },
    ],
    topics: [
      { topic: 'Consultas de precio', count: 392, percentage: 34.6 },
      { topic: 'Horarios de atención', count: 228, percentage: 20.1 },
      { topic: 'Estado de pedido', count: 165, percentage: 14.6 },
      { topic: 'Medios de pago', count: 130, percentage: 11.5 },
      { topic: 'Soporte técnico', count: 108, percentage: 9.5 },
      { topic: 'Reclamos', count: 66, percentage: 5.8 },
    ],
    intents: [
      { intent: 'consulta_precio', count: 312, percentage: 27.5, avgConfidence: 0.91, resolutionRate: 83.5 },
      { intent: 'consultar_horario', count: 220, percentage: 19.4, avgConfidence: 0.94, resolutionRate: 95.2 },
      { intent: 'estado_pedido', count: 136, percentage: 12.0, avgConfidence: 0.87, resolutionRate: 79.8 },
      { intent: 'medios_pago', count: 106, percentage: 9.4, avgConfidence: 0.90, resolutionRate: 87.3 },
      { intent: 'info_planes', count: 78, percentage: 6.9, avgConfidence: 0.93, resolutionRate: 93.5 },
      { intent: 'soporte_urgente', count: 59, percentage: 5.2, avgConfidence: 0.96, resolutionRate: 98.8 },
      { intent: 'hablar_humano', count: 50, percentage: 4.4, avgConfidence: 0.81, resolutionRate: 100 },
      { intent: 'otro', count: 173, percentage: 15.3, avgConfidence: 0.67, resolutionRate: 46.2 },
    ],
    agents: [
      { agentId: '1', agentName: 'María González', conversations: 114, resolved: 106, avgResponseTime: 26000, csatScore: 4.7 },
      { agentId: '2', agentName: 'Carlos Mendoza', conversations: 97, resolved: 89, avgResponseTime: 33000, csatScore: 4.5 },
      { agentId: '3', agentName: 'Ana Silva', conversations: 78, resolved: 74, avgResponseTime: 30000, csatScore: 4.8 },
      { agentId: '4', agentName: 'Roberto Díaz', conversations: 72, resolved: 67, avgResponseTime: 39000, csatScore: 4.3 },
      { agentId: '5', agentName: 'Patricia López', conversations: 58, resolved: 53, avgResponseTime: 36000, csatScore: 4.6 },
      { agentId: '6', agentName: 'Javier Torres', conversations: 50, resolved: 44, avgResponseTime: 43000, csatScore: 4.2 },
      { agentId: '7', agentName: 'Sofia Ramírez', conversations: 44, resolved: 41, avgResponseTime: 27000, csatScore: 4.9 },
      { agentId: '8', agentName: 'Miguel Herrera', conversations: 38, resolved: 35, avgResponseTime: 50000, csatScore: 4.0 },
    ],
    strategic: {
      eficiencia: [
        { metric: 'Primera Respuesta Prom.', current: 38, unit: 's', status: 'good' },
        { metric: 'Resolución AI', current: 69, unit: '%', status: 'good' },
        { metric: 'FCR Rate', current: 71, unit: '%', status: 'good' },
        { metric: 'Costo por Conversación', current: 0.78, unit: '$', status: 'good' },
      ],
      satisfaccion: [
        { metric: 'CSAT Score', current: 4.4, unit: '/5', status: 'good' },
        { metric: 'NPS Score', current: 52, unit: '', status: 'good' },
        { metric: 'Tasa Respuesta CSAT', current: 61, unit: '%', status: 'warning' },
        { metric: 'Resoluciones 1er contacto', current: 71, unit: '%', status: 'good' },
      ],
      automatizacion: [
        { metric: 'Tasa Automatización', current: 72, unit: '%', status: 'good' },
        { metric: 'Fallback Rate', current: 11, unit: '%', status: 'good' },
        { metric: 'Uso Base Conocimiento', current: 88, unit: '%', status: 'good' },
        { metric: 'Confianza Promedio IA', current: 87, unit: '%', status: 'good' },
      ],
      operasional: [
        { metric: 'Cumplimiento SLA', current: 91.3, unit: '%', status: 'good' },
        { metric: 'Tiempo Resolución Prom.', current: 58, unit: 'min', status: 'good' },
        { metric: 'Tasa Escalación', current: 17.2, unit: '%', status: 'good' },
        { metric: 'Conversaciones Abiertas', current: 89, unit: '', status: 'warning' },
      ],
    },
  },
  last30days: {
    channels: [
      { channel: 'WHATSAPP', count: 2156, percentage: 47.7 },
      { channel: 'WEB', count: 1523, percentage: 33.7 },
      { channel: 'INSTAGRAM', count: 423, percentage: 9.4 },
      { channel: 'FACEBOOK', count: 287, percentage: 6.3 },
      { channel: 'TELEGRAM', count: 98, percentage: 2.2 },
      { channel: 'EMAIL', count: 36, percentage: 0.8 },
    ],
    hourly: [
      { hour: 8, conversations: 23, messages: 89 }, { hour: 9, conversations: 45, messages: 178 },
      { hour: 10, conversations: 67, messages: 289 }, { hour: 11, conversations: 89, messages: 412 },
      { hour: 12, conversations: 56, messages: 234 }, { hour: 13, conversations: 34, messages: 156 },
      { hour: 14, conversations: 78, messages: 356 }, { hour: 15, conversations: 95, messages: 445 },
      { hour: 16, conversations: 102, messages: 489 }, { hour: 17, conversations: 87, messages: 398 },
      { hour: 18, conversations: 54, messages: 234 }, { hour: 19, conversations: 28, messages: 112 },
      { hour: 20, conversations: 12, messages: 45 },
    ],
    topics: [
      { topic: 'Consultas de precio', count: 1567, percentage: 34.7 },
      { topic: 'Horarios de atención', count: 876, percentage: 19.4 },
      { topic: 'Estado de pedido', count: 654, percentage: 14.5 },
      { topic: 'Medios de pago', count: 543, percentage: 12.0 },
      { topic: 'Soporte técnico', count: 432, percentage: 9.6 },
      { topic: 'Reclamos', count: 234, percentage: 5.2 },
    ],
    intents: [
      { intent: 'consulta_precio', count: 1245, percentage: 27.5, avgConfidence: 0.89, resolutionRate: 82.3 },
      { intent: 'consultar_horario', count: 876, percentage: 19.4, avgConfidence: 0.92, resolutionRate: 94.1 },
      { intent: 'estado_pedido', count: 543, percentage: 12.0, avgConfidence: 0.85, resolutionRate: 78.5 },
      { intent: 'medios_pago', count: 423, percentage: 9.4, avgConfidence: 0.88, resolutionRate: 86.2 },
      { intent: 'info_planes', count: 312, percentage: 6.9, avgConfidence: 0.91, resolutionRate: 92.8 },
      { intent: 'soporte_urgente', count: 234, percentage: 5.2, avgConfidence: 0.95, resolutionRate: 98.2 },
      { intent: 'hablar_humano', count: 198, percentage: 4.4, avgConfidence: 0.78, resolutionRate: 100 },
      { intent: 'otro', count: 692, percentage: 15.3, avgConfidence: 0.65, resolutionRate: 45.2 },
    ],
    agents: [
      { agentId: '1', agentName: 'María González', conversations: 456, resolved: 423, avgResponseTime: 28000, csatScore: 4.6 },
      { agentId: '2', agentName: 'Carlos Mendoza', conversations: 389, resolved: 356, avgResponseTime: 35000, csatScore: 4.4 },
      { agentId: '3', agentName: 'Ana Silva', conversations: 312, resolved: 298, avgResponseTime: 32000, csatScore: 4.7 },
      { agentId: '4', agentName: 'Roberto Díaz', conversations: 287, resolved: 267, avgResponseTime: 41000, csatScore: 4.2 },
      { agentId: '5', agentName: 'Patricia López', conversations: 234, resolved: 212, avgResponseTime: 38000, csatScore: 4.5 },
      { agentId: '6', agentName: 'Javier Torres', conversations: 198, resolved: 178, avgResponseTime: 45000, csatScore: 4.1 },
      { agentId: '7', agentName: 'Sofia Ramírez', conversations: 176, resolved: 165, avgResponseTime: 29000, csatScore: 4.8 },
      { agentId: '8', agentName: 'Miguel Herrera', conversations: 154, resolved: 142, avgResponseTime: 52000, csatScore: 3.9 },
    ],
    strategic: {
      eficiencia: [
        { metric: 'Primera Respuesta Prom.', current: 45, unit: 's', status: 'good' },
        { metric: 'Resolución AI', current: 71.8, unit: '%', status: 'good' },
        { metric: 'FCR Rate', current: 68.5, unit: '%', status: 'warning' },
        { metric: 'Costo por Conversación', current: 0.85, unit: '$', status: 'good' },
      ],
      satisfaccion: [
        { metric: 'CSAT Score', current: 4.3, unit: '/5', status: 'good' },
        { metric: 'NPS Score', current: 48, unit: '', status: 'good' },
        { metric: 'Tasa Respuesta CSAT', current: 58.4, unit: '%', status: 'warning' },
        { metric: 'Resoluciones 1er contacto', current: 68.5, unit: '%', status: 'warning' },
      ],
      automatizacion: [
        { metric: 'Tasa Automatización', current: 71.8, unit: '%', status: 'good' },
        { metric: 'Fallback Rate', current: 14.9, unit: '%', status: 'warning' },
        { metric: 'Uso Base Conocimiento', current: 84, unit: '%', status: 'good' },
        { metric: 'Confianza Promedio IA', current: 84, unit: '%', status: 'good' },
      ],
      operasional: [
        { metric: 'Cumplimiento SLA', current: 89.2, unit: '%', status: 'good' },
        { metric: 'Tiempo Resolución Prom.', current: 65, unit: 'min', status: 'warning' },
        { metric: 'Tasa Escalación', current: 18.9, unit: '%', status: 'warning' },
        { metric: 'Conversaciones Abiertas', current: 156, unit: '', status: 'warning' },
      ],
    },
  },
  thisMonth: {
    channels: [
      { channel: 'WHATSAPP', count: 2043, percentage: 47.4 },
      { channel: 'WEB', count: 1508, percentage: 35.0 },
      { channel: 'INSTAGRAM', count: 431, percentage: 10.0 },
      { channel: 'FACEBOOK', count: 258, percentage: 6.0 },
      { channel: 'TELEGRAM', count: 77, percentage: 1.8 },
      { channel: 'EMAIL', count: 34, percentage: 0.8 },
    ],
    hourly: [
      { hour: 8, conversations: 20, messages: 78 }, { hour: 9, conversations: 40, messages: 158 },
      { hour: 10, conversations: 62, messages: 265 }, { hour: 11, conversations: 85, messages: 390 },
      { hour: 12, conversations: 52, messages: 218 }, { hour: 13, conversations: 30, messages: 140 },
      { hour: 14, conversations: 72, messages: 328 }, { hour: 15, conversations: 90, messages: 420 },
      { hour: 16, conversations: 98, messages: 465 }, { hour: 17, conversations: 82, messages: 375 },
      { hour: 18, conversations: 50, messages: 215 }, { hour: 19, conversations: 25, messages: 100 },
      { hour: 20, conversations: 10, messages: 40 },
    ],
    topics: [
      { topic: 'Consultas de precio', count: 1498, percentage: 34.7 },
      { topic: 'Horarios de atención', count: 836, percentage: 19.4 },
      { topic: 'Estado de pedido', count: 623, percentage: 14.5 },
      { topic: 'Medios de pago', count: 518, percentage: 12.0 },
      { topic: 'Soporte técnico', count: 412, percentage: 9.6 },
      { topic: 'Reclamos', count: 225, percentage: 5.2 },
    ],
    intents: [
      { intent: 'consulta_precio', count: 1188, percentage: 27.5, avgConfidence: 0.90, resolutionRate: 83.1 },
      { intent: 'consultar_horario', count: 836, percentage: 19.4, avgConfidence: 0.93, resolutionRate: 94.5 },
      { intent: 'estado_pedido', count: 518, percentage: 12.0, avgConfidence: 0.86, resolutionRate: 79.2 },
      { intent: 'medios_pago', count: 403, percentage: 9.4, avgConfidence: 0.89, resolutionRate: 87.0 },
      { intent: 'info_planes', count: 297, percentage: 6.9, avgConfidence: 0.92, resolutionRate: 93.2 },
      { intent: 'soporte_urgente', count: 223, percentage: 5.2, avgConfidence: 0.96, resolutionRate: 98.5 },
      { intent: 'hablar_humano', count: 189, percentage: 4.4, avgConfidence: 0.79, resolutionRate: 100 },
      { intent: 'otro', count: 660, percentage: 15.3, avgConfidence: 0.66, resolutionRate: 46.0 },
    ],
    agents: [
      { agentId: '1', agentName: 'María González', conversations: 435, resolved: 403, avgResponseTime: 29000, csatScore: 4.5 },
      { agentId: '2', agentName: 'Carlos Mendoza', conversations: 371, resolved: 339, avgResponseTime: 36000, csatScore: 4.3 },
      { agentId: '3', agentName: 'Ana Silva', conversations: 298, resolved: 284, avgResponseTime: 33000, csatScore: 4.6 },
      { agentId: '4', agentName: 'Roberto Díaz', conversations: 274, resolved: 254, avgResponseTime: 42000, csatScore: 4.1 },
      { agentId: '5', agentName: 'Patricia López', conversations: 223, resolved: 202, avgResponseTime: 39000, csatScore: 4.4 },
      { agentId: '6', agentName: 'Javier Torres', conversations: 189, resolved: 169, avgResponseTime: 46000, csatScore: 4.0 },
      { agentId: '7', agentName: 'Sofia Ramírez', conversations: 168, resolved: 157, avgResponseTime: 30000, csatScore: 4.7 },
      { agentId: '8', agentName: 'Miguel Herrera', conversations: 147, resolved: 135, avgResponseTime: 53000, csatScore: 3.8 },
    ],
    strategic: {
      eficiencia: [
        { metric: 'Primera Respuesta Prom.', current: 48, unit: 's', status: 'good' },
        { metric: 'Resolución AI', current: 70.2, unit: '%', status: 'good' },
        { metric: 'FCR Rate', current: 67.2, unit: '%', status: 'warning' },
        { metric: 'Costo por Conversación', current: 0.88, unit: '$', status: 'good' },
      ],
      satisfaccion: [
        { metric: 'CSAT Score', current: 4.2, unit: '/5', status: 'good' },
        { metric: 'NPS Score', current: 45, unit: '', status: 'good' },
        { metric: 'Tasa Respuesta CSAT', current: 56.8, unit: '%', status: 'warning' },
        { metric: 'Resoluciones 1er contacto', current: 67.2, unit: '%', status: 'warning' },
      ],
      automatizacion: [
        { metric: 'Tasa Automatización', current: 70.2, unit: '%', status: 'good' },
        { metric: 'Fallback Rate', current: 15.8, unit: '%', status: 'warning' },
        { metric: 'Uso Base Conocimiento', current: 82, unit: '%', status: 'good' },
        { metric: 'Confianza Promedio IA', current: 83, unit: '%', status: 'good' },
      ],
      operasional: [
        { metric: 'Cumplimiento SLA', current: 88.7, unit: '%', status: 'good' },
        { metric: 'Tiempo Resolución Prom.', current: 68, unit: 'min', status: 'warning' },
        { metric: 'Tasa Escalación', current: 19.4, unit: '%', status: 'warning' },
        { metric: 'Conversaciones Abiertas', current: 148, unit: '', status: 'warning' },
      ],
    },
  },
  lastMonth: {
    channels: [
      { channel: 'WHATSAPP', count: 2045, percentage: 50.0 },
      { channel: 'WEB', count: 1228, percentage: 30.0 },
      { channel: 'INSTAGRAM', count: 368, percentage: 9.0 },
      { channel: 'FACEBOOK', count: 286, percentage: 7.0 },
      { channel: 'TELEGRAM', count: 122, percentage: 3.0 },
      { channel: 'EMAIL', count: 41, percentage: 1.0 },
    ],
    hourly: [
      { hour: 8, conversations: 18, messages: 72 }, { hour: 9, conversations: 38, messages: 148 },
      { hour: 10, conversations: 58, messages: 245 }, { hour: 11, conversations: 78, messages: 358 },
      { hour: 12, conversations: 48, messages: 198 }, { hour: 13, conversations: 28, messages: 128 },
      { hour: 14, conversations: 68, messages: 305 }, { hour: 15, conversations: 85, messages: 392 },
      { hour: 16, conversations: 92, messages: 435 }, { hour: 17, conversations: 78, messages: 352 },
      { hour: 18, conversations: 46, messages: 195 }, { hour: 19, conversations: 22, messages: 88 },
      { hour: 20, conversations: 8, messages: 32 },
    ],
    topics: [
      { topic: 'Consultas de precio', count: 1419, percentage: 34.7 },
      { topic: 'Horarios de atención', count: 792, percentage: 19.4 },
      { topic: 'Estado de pedido', count: 590, percentage: 14.4 },
      { topic: 'Medios de pago', count: 490, percentage: 12.0 },
      { topic: 'Soporte técnico', count: 392, percentage: 9.6 },
      { topic: 'Reclamos', count: 215, percentage: 5.3 },
    ],
    intents: [
      { intent: 'consulta_precio', count: 1125, percentage: 27.5, avgConfidence: 0.88, resolutionRate: 80.5 },
      { intent: 'consultar_horario', count: 792, percentage: 19.4, avgConfidence: 0.91, resolutionRate: 93.2 },
      { intent: 'estado_pedido', count: 490, percentage: 12.0, avgConfidence: 0.84, resolutionRate: 76.8 },
      { intent: 'medios_pago', count: 384, percentage: 9.4, avgConfidence: 0.87, resolutionRate: 84.5 },
      { intent: 'info_planes', count: 282, percentage: 6.9, avgConfidence: 0.90, resolutionRate: 91.2 },
      { intent: 'soporte_urgente', count: 213, percentage: 5.2, avgConfidence: 0.94, resolutionRate: 97.8 },
      { intent: 'hablar_humano', count: 180, percentage: 4.4, avgConfidence: 0.76, resolutionRate: 100 },
      { intent: 'otro', count: 623, percentage: 15.3, avgConfidence: 0.63, resolutionRate: 43.8 },
    ],
    agents: [
      { agentId: '1', agentName: 'María González', conversations: 412, resolved: 378, avgResponseTime: 31000, csatScore: 4.5 },
      { agentId: '2', agentName: 'Carlos Mendoza', conversations: 352, resolved: 318, avgResponseTime: 38000, csatScore: 4.3 },
      { agentId: '3', agentName: 'Ana Silva', conversations: 281, resolved: 265, avgResponseTime: 35000, csatScore: 4.6 },
      { agentId: '4', agentName: 'Roberto Díaz', conversations: 258, resolved: 238, avgResponseTime: 44000, csatScore: 4.0 },
      { agentId: '5', agentName: 'Patricia López', conversations: 212, resolved: 190, avgResponseTime: 42000, csatScore: 4.3 },
      { agentId: '6', agentName: 'Javier Torres', conversations: 178, resolved: 158, avgResponseTime: 48000, csatScore: 3.9 },
      { agentId: '7', agentName: 'Sofia Ramírez', conversations: 158, resolved: 147, avgResponseTime: 32000, csatScore: 4.6 },
      { agentId: '8', agentName: 'Miguel Herrera', conversations: 138, resolved: 125, avgResponseTime: 56000, csatScore: 3.7 },
    ],
    strategic: {
      eficiencia: [
        { metric: 'Primera Respuesta Prom.', current: 52, unit: 's', status: 'warning' },
        { metric: 'Resolución AI', current: 68.5, unit: '%', status: 'warning' },
        { metric: 'FCR Rate', current: 65.8, unit: '%', status: 'warning' },
        { metric: 'Costo por Conversación', current: 0.92, unit: '$', status: 'warning' },
      ],
      satisfaccion: [
        { metric: 'CSAT Score', current: 4.1, unit: '/5', status: 'warning' },
        { metric: 'NPS Score', current: 42, unit: '', status: 'good' },
        { metric: 'Tasa Respuesta CSAT', current: 54.2, unit: '%', status: 'warning' },
        { metric: 'Resoluciones 1er contacto', current: 65.5, unit: '%', status: 'warning' },
      ],
      automatizacion: [
        { metric: 'Tasa Automatización', current: 68.5, unit: '%', status: 'warning' },
        { metric: 'Fallback Rate', current: 17.2, unit: '%', status: 'warning' },
        { metric: 'Uso Base Conocimiento', current: 79, unit: '%', status: 'warning' },
        { metric: 'Confianza Promedio IA', current: 81, unit: '%', status: 'warning' },
      ],
      operasional: [
        { metric: 'Cumplimiento SLA', current: 86.4, unit: '%', status: 'warning' },
        { metric: 'Tiempo Resolución Prom.', current: 72, unit: 'min', status: 'warning' },
        { metric: 'Tasa Escalación', current: 21.2, unit: '%', status: 'bad' },
        { metric: 'Conversaciones Abiertas', current: 178, unit: '', status: 'bad' },
      ],
    },
  },
};

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('last30days');

  const analytics = periodAnalytics[dateRange] ?? periodAnalytics['last30days'];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return seconds + 's';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Analíticas Avanzadas
          </h1>
          <p className="text-neutral-500 mt-1">
            Métricas y estadísticas del sistema de atención
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg">
            <Calendar className="w-4 h-4 text-neutral-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="text-sm bg-transparent border-none focus:outline-none"
            >
              <option value="last7days">Últimos 7 días</option>
              <option value="last30days">Últimos 30 días</option>
              <option value="thisMonth">Este mes</option>
              <option value="lastMonth">Mes anterior</option>
            </select>
          </div>
          <Link
            href="/dashboard/exports"
            className="flex items-center gap-2 px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar
          </Link>
        </div>
      </div>

      {/* KPIs Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {(periodKPIs[dateRange] ?? periodKPIs['last30days']).map((kpi) => (
          <motion.div
            key={kpi.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-neutral-500 dark:text-neutral-400">{kpi.label}</span>
              {kpi.trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
            </div>
            <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{kpi.value}</p>
            <div className="flex items-center gap-1 mt-1">
              <span className={`text-xs ${kpi.changePercentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {kpi.changePercentage > 0 ? '+' : ''}{kpi.changePercentage.toFixed(1)}%
              </span>
              <span className="text-xs text-neutral-400">vs período anterior</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations Trend */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-neutral-900">Conversaciones por Día</h3>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-primary-500" />
                Conversaciones
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-green-500" />
                Resueltas
              </span>
            </div>
          </div>
          <div className="h-56 flex items-end gap-0.5">
            {(() => {
              const days = dateRange === 'last7days' ? 7 : 14;
              const slice = mockDailyData.slice(-days);
              const maxVal = Math.max(...slice.map(d => d.conversations), 1);
              return slice.map((day, i) => (
                <div
                  key={i}
                  className="flex-1 bg-primary-500 hover:bg-primary-600 transition-colors rounded-t-sm cursor-default"
                  style={{ height: Math.max(3, Math.round((day.conversations / maxVal) * 210)) + 'px' }}
                  title={`${new Date(day.date).getDate()}: ${day.conversations} conversaciones`}
                />
              ));
            })()}
          </div>
          <div className="flex justify-between mt-2 text-xs text-neutral-400">
            {mockDailyData.slice(-(dateRange === 'last7days' ? 7 : 14)).map((day, i) => (
              <span key={i}>{new Date(day.date).getDate()}</span>
            ))}
          </div>
        </div>

        {/* Channel Distribution */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 p-6">
          <h3 className="font-semibold text-neutral-900 mb-4">Por Canal</h3>
          <div className="space-y-4">
            {analytics.channels.slice(0, 5).map((ch, i) => {
              const Icon = channelIcons[ch.channel] || Globe;
              return (
                <div key={ch.channel}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-neutral-500" />
                      <span className="text-sm text-neutral-700">{ch.channel}</span>
                    </div>
                    <span className="text-sm font-medium">{ch.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${ch.percentage}%` }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="h-full bg-primary-500 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Distribution */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 p-6">
          <h3 className="font-semibold text-neutral-900 mb-4">Distribución Horaria</h3>
          {(() => {
            const maxH = Math.max(...analytics.hourly.map(h => h.conversations), 1);
            return (
              <div className="h-44 flex items-end gap-0.5">
                {analytics.hourly.map((hour, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                    <div
                      className="w-full bg-cyan-500 hover:bg-cyan-600 transition-all duration-500 ease-out rounded-t-sm cursor-default"
                      style={{ height: Math.max(3, Math.round((hour.conversations / maxH) * 160)) + 'px', transitionDelay: `${i * 40}ms` }}
                      title={`${hour.hour}:00 — ${hour.conversations} conversaciones`}
                    />
                    <span className="text-[9px] text-neutral-400">{hour.hour}</span>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>

        {/* Topics */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 p-6">
          <h3 className="font-semibold text-neutral-900 mb-4">Temas más Consultados</h3>
          <div className="space-y-3">
            {analytics.topics.slice(0, 6).map((topic, i) => (
              <div key={topic.topic} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center text-xs font-medium">
                    {i + 1}
                  </span>
                  <span className="text-sm text-neutral-700">{topic.topic}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500 rounded-full"
                      style={{ width: `${topic.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-neutral-500 w-12 text-right">{topic.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Intents */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200">
            <h3 className="font-semibold">Intenciones Detectadas</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-900/50">
                <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500">Intención</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-neutral-500">Cantidad</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-neutral-500">%</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-neutral-500">Confianza</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-neutral-500">Resolución</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {analytics.intents.slice(0, 8).map((intent) => (
                <tr key={intent.intent}>
                  <td className="px-4 py-3 text-sm capitalize">{intent.intent.replace(/_/g, ' ')}</td>
                  <td className="px-4 py-3 text-sm text-right font-medium">{intent.count}</td>
                  <td className="px-4 py-3 text-sm text-right text-neutral-500">{intent.percentage.toFixed(1)}%</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      intent.avgConfidence > 0.9 ? 'bg-green-100 text-green-700' :
                      intent.avgConfidence > 0.8 ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {(intent.avgConfidence * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={`${intent.resolutionRate > 90 ? 'text-green-600' : intent.resolutionRate > 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {intent.resolutionRate.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Agents */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200">
            <h3 className="font-semibold">Rendimiento de Agentes</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-900/50">
                <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500">Agente</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-neutral-500">Conversaciones</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-neutral-500">CSAT</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-neutral-500">Tiempo Prom.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {analytics.agents.slice(0, 8).map((agent) => (
                <tr key={agent.agentId}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-xs font-medium text-primary-600">
                        {agent.agentName.charAt(0)}
                      </div>
                      <span className="text-sm">{agent.agentName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-medium">{agent.conversations}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      agent.csatScore >= 4.5 ? 'bg-green-100 text-green-700' :
                      agent.csatScore >= 4.0 ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {agent.csatScore.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-neutral-500">{formatTime(agent.avgResponseTime)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strategic KPIs Section */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 p-6">
        <h3 className="font-semibold text-neutral-900 mb-6">KPIs Estratégicos</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Efficiency */}
          <div>
            <h4 className="text-sm font-medium text-neutral-500 mb-3">Eficiencia</h4>
            <div className="space-y-3">
              {analytics.strategic.eficiencia.map((kpi, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700">{kpi.metric}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{kpi.current}{kpi.unit}</span>
                    <span className={`w-2 h-2 rounded-full ${
                      kpi.status === 'good' ? 'bg-green-500' :
                      kpi.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Satisfaction */}
          <div>
            <h4 className="text-sm font-medium text-neutral-500 mb-3">Satisfacción</h4>
            <div className="space-y-3">
              {analytics.strategic.satisfaccion.map((kpi, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700">{kpi.metric}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{kpi.current}{kpi.unit}</span>
                    <span className={`w-2 h-2 rounded-full ${
                      kpi.status === 'good' ? 'bg-green-500' :
                      kpi.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Automation */}
          <div>
            <h4 className="text-sm font-medium text-neutral-500 mb-3">Automatización</h4>
            <div className="space-y-3">
              {analytics.strategic.automatizacion.map((kpi, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700">{kpi.metric}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{kpi.current}{kpi.unit}</span>
                    <span className={`w-2 h-2 rounded-full ${
                      kpi.status === 'good' ? 'bg-green-500' :
                      kpi.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Operations */}
          <div>
            <h4 className="text-sm font-medium text-neutral-500 mb-3">Operacional</h4>
            <div className="space-y-3">
              {analytics.strategic.operasional.map((kpi, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700">{kpi.metric}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{kpi.current}{kpi.unit}</span>
                    <span className={`w-2 h-2 rounded-full ${
                      kpi.status === 'good' ? 'bg-green-500' :
                      kpi.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}