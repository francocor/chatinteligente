import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  ChatResponse,
  ChatContext,
  FlowExecutionResult,
  IntentMatch,
  IntentType,
  ResponseSource,
} from './engine.types';

@Injectable()
export class FlowExecutor {
  private readonly logger = new Logger(FlowExecutor.name);

  constructor(private prisma: PrismaService) {}

  async execute(
    flowId: string,
    nodeId: string | null,
    userMessage: string,
    intent: IntentMatch,
    context: ChatContext,
  ): Promise<FlowExecutionResult> {
    const flow = await this.prisma.botFlow.findUnique({
      where: { id: flowId },
      include: { department: true },
    });

    if (!flow) {
      return this.flowNotFoundResponse();
    }

    const definition = flow.definition as any;
    const nodes = definition?.nodes || [];
    const edges = definition?.edges || [];

    if (!nodeId) {
      const startNode = nodes.find((n: any) => n.nodeId === 'start' || n.nodeId === 'trigger');
      if (startNode) {
        return this.executeNode(startNode, nodes, edges, context, flow);
      }
    }

    const currentNode = nodes.find((n: any) => n.id === nodeId);
    if (!currentNode) {
      return this.invalidNodeResponse(nodeId, nodes);
    }

      if (intent.type === IntentType.AFFIRMATION) {
      const yesEdge = edges.find((e: any) => e.source === nodeId && (e.label === 'Sí' || e.label === 'Yes'));
      if (yesEdge) {
        const nextNode = nodes.find((n: any) => n.id === yesEdge.target);
        if (nextNode) {
          return this.executeNode(nextNode, nodes, edges, context, flow);
        }
      }
    }

     if (intent.type === IntentType.NEGATION) {
      const noEdge = edges.find((e: any) => e.source === nodeId && (e.label === 'No' || e.label === 'No'));
      if (noEdge) {
        const nextNode = nodes.find((n: any) => n.id === noEdge.target);
        if (nextNode) {
          return this.executeNode(nextNode, nodes, edges, context, flow);
        }
      }
    }

    if (intent.flowId && intent.flowId !== flowId) {
      return {
        shouldContinue: false,
        response: {
          message: 'Perdona, pero necesito que respondas a mi pregunta anterior.',
          source: ResponseSource.FLOW,
          shouldOfferHuman: false,
        },
      };
    }

     if (intent.type === IntentType.GOODBYE) {
      return {
        shouldContinue: false,
        response: {
          message: this.getRandomResponse([
            '¡Gracias por contactarnos! Hasta pronto.',
            'Fue un placer ayudarte. ¡Que tengas un buen día!',
            '¡Hasta luego! Cualquier cosa, contáctanos de nuevo.',
          ]),
          source: ResponseSource.FLOW,
        },
      };
    }

    if (currentNode.type === 'question' || currentNode.type === 'choice') {
      return this.collectAndContinue(
        currentNode,
        userMessage,
        intent,
        nodes,
        edges,
        context,
        flow,
      );
    }

    if (currentNode.type === 'condition') {
      return this.evaluateCondition(
        currentNode,
        userMessage,
        intent,
        nodes,
        edges,
        context,
        flow,
      );
    }

    if (currentNode.type === 'transfer') {
      return {
        shouldContinue: false,
        response: {
          message: this.getRandomResponse([
            '¡Te estoy derivando a un agente! Por favor, espera un momento.',
            'Un miembro de nuestro equipo te atenderá personalmente. Gracias por tu paciencia.',
          ]),
          source: ResponseSource.FLOW,
          flowId: flow.id,
          flowNodeId: currentNode.id,
          shouldEscalate: true,
        },
      };
    }

    if (currentNode.type === 'close') {
      return {
        shouldContinue: false,
        response: {
          message: this.getNodeResponse(currentNode),
          source: ResponseSource.FLOW,
          flowId: flow.id,
          flowNodeId: currentNode.id,
        },
      };
    }

    return this.executeNode(currentNode, nodes, edges, context, flow);
  }

  async startFlow(flowId: string, context: ChatContext): Promise<FlowExecutionResult> {
    const flow = await this.prisma.botFlow.findUnique({
      where: { id: flowId },
    });

    if (!flow || !flow.isActive) {
      return this.flowNotFoundResponse();
    }

    const definition = flow.definition as any;
    const nodes = definition?.nodes || [];

    const entryNode = nodes.find((n: any) => n.type === 'trigger' || n.nodeId === 'start');
    if (!entryNode) {
      const firstNode = nodes[0];
      if (firstNode) {
        return this.executeNode(firstNode, nodes, [], context, flow);
      }
      return this.flowNotFoundResponse();
    }

    return this.executeNode(entryNode, nodes, [], context, flow);
  }

  async getFlowInfo(flowId: string): Promise<any> {
    return this.prisma.botFlow.findUnique({
      where: { id: flowId },
      include: { department: true },
    });
  }

  private async executeNode(
    node: any,
    nodes: any[],
    edges: any[],
    context: ChatContext,
    flow: any,
  ): Promise<FlowExecutionResult> {
     const response: ChatResponse = {
       message: this.getNodeResponse(node),
       source: ResponseSource.FLOW,
       flowId: flow.id,
       flowNodeId: node.id,
       metadata: {
         nodeType: node.type,
         nodeLabel: node.label,
       },
     };

    if (node.quickReplies && node.quickReplies.length > 0) {
      response.quickReplies = node.quickReplies.map((qr: any) => ({
        label: qr.label,
        value: qr.value,
        action: 'reply',
      }));
    }

    if (node.buttons && node.buttons.length > 0) {
      response.buttons = node.buttons.map((btn: any) => ({
        label: btn.label,
        value: btn.value,
        action: btn.action || 'reply',
      }));
    }

    if (node.type === 'close') {
      return {
        shouldContinue: false,
        response,
        collectedData: context.collectedData,
      };
    }

    if (node.type === 'transfer') {
      return {
        shouldContinue: false,
        response: {
          ...response,
          shouldEscalate: true,
          shouldOfferHuman: true,
        },
      };
    }

    const outgoingEdges = edges.filter((e: any) => e.source === node.id);

    if (outgoingEdges.length === 0) {
      return {
        shouldContinue: false,
        response,
      };
    }

    if (outgoingEdges.length === 1) {
      return {
        shouldContinue: true,
        nextNodeId: outgoingEdges[0].target,
        response,
      };
    }

    return {
      shouldContinue: true,
      nextNodeId: outgoingEdges[0].target,
      response: {
        ...response,
        quickReplies: outgoingEdges.map((e: any) => ({
          label: e.label || 'Continuar',
          value: e.target,
          action: 'reply',
        })),
      },
    };
  }

  private async collectAndContinue(
    node: any,
    userMessage: string,
    intent: IntentMatch,
    nodes: any[],
    edges: any[],
    context: ChatContext,
    flow: any,
  ): Promise<FlowExecutionResult> {
    if (!context.collectedData) {
      context.collectedData = {};
    }

    if (node.config?.saveToField) {
      context.collectedData[node.config.saveToField] = userMessage;
    }

    context.previousIntents.push(intent.intent || node.type);

    const outgoingEdges = edges.filter((e: any) => e.source === node.id);

    const matchedEdge = outgoingEdges.find((e: any) => 
      e.label?.toLowerCase() === userMessage.toLowerCase()
    );

    if (matchedEdge) {
      const nextNode = nodes.find((n: any) => n.id === matchedEdge.target);
      if (nextNode) {
        return this.executeNode(nextNode, nodes, edges, context, flow);
      }
    }

    if (outgoingEdges.length === 1) {
      const nextNode = nodes.find((n: any) => n.id === outgoingEdges[0].target);
      if (nextNode) {
        return this.executeNode(nextNode, nodes, edges, context, flow);
      }
    }

    return {
      shouldContinue: true,
      nextNodeId: outgoingEdges[0]?.target,
      response: {
        message: 'Perfecto, continuemos...',
        source: ResponseSource.FLOW,
        flowId: flow.id,
        flowNodeId: node.id,
        quickReplies: outgoingEdges.map((e: any) => ({
          label: e.label || 'Continuar',
          value: e.target,
          action: 'reply',
        })),
      },
    };
  }

  private async evaluateCondition(
    node: any,
    userMessage: string,
    intent: IntentMatch,
    nodes: any[],
    edges: any[],
    context: ChatContext,
    flow: any,
  ): Promise<FlowExecutionResult> {
    const outgoingEdges = edges.filter((e: any) => e.source === node.id);

    let selectedEdge = outgoingEdges[0];

      if (intent.type === IntentType.AFFIRMATION) {
       const positiveEdge = outgoingEdges.find((e: any) =>
         e.label?.toLowerCase().includes('si') || e.label?.toLowerCase().includes('yes')
       );
       if (positiveEdge) selectedEdge = positiveEdge;
     } else if (intent.type === IntentType.NEGATION) {
       const negativeEdge = outgoingEdges.find((e: any) =>
         e.label?.toLowerCase().includes('no')
       );
       if (negativeEdge) selectedEdge = negativeEdge;
     }

    const nextNode = nodes.find((n: any) => n.id === selectedEdge?.target);
    if (nextNode) {
      return this.executeNode(nextNode, nodes, edges, context, flow);
    }

    return {
      shouldContinue: true,
      nextNodeId: outgoingEdges[0]?.target,
      response: {
        message: 'Continuemos...',
        source: ResponseSource.FLOW,
        quickReplies: outgoingEdges.map((e: any) => ({
          label: e.label || 'Opción',
          value: e.target,
          action: 'reply',
        })),
      },
    };
  }

  private getNodeResponse(node: any): string {
    if (node.responses && node.responses.length > 0) {
      const response = node.responses[0];
      if (response.content) return response.content;
    }

    if (node.data?.text) return node.data.text;

    if (node.data?.message) return node.data.message;

    return this.getDefaultResponse(node.type);
  }

  private getDefaultResponse(nodeType: string): string {
    const defaults: Record<string, string> = {
      question: '¿Podrías responderme?',
      choice: '¿Qué opción prefieres?',
      message: 'Gracias por tu mensaje.',
      condition: '¿Continuamos?',
      transfer: 'Te estoy derivando a un agente.',
      close: '¡Gracias por contactarnos!',
      delay: 'Por favor, espera...',
      webhook: 'Procesando tu solicitud...',
      ai_response: 'Estoy analiz tu consulta...',
    };
    return defaults[nodeType] || 'Entiendo.';
  }

  private getRandomResponse(responses: string[]): string {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private flowNotFoundResponse(): FlowExecutionResult {
    return {
      shouldContinue: false,
      response: {
        message: 'Lo siento, hubo un problema al procesar tu solicitud. ¿Podrías intentarlo de nuevo?',
        source: ResponseSource.FALLBACK,
      },
    };
  }

  private invalidNodeResponse(nodeId: string, nodes: any[]): FlowExecutionResult {
    const firstNode = nodes[0];
    if (firstNode) {
      return {
        shouldContinue: true,
        nextNodeId: firstNode.id,
        response: {
          message: '¿Podrías repetir tu respuesta?',
          source: ResponseSource.FALLBACK,
        },
      };
    }

    return {
      shouldContinue: false,
      response: {
        message: 'Parece que hay un problema con este flujo. ¿Te gustaría hablar con una persona?',
        source: ResponseSource.FALLBACK,
        shouldOfferHuman: true,
      },
    };
  }
}