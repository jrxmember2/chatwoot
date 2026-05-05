import { getIO } from "../../libs/socket";
import Message from "../../models/Message";
import Ticket from "../../models/Ticket";
import Whatsapp from "../../models/Whatsapp";
import EmitIntegrationEventService from "../IntegrationServices/EmitIntegrationEventService";

interface MessageData {
  id: string;
  ticketId: number;
  body: string;
  contactId?: number;
  fromMe?: boolean;
  read?: boolean;
  mediaType?: string;
  mediaUrl?: string;
  ack?: number;
  quotedMsgId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
interface Request {
  messageData: MessageData;
  skipSocketEmit?: boolean;
}

const CreateMessageService = async ({
  messageData,
  skipSocketEmit = false
}: Request): Promise<Message> => {
  await Message.upsert(messageData);

  const message = await Message.findByPk(messageData.id, {
    include: [
      "contact",
      {
        model: Ticket,
        as: "ticket",
        include: [
          "contact",
          "queue",
          {
            model: Whatsapp,
            as: "whatsapp",
            attributes: ["name"]
          }
        ]
      },
      {
        model: Message,
        as: "quotedMsg",
        include: ["contact"]
      }
    ]
  });

  if (!message) {
    throw new Error("ERR_CREATING_MESSAGE");
  }

  if (skipSocketEmit) {
    EmitIntegrationEventService({
      event: message.fromMe ? "message_sent" : "message_received",
      payload: {
        id: message.id,
        ticketId: message.ticketId,
        contactId: message.contactId,
        body: message.body,
        fromMe: message.fromMe,
        mediaType: message.mediaType,
        whatsappId: message.ticket?.whatsappId
      }
    });

    return message;
  }

  const io = getIO();
  io.to(message.ticketId.toString())
    .to(message.ticket.status)
    .to("notification")
    .emit("appMessage", {
      action: "create",
      message,
      ticket: message.ticket,
      contact: message.ticket.contact
    });

  EmitIntegrationEventService({
    event: message.fromMe ? "message_sent" : "message_received",
    payload: {
      id: message.id,
      ticketId: message.ticketId,
      contactId: message.contactId,
      body: message.body,
      fromMe: message.fromMe,
      mediaType: message.mediaType,
      whatsappId: message.ticket?.whatsappId
    }
  });

  return message;
};

export default CreateMessageService;
