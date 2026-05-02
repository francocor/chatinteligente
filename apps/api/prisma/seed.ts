import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de datos demo...\n');

  // ============================================================
  // 1. PLAN
  // ============================================================
  console.log('📦 Creando planes...');
  const planStarter = await prisma.plan.upsert({
    where: { name: 'Starter' },
    update: {},
    create: {
      id: 'plan-starter-001',
      name: 'Starter',
      displayName: 'Plan Starter',
      description: 'Plan para clínicas pequeñas',
      monthlyPrice: 49,
      yearlyPrice: 499,
      maxUsers: 3,
      maxAgents: 2,
      maxContacts: 500,
      conversationsLimit: 200,
      aiCredits: 500,
      channels: ['WEB', 'WHATSAPP'],
      features: {
        chatbot: true,
        basicAnalytics: true,
        emailSupport: true,
      },
      limits: { maxFileSize: 5, maxChatMessages: 1000 },
      isActive: true,
      sortOrder: 1,
    },
  });

  const planProfessional = await prisma.plan.upsert({
    where: { name: 'Professional' },
    update: {},
    create: {
      id: 'plan-pro-001',
      name: 'Professional',
      displayName: 'Plan Profesional',
      description: 'Para centros médicos medianos',
      monthlyPrice: 149,
      yearlyPrice: 1499,
      maxUsers: 10,
      maxAgents: 5,
      maxContacts: 5000,
      conversationsLimit: 2000,
      aiCredits: 5000,
      channels: ['WEB', 'WHATSAPP', 'EMAIL', 'SMS'],
      features: {
        chatbot: true,
        advancedAnalytics: true,
        prioritySupport: true,
        customFlows: true,
        knowledgeBase: true,
      },
      limits: { maxFileSize: 25, maxChatMessages: 10000 },
      isActive: true,
      isPopular: true,
      sortOrder: 2,
    },
  });

  // ============================================================
  // 2. TENANT (DEMO CLINIC)
  // ============================================================
  console.log('🏥 Creando tenant demo (Clínica San Juan)...');
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'clinica-san-juan' },
    update: {},
    create: {
      id: '5425d30b-41bc-4eee-a7d8-7dfaa1115509',
      name: 'Clínica San Juan',
      slug: 'clinica-san-juan',
      domain: 'clinicasanjuan.cl',
      logo: '/images/logo-clinica.png',
      primaryColor: '#0ea5e9',
      secondaryColor: '#3b82f6',
      planId: planProfessional.id,
      status: 'ACTIVE',
      settings: {
        chatWidget: { enabled: true, position: 'bottom-right', primaryColor: '#0ea5e9' },
        notifications: { email: true, slack: false },
      },
      address: {
        street: 'Av. Libertador',
        number: '1440',
        city: 'Santiago',
        region: 'RM',
        country: 'CL',
        zipCode: '8320000',
      },
      contactPhone: '+56 2 2712 0000',
      contactEmail: 'contacto@clinicasanjuan.cl',
      timezone: 'America/Santiago',
      locale: 'es-CL',
    },
  });

  // ============================================================
  // 3. SUBSCRIPTION
  // ============================================================
  console.log('📝 Creando suscripción...');
  await prisma.subscription.upsert({
    where: { tenantId: tenant.id },
    update: {},
    create: {
      id: 'sub-demo-001',
      tenantId: tenant.id,
      planId: planProfessional.id,
      status: 'ACTIVE',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      trialEnd: null,
      cancelAtPeriodEnd: false,
    },
  });

  // ============================================================
  // 4. ROLES & PERMISSIONS
  // ============================================================
  console.log('🔐 Creando roles y permisos...');

  const roleSuperAdmin = await prisma.role.upsert({
    where: { tenantId_name: { tenantId: tenant.id, name: 'superadmin' } },
    update: {},
    create: {
      id: 'role-superadmin-001',
      tenantId: tenant.id,
      name: 'superadmin',
      description: 'Administrador total del sistema',
      permissions: { '*': ['*'] },
      isSystem: true,
    },
  });

  const roleAdmin = await prisma.role.upsert({
    where: { tenantId_name: { tenantId: tenant.id, name: 'admin_empresa' } },
    update: {},
    create: {
      id: 'role-admin-001',
      tenantId: tenant.id,
      name: 'admin_empresa',
      description: 'Administrador de la clínica',
      permissions: {
        conversations: ['read', 'write', 'delete'],
        agents: ['read', 'write'],
        flows: ['read', 'write'],
        knowledge: ['read', 'write'],
        analytics: ['read'],
        settings: ['read', 'write'],
        reports: ['read', 'export'],
        tickets: ['read', 'write'],
      },
      isSystem: true,
    },
  });

  const roleAgent = await prisma.role.upsert({
    where: { tenantId_name: { tenantId: tenant.id, name: 'asesor' } },
    update: {},
    create: {
      id: 'role-agent-001',
      tenantId: tenant.id,
      name: 'asesor',
      description: 'Agente de atención al paciente',
      permissions: {
        conversations: ['read', 'write'],
        knowledge: ['read'],
        tickets: ['read', 'write'],
      },
      isSystem: true,
    },
  });

  // ============================================================
  // 5. USERS
  // ============================================================
  console.log('👤 Creando usuarios...');

  const passwordHash = await bcrypt.hash('admin123', 10);

  const adminUser = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'admin@clinicasanjuan.cl' } },
    update: {},
    create: {
      id: 'user-admin-001',
      tenantId: tenant.id,
      email: 'admin@clinicasanjuan.cl',
      passwordHash,
      roleId: roleSuperAdmin.id,
      firstName: 'Administrador',
      lastName: 'Sistema',
      displayName: 'Admin Sistema',
      phone: '+56 9 1234 5678',
      isActive: true,
      isVerified: true,
      emailVerifiedAt: new Date(),
      preferences: { theme: 'dark', language: 'es' },
    },
  });

  const agentUser = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'agente@clinicasanjuan.cl' } },
    update: {},
    create: {
      id: 'user-agent-001',
      tenantId: tenant.id,
      email: 'agente@clinicasanjuan.cl',
      passwordHash,
      roleId: roleAgent.id,
      firstName: 'María',
      lastName: 'González',
      displayName: 'María González',
      phone: '+56 9 8765 4321',
      isActive: true,
      isVerified: true,
      emailVerifiedAt: new Date(),
      preferences: { theme: 'light', language: 'es' },
    },
  });

  // ============================================================
  // 6. DEPARTMENT
  // ============================================================
  console.log('🏢 Creando departamentos...');
  const deptAdmissions = await prisma.department.upsert({
    where: { tenantId_name: { tenantId: tenant.id, name: 'Admisión' } },
    update: {},
    create: {
      id: 'dept-adm-001',
      tenantId: tenant.id,
      name: 'Admisión',
      description: 'Departamento de admisión y agendamiento',
      isActive: true,
    },
  });

  const deptMedical = await prisma.department.upsert({
    where: { tenantId_name: { tenantId: tenant.id, name: 'Medicina General' } },
    update: {},
    create: {
      id: 'dept-med-001',
      tenantId: tenant.id,
      name: 'Medicina General',
      description: 'Atención médica general',
      isActive: true,
    },
  });

  // ============================================================
  // 7. AGENT (Human Agent profile)
  // ============================================================
  console.log('🎧 Creando perfil de agente...');
  const agent = await prisma.agent.upsert({
    where: { userId: agentUser.id },
    update: {},
    create: {
      id: 'agent-001',
      tenantId: tenant.id,
      userId: agentUser.id,
      departmentId: deptAdmissions.id,
      status: 'ONLINE',
      maxChats: 5,
      maxConcurrentConversations: 3,
      languages: ['es'],
      specialties: ['Medicina General', 'Pediatría'],
    },
  });

  // ============================================================
  // 8. CONTACTS (Demo patients)
  // ============================================================
  console.log('📋 Creando contactos de ejemplo...');

  const contact1 = await prisma.contact.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'roberto.paciente@email.cl' } },
    update: {},
    create: {
      id: 'contact-001',
      tenantId: tenant.id,
      name: 'Roberto Soto',
      email: 'roberto.paciente@email.cl',
      phone: '+56 9 1111 2222',
      documentNumber: '12.345.678-9',
    },
  });

  const contact2 = await prisma.contact.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'ana.paciente@email.cl' } },
    update: {},
    create: {
      id: 'contact-002',
      tenantId: tenant.id,
      name: 'Ana Martínez',
      email: 'ana.paciente@email.cl',
      phone: '+56 9 3333 4444',
      documentNumber: '9.876.543-2',
    },
  });

  // ============================================================
  // 9. CONVERSATIONS (Demo)
  // ============================================================
  console.log('💬 Creando conversaciones demo...');

  const conv1 = await prisma.conversation.upsert({
    where: { id: 'conv-demo-001' },
    update: {},
    create: {
      id: 'conv-demo-001',
      tenantId: tenant.id,
      conversationNumber: 1,
      contactId: contact1.id,
      channel: 'WEB',
      status: 'RESOLVED',
      priority: 'NORMAL',
      assignedAgentId: agent.id,
      tags: ['urgencia', 'cardio'],
      customFields: { 'Triage': 'Prioridad media' },
      lastMessageAt: new Date(Date.now() - 5 * 60 * 1000),
      resolvedAt: new Date(),
    },
  });

  const conv2 = await prisma.conversation.upsert({
    where: { id: 'conv-demo-002' },
    update: {},
    create: {
      id: 'conv-demo-002',
      tenantId: tenant.id,
      conversationNumber: 2,
      contactId: contact2.id,
      channel: 'WEB',
      status: 'WAITING',
      priority: 'NORMAL',
      tags: ['laboratorio'],
      lastMessageAt: new Date(Date.now() - 2 * 60 * 1000),
    },
  });

  // ============================================================
  // 10. MESSAGES
  // ============================================================
  console.log('📝 Creando mensajes...');

  await prisma.message.upsert({
    where: { id: 'msg-demo-001' },
    update: {},
    create: {
      id: 'msg-demo-001',
      conversationId: conv1.id,
      channel: 'WEB',
      direction: 'OUTBOUND',
      fromType: 'BOT',
      contentType: 'TEXT',
      text: '👋 ¡Bienvenido a Clínica San Juan! Soy el asistente virtual.\n\nEstoy aquí para ayudarte con:\n\n• 📅 Solicitar horas médicas\n• 📋 Resultados de exámenes\n• 🕐 Horarios de atención\n• 💳 Información de cobertura\n• 🏥 Servicios\n\n¿En qué puedo ayudarte?',
      sentAt: new Date(Date.now() - 30 * 60 * 1000),
    },
  });

  await prisma.message.upsert({
    where: { id: 'msg-demo-002' },
    update: {},
    create: {
      id: 'msg-demo-002',
      conversationId: conv1.id,
      channel: 'WEB',
      direction: 'INBOUND',
      fromType: 'CONTACT',
      contentType: 'TEXT',
      text: 'Tengo dolor en el pecho, es grave?',
      sentAt: new Date(Date.now() - 25 * 60 * 1000),
    },
  });

  await prisma.message.upsert({
    where: { id: 'msg-demo-003' },
    update: {},
    create: {
      id: 'msg-demo-003',
      conversationId: conv1.id,
      channel: 'WEB',
      direction: 'OUTBOUND',
      fromType: 'BOT',
      contentType: 'TEXT',
      text: '⚠️ Para situaciones de urgencia:\n\n• Llama al 131 (SAMU)\n• O asiste directamente a urgencias 24/7\n\nTu seguridad es prioridad. ¿Necesitas que te derive a un agente ahora?',
      sentAt: new Date(Date.now() - 24 * 60 * 1000),
    },
  });

  await prisma.message.upsert({
    where: { id: 'msg-demo-004' },
    update: {},
    create: {
      id: 'msg-demo-004',
      conversationId: conv1.id,
      channel: 'WEB',
      direction: 'INBOUND',
      fromType: 'CONTACT',
      contentType: 'TEXT',
      text: 'Gracias, me llamaron para mañana a las 10:00',
      sentAt: new Date(Date.now() - 10 * 60 * 1000),
    },
  });

  await prisma.message.upsert({
    where: { id: 'msg-demo-005' },
    update: {},
    create: {
      id: 'msg-demo-005',
      conversationId: conv2.id,
      channel: 'WEB',
      direction: 'OUTBOUND',
      fromType: 'BOT',
      contentType: 'TEXT',
      text: 'Hola Ana, ¿cómo estás? En qué puedo ayudarte hoy?',
      sentAt: new Date(Date.now() - 10 * 60 * 1000),
    },
  });

  await prisma.message.upsert({
    where: { id: 'msg-demo-006' },
    update: {},
    create: {
      id: 'msg-demo-006',
      conversationId: conv2.id,
      channel: 'WEB',
      direction: 'INBOUND',
      fromType: 'CONTACT',
      contentType: 'TEXT',
      text: 'Cuándo vienen mis resultados?',
      sentAt: new Date(Date.now() - 5 * 60 * 1000),
    },
  });

  // ============================================================
  // 11. QUICK REPLIES
  // ============================================================
  console.log('⚡ Creando respuestas rápidas...');
  const quickReplies = [
    { keyword: 'solicitar-hora', label: '📅 Solicitar hora', message: 'Quiero solicitar una hora médica' },
    { keyword: 'consultar-especialidad', label: '🩺 Consultar especialidad', message: 'Qué especialidades tienen' },
    { keyword: 'horarios', label: '🕐 Horarios de atención', message: 'Cuál es su horario de atención' },
    { keyword: 'isapres', label: '💳 Información de obras sociales', message: 'Qué isapres aceptan' },
    { keyword: 'preparaciones', label: '🧪 Preparaciones para estudios', message: 'Cómo debo prepararme para un examen' },
    { keyword: 'sedes', label: '📍 Sedes y direcciones', message: 'Dónde están ubicados' },
  ];

  for (const qr of quickReplies) {
    await prisma.quickReply.upsert({
      where: { id: `qr-${qr.keyword}` },
      update: {},
      create: {
        id: `qr-${qr.keyword}`,
        tenantId: tenant.id,
        keyword: qr.keyword,
        label: qr.label,
        message: qr.message,
        isActive: true,
      },
    });
  }

  // ============================================================
  // 12. KNOWLEDGE BASE (FAQ)
  // ============================================================
  console.log('📚 Creando base de conocimiento...');

  const faq1 = await prisma.knowledgeEntry.upsert({
    where: { id: 'kb-001' },
    update: {},
    create: {
      id: 'kb-001',
      tenantId: tenant.id,
      title: '¿Cómo solicitar una hora médica?',
      content: 'Puedes solicitar tu hora a través de nuestro chatbot, llamando al +56 2 2712 0000, o agendando directamente en recepción.',
      category: 'Agendamiento',
      tags: ['hora', 'turno', 'agendar', 'cita'],
    },
  });

  const faq2 = await prisma.knowledgeEntry.upsert({
    where: { id: 'kb-002' },
    update: {},
    create: {
      id: 'kb-002',
      tenantId: tenant.id,
      title: '¿Qué documentos necesito para atenderme?',
      content: 'Debes presentar tu cédula de identidad, comprobante de pago de tu isapre o efectivo, y orden médica si corresponde a tu prestación.',
      category: 'Documentación',
      tags: ['documentos', 'requisitos', 'identificación'],
    },
  });

  const faq3 = await prisma.knowledgeEntry.upsert({
    where: { id: 'kb-003' },
    update: {},
    create: {
      id: 'kb-003',
      tenantId: tenant.id,
      title: '¿Cuáles son los horarios de atención?',
      content: 'Nuestro horario es de lunes a viernes de 08:00 a 20:00 horas, y sábados de 09:00 a 14:00 horas. Urgencias 24/7.',
      category: 'Horarios',
      tags: ['horario', 'atención', 'horario-atencion'],
    },
  });

  const faq4 = await prisma.knowledgeEntry.upsert({
    where: { id: 'kb-004' },
    update: {},
    create: {
      id: 'kb-004',
      tenantId: tenant.id,
      title: '¿Tienen convenios con isapres?',
      content: 'Sí, tenemos convenios con las principales isapres: Banmédica, Vida, Consalud, MasVIDA, Colmena y Cruz del Sur.',
      category: 'Cobertura',
      tags: ['isapres', 'convenios', 'cobertura', 'seguro'],
    },
  });

  const faq5 = await prisma.knowledgeEntry.upsert({
    where: { id: 'kb-005' },
    update: {},
    create: {
      id: 'kb-005',
      tenantId: tenant.id,
      title: '¿Cómo prepararme para un examen de laboratorio?',
      content: 'Para estudios de laboratorio debes presentar orden médica vigente, acudir en ayunas de 12 horas, y llegar 15 minutos antes de tu cita.',
      category: 'Exámenes',
      tags: ['laboratorio', 'examen', 'preparación', 'ayunas'],
    },
  });

  const faq6 = await prisma.knowledgeEntry.upsert({
    where: { id: 'kb-006' },
    update: {},
    create: {
      id: 'kb-006',
      tenantId: tenant.id,
      title: '¿Qué hacer en caso de urgencia?',
      content: 'Para urgencias graves llama al 131 (SAMU) o asiste directamente a nuestro servicio de urgencias 24/7. Para consultas urgentes agenda con prioridad.',
      category: 'Urgencias',
      tags: ['urgencia', 'emergencia', 'SAMU', '131'],
    },
  });

  // ============================================================
  // 13. INTENTS (Basic AI intents)
  // ============================================================
  console.log('🤖 Creando intents de IA...');

  await prisma.intent.upsert({
    where: { id: 'intent-greeting-001' },
    update: {},
    create: {
      id: 'intent-greeting-001',
      tenantId: tenant.id,
      name: 'greeting',
      displayName: 'Saludo',
      description: 'Usuario saluda al chatbot',
      trainingPhrases: ['hola', 'buenos días', 'buenas tardes', 'hola', 'saludos', 'hey'],
      responses: ['¡Hola! ¿En qué puedo ayudarte?', '¡Bienvenido! ¿Cómo puedo asistirte hoy?'],
      isActive: true,
    },
  });

  await prisma.intent.upsert({
    where: { id: 'intent-appointment-001' },
    update: {},
    create: {
      id: 'intent-appointment-001',
      tenantId: tenant.id,
      name: 'request_appointment',
      displayName: 'Solicitar hora médica',
      description: 'Usuario quiere agendar una cita',
      trainingPhrases: [
        'quiero una hora',
        'solicitar turno',
        'agendar cita',
        'pedir hora médica',
        'necesito una consulta',
      ],
      responses: ['Para agendar, necesito saber la especialidad y tu disponibilidad.'],
      isActive: true,
    },
  });

  await prisma.intent.upsert({
    where: { id: 'intent-urgency-001' },
    update: {},
    create: {
      id: 'intent-urgency-001',
      tenantId: tenant.id,
      name: 'urgent_medical',
      displayName: 'Consulta Urgente',
      description: 'Usuario reporta síntomas urgentes',
      trainingPhrases: [
        'dolor en el pecho',
        'meduele mucho',
        'es grave',
        'emergencia',
        'urgencia',
      ],
      responses: [
        '⚠️ Si es una emergencia vital, llama al 131 (SAMU) o acude a urgencias 24/7. ¿Necesitas que te conecte con un agente ahora?',
      ],
      isActive: true,
    },
  });

  await prisma.intent.upsert({
    where: { id: 'intent-results-001' },
    update: {},
    create: {
      id: 'intent-results-001',
      tenantId: tenant.id,
      name: 'check_results',
      displayName: 'Consultar resultados',
      description: 'Usuario quiere saber resultado de exámenes',
      trainingPhrases: [
        'mis resultados',
        'cuándo están mis resultados',
        'resultado de examen',
        'análisis de laboratorio',
      ],
      responses: ['Para consultar resultados necesitas tu número de identificación. Los resultados están disponibles 48-72 horas después.'],
      isActive: true,
    },
  });

  // ============================================================
  // 14. BOT FLOW (Simple welcome flow)
  // ============================================================
  console.log('🔗 Creando flujo guiado...');
  const flow = await prisma.botFlow.upsert({
    where: { id: 'flow-welcome-001' },
    update: {},
    create: {
      id: 'flow-welcome-001',
      tenantId: tenant.id,
      name: 'Flujo de Bienvenida',
      description: 'Flujo inicial para nuevos usuarios',
      isActive: true,
      nodes: [
        {
          id: 'node-welcome',
          type: 'welcome',
          position: { x: 100, y: 100 },
          data: { message: '¡Hola! 👋 Bienvenido a Clínica San Juan' },
        },
        {
          id: 'node-menu',
          type: 'choice',
          position: { x: 400, y: 100 },
          data: {
            options: [
              { label: '📅 Solicitar hora', value: 'appointment' },
              { label: '📋 Resultados', value: 'results' },
              { label: '🕐 Horarios', value: 'hours' },
              { label: '💳 Cobertura', value: 'coverage' },
            ],
          },
        },
      ],
      edges: [
        { id: 'e1', source: 'node-welcome', target: 'node-menu' },
      ],
      version: 1,
      createdById: adminUser.id,
    },
  });

  // ============================================================
  // 15. CHANNEL INTEGRATION (Web channel)
  // ============================================================
  console.log('🔌 Creando integración de canal web...');
  await prisma.channelIntegration.upsert({
    where: { id: 'channel-web-001' },
    update: {},
    create: {
      id: 'channel-web-001',
      tenantId: tenant.id,
      channel: 'WEB',
      name: 'Web Widget',
      isActive: true,
      config: {
        widget: {
          position: 'bottom-right',
          primaryColor: '#0ea5e9',
          title: 'Asistente San Juan',
          welcomeMessage: '¡Hola! ¿En qué puedo ayudarte?',
          placeholder: 'Escribe tu mensaje...',
        },
      },
    },
  });

  // ============================================================
  // 16. NOTIFICATION (System notification)
  // ===========================================================
  console.log('🔔 Creando notificación de sistema...');
  await prisma.notification.upsert({
    where: { id: 'notif-sys-001' },
    update: {},
    create: {
      id: 'notif-sys-001',
      tenantId: tenant.id,
      type: 'SYSTEM',
      title: 'Bienvenido a la Plataforma',
      message: 'La plataforma ha sido configurada correctamente. Ya puedes comenzar a usar todas las funcionalidades.',
      userId: adminUser.id,
      actionUrl: '/dashboard',
      isRead: false,
      urgency: 'LOW',
      data: { type: 'welcome', metadata: { type: 'welcome' } },
    },
  });

  console.log('\n✅ Seed completado exitosamente!');
  console.log('\n📊 Datos creados:');
  console.log(`   - Planes: ${planStarter.name}, ${planProfessional.name}`);
  console.log(`   - Tenant: ${tenant.name} (${tenant.slug})`);
  console.log(`   - Usuarios: ${adminUser.email}, ${agentUser.email}`);
  console.log(`   - Contactos: ${contact1.firstName} ${contact1.lastName}, ${contact2.firstName} ${contact2.lastName}`);
  console.log(`   - Conversaciones: ${conv1.id}, ${conv2.id}`);
  console.log(`   - Roles: ${roleSuperAdmin.name}, ${roleAdmin.name}, ${roleAgent.name}`);
  console.log(`   - Módulos: ${Object.keys(tenant).length} datos creados`);
  console.log('\n🎉 ¡Todo listo para desarrollo local!');
  console.log('\n🔑 Credenciales de acceso:');
  console.log('   Email: admin@clinicasanjuan.cl');
  console.log('   Password: admin123');
  console.log('   TenantID: 5425d30b-41bc-4eee-a7d8-7dfaa1115509\n');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
