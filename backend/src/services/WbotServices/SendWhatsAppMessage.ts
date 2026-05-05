import AppError from "../../errors/AppError";
import Message from "../../models/Message";
import Ticket from "../../models/Ticket";
import { whatsappProvider, ProviderMessage } from "../../providers/WhatsApp";
import CreateMessageService from "../MessageServices/CreateMessageService";

import formatBody from "../../helpers/Mustache";

interface Request {
  body: string;
  ticket: Ticket;
  quotedMsg?: Message;
}

const normalizeMessageDate = (timestamp?: number): Date | undefined => {
  if (!timestamp || !Number.isFinite(timestamp)) {
    return undefined;
  }

  const timestampInMs = timestamp < 1e12 ? timestamp * 1000 : timestamp;
  return new Date(timestampInMs);
};

const SendWhatsAppMessage = async ({
  body,
  ticket,
  quotedMsg
}: Request): Promise<ProviderMessage> => {
  if (!ticket.whatsappId) {
    throw new AppError("ERR_TICKET_NO_WHATSAPP");
  }

  const chatId = `${ticket.contact.number}@${ticket.isGroup ? "g" : "c"}.us`;
  const formattedBody = formatBody(body, ticket.contact);

  try {
    const sentMessage = await whatsappProvider.sendMessage(
      ticket.whatsappId,
      chatId,
      formattedBody,
      {
        quotedMessageId: quotedMsg?.id,
        quotedMessageFromMe: quotedMsg?.fromMe,
        linkPreview: false
      }
    );

    await ticket.update({ lastMessage: body });

    const messageDate = normalizeMessageDate(sentMessage.timestamp);

    await CreateMessageService({
      messageData: {
        id: sentMessage.id,
        ticketId: ticket.id,
        body: formattedBody,
        fromMe: true,
        read: true,
        mediaType: sentMessage.type,
        quotedMsgId: quotedMsg?.id,
        ack: sentMessage.ack ?? 1,
        ...(messageDate
          ? {
              createdAt: messageDate,
              updatedAt: messageDate
            }
          : {})
      }
    });

    return sentMessage;
  } catch (err) {
    throw new AppError("ERR_SENDING_WAPP_MSG");
  }
};

export default SendWhatsAppMessage;
