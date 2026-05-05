import Flow from "../../models/Flow";
import FlowExecutionLog from "../../models/FlowExecutionLog";
import Ticket from "../../models/Ticket";
import Contact from "../../models/Contact";
import { MessagePayload } from "../../handlers/handleWhatsappEvents";
import ExecuteFlowService from "./ExecuteFlowService";

const normalizeText = (value: string): string => value.toLowerCase().trim();

const flowMatchesMessage = (flow: Flow, message: MessagePayload): boolean => {
  if (flow.triggerType !== "keyword") {
    return false;
  }

  try {
    const config = flow.triggerConfig ? JSON.parse(flow.triggerConfig) : {};
    const keyword = String(config.keyword || "").trim().toLowerCase();
    const matchType = String(config.matchType || "contains");
    const body = normalizeText(message.body || "");

    if (!keyword) {
      return false;
    }

    if (matchType === "exact") {
      return body === keyword;
    }

    return body.includes(keyword);
  } catch (error) {
    return false;
  }
};

interface Request {
  ticket: Ticket;
  contact: Contact;
  message: MessagePayload;
}

const ExecuteIncomingMessageFlowsService = async ({
  ticket,
  contact,
  message
}: Request): Promise<boolean> => {
  if (message.fromMe || ticket.isGroup || ticket.userId) {
    return false;
  }

  const flows = await Flow.findAll({
    where: {
      isActive: true,
      triggerType: "keyword"
    },
    include: ["nodes", "edges"],
    order: [["id", "ASC"]]
  });

  for (const flow of flows) {
    const alreadyExecuted = await FlowExecutionLog.findOne({
      where: {
        flowId: flow.id,
        triggerMessageId: message.id
      }
    });

    if (alreadyExecuted || !flowMatchesMessage(flow, message)) {
      continue;
    }

    await ExecuteFlowService({
      flow,
      ticket,
      contact,
      triggerMessage: message
    });

    return true;
  }

  return false;
};

export default ExecuteIncomingMessageFlowsService;
