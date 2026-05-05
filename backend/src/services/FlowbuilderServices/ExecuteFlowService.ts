import AppError from "../../errors/AppError";
import Contact from "../../models/Contact";
import Flow from "../../models/Flow";
import FlowEdge from "../../models/FlowEdge";
import FlowExecutionLog from "../../models/FlowExecutionLog";
import FlowNode from "../../models/FlowNode";
import Ticket from "../../models/Ticket";
import { MessagePayload } from "../../handlers/handleWhatsappEvents";
import { logger } from "../../utils/logger";
import HttpRequestService from "../IntegrationServices/HttpRequestService";
import UpdateTicketService from "../TicketServices/UpdateTicketService";
import SendWhatsAppMessage from "../WbotServices/SendWhatsAppMessage";

const MAX_STEPS = 20;

const parseNodeConfig = (node: FlowNode): Record<string, unknown> => {
  try {
    return node.config ? JSON.parse(node.config) : {};
  } catch (error) {
    return {};
  }
};

const pickStartNode = (nodes: FlowNode[], edges: FlowEdge[]): FlowNode | null => {
  const targetNodeIds = new Set(edges.map(edge => edge.targetNodeId));
  const startNodes = nodes.filter(node => !targetNodeIds.has(node.id));

  if (startNodes.length === 0) {
    return nodes[0] || null;
  }

  return startNodes.sort((a, b) => a.id - b.id)[0];
};

const ExecuteFlowService = async ({
  flow,
  ticket,
  contact,
  triggerMessage
}: {
  flow: Flow;
  ticket: Ticket;
  contact: Contact;
  triggerMessage: MessagePayload;
}): Promise<void> => {
  const nodes = (flow.nodes || []).sort((a, b) => a.id - b.id);
  const edges = (flow.edges || []).sort((a, b) => a.id - b.id);
  const nodeMap = new Map(nodes.map(node => [node.id, node]));
  const startNode = pickStartNode(nodes, edges);

  if (!startNode) {
    throw new AppError("ERR_FLOW_NODES_REQUIRED", 400);
  }

  const executionLog = await FlowExecutionLog.create({
    flowId: flow.id,
    ticketId: ticket.id,
    contactId: contact.id,
    triggerMessageId: triggerMessage.id,
    status: "running",
    currentNodeId: startNode.id
  });

  let currentNode: FlowNode | null = startNode;
  let steps = 0;

  try {
    while (currentNode && steps < MAX_STEPS) {
      steps += 1;
      await executionLog.update({
        currentNodeId: currentNode.id
      });

      const nodeConfig = parseNodeConfig(currentNode);
      const outgoingEdges = edges.filter(edge => edge.sourceNodeId === currentNode!.id);
      let conditionResult: string | null = null;

      switch (currentNode.nodeType) {
        case "send_message":
          if (typeof nodeConfig.body === "string" && nodeConfig.body.trim()) {
            await SendWhatsAppMessage({
              body: nodeConfig.body,
              ticket
            });
          }
          break;
        case "condition_contains":
          conditionResult = String(
            (triggerMessage.body || "")
              .toLowerCase()
              .includes(String(nodeConfig.value || "").toLowerCase())
          );
          break;
        case "transfer_queue":
          if (nodeConfig.queueId) {
            const response = await UpdateTicketService({
              ticketData: {
                queueId: Number(nodeConfig.queueId)
              },
              ticketId: ticket.id
            });
            ticket = response.ticket;
          }
          break;
        case "close_ticket":
          await UpdateTicketService({
            ticketData: {
              status: "closed"
            },
            ticketId: ticket.id
          });
          break;
        case "webhook":
          if (typeof nodeConfig.url === "string" && nodeConfig.url.trim()) {
            await HttpRequestService({
              url: nodeConfig.url,
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                flowId: flow.id,
                ticketId: ticket.id,
                contactId: contact.id,
                triggerMessageId: triggerMessage.id,
                body: triggerMessage.body
              })
            });
          }
          break;
        default:
          break;
      }

      if (outgoingEdges.length === 0) {
        currentNode = null;
        break;
      }

      const nextEdge: FlowEdge | undefined =
        currentNode.nodeType === "condition_contains"
          ? outgoingEdges.find(edge => edge.conditionValue === conditionResult) ||
            outgoingEdges[0]
          : outgoingEdges[0];

      currentNode = nextEdge ? nodeMap.get(nextEdge.targetNodeId) || null : null;
    }

    await executionLog.update({
      status: "completed",
      currentNodeId: currentNode?.id || executionLog.currentNodeId
    });
  } catch (error) {
    await executionLog.update({
      status: "failed",
      error: error instanceof Error ? error.message : "ERR_FLOW_EXECUTION_FAILED"
    });

    logger.error(
      {
        err: error,
        flowId: flow.id,
        ticketId: ticket.id
      },
      "Erro ao executar flow."
    );
  }
};

export default ExecuteFlowService;
