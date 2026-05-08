import Message from "../../models/Message";
import Ticket from "../../models/Ticket";
import Whatsapp from "../../models/Whatsapp";
import Contact from "../../models/Contact";
import { MessageAck } from "../../providers/WhatsApp";
import EvolutionRequestService from "./EvolutionRequestService";
import GetEvolutionConnectionConfigService from "./GetEvolutionConnectionConfigService";
import { extractAckFromEvolutionPayload } from "./resolveEvolutionMessageAck";

type MessageWithRelations = Message & {
  ticket?: Ticket & {
    whatsapp?: Whatsapp;
    contact?: Contact;
  };
};

const buildRemoteJid = (
  message: MessageWithRelations
): string | null => {
  const ticket = message.ticket;
  const contactNumber = ticket?.contact?.number;

  if (!ticket || !contactNumber) {
    return null;
  }

  const normalizedNumber = contactNumber.replace(/\D/g, "");

  if (!normalizedNumber) {
    return null;
  }

  return `${normalizedNumber}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`;
};

const findAckViaStatusLookup = async (
  message: MessageWithRelations,
  remoteJid: string,
  instanceName: string
): Promise<MessageAck | null> => {
  const whatsapp = message.ticket?.whatsapp;

  if (!whatsapp) {
    return null;
  }

  const response = await EvolutionRequestService({
    whatsapp,
    method: "POST",
    path: `/chat/findStatusMessage/${encodeURIComponent(instanceName)}`,
    body: {
      where: {
        id: message.id,
        remoteJid,
        fromMe: true
      },
      limit: 1
    }
  });

  return extractAckFromEvolutionPayload(response.data, message.id);
};

const findAckViaMessagesLookup = async (
  message: MessageWithRelations,
  remoteJid: string,
  instanceName: string
): Promise<MessageAck | null> => {
  const whatsapp = message.ticket?.whatsapp;

  if (!whatsapp) {
    return null;
  }

  const response = await EvolutionRequestService({
    whatsapp,
    method: "POST",
    path: `/chat/findMessages/${encodeURIComponent(instanceName)}`,
    body: {
      where: {
        key: {
          remoteJid
        },
        fromMe: true
      },
      limit: 20
    }
  });

  return extractAckFromEvolutionPayload(response.data, message.id);
};

const FindEvolutionMessageAckService = async (
  message: MessageWithRelations
): Promise<MessageAck | null> => {
  const whatsapp = message.ticket?.whatsapp;

  if (!whatsapp || whatsapp.provider !== "evolution") {
    return null;
  }

  const remoteJid = buildRemoteJid(message);

  if (!remoteJid) {
    return null;
  }

  const config = await GetEvolutionConnectionConfigService(whatsapp);

  try {
    const ack = await findAckViaStatusLookup(message, remoteJid, config.instanceName);

    if (ack !== null) {
      return ack;
    }
  } catch {
    // Fallback to the more generic endpoint for versions where
    // findStatusMessage is unstable or returns an empty payload.
  }

  try {
    return await findAckViaMessagesLookup(message, remoteJid, config.instanceName);
  } catch {
    return null;
  }
};

export default FindEvolutionMessageAckService;
