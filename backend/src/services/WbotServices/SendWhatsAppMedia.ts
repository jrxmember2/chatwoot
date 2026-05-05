import fs from "fs";
import path from "path";
import AppError from "../../errors/AppError";
import Ticket from "../../models/Ticket";
import { whatsappProvider, ProviderMessage } from "../../providers/WhatsApp";
import uploadConfig from "../../config/upload";
import CreateMessageService from "../MessageServices/CreateMessageService";

import formatBody from "../../helpers/Mustache";

interface Request {
  media: Express.Multer.File;
  ticket: Ticket;
  body?: string;
  removeAfterSend?: boolean;
}

const normalizeMessageDate = (timestamp?: number): Date | undefined => {
  if (!timestamp || !Number.isFinite(timestamp)) {
    return undefined;
  }

  const timestampInMs = timestamp < 1e12 ? timestamp * 1000 : timestamp;
  return new Date(timestampInMs);
};

const getStoredMediaUrl = (mediaPath: string): string | null => {
  const relativePath = path.relative(uploadConfig.directory, mediaPath);

  if (!relativePath || relativePath.startsWith("..")) {
    return null;
  }

  return relativePath.replace(/\\/g, "/");
};

const SendWhatsAppMedia = async ({
  media,
  ticket,
  body,
  removeAfterSend = true
}: Request): Promise<ProviderMessage> => {
  try {
    if (!ticket.whatsappId) {
      throw new AppError("ERR_TICKET_NO_WHATSAPP");
    }

    const chatId = `${ticket.contact.number}@${ticket.isGroup ? "g" : "c"}.us`;

    const hasBody = body
      ? formatBody(body as string, ticket.contact)
      : undefined;

    const mediaInput = {
      filename: media.filename,
      mimetype: media.mimetype,
      path: media.path
    };

    const mediaOptions = {
      caption: hasBody,
      sendAudioAsVoice: true,
      sendMediaAsDocument:
        media.mimetype.startsWith("image/") &&
        !/^.*\.(jpe?g|png|gif)?$/i.exec(media.filename)
    };

    const sentMessage = await whatsappProvider.sendMedia(
      ticket.whatsappId,
      chatId,
      mediaInput,
      mediaOptions
    );

    await ticket.update({
      lastMessage: body || media.originalname || media.filename
    });

    const messageDate = normalizeMessageDate(sentMessage.timestamp);
    const storedMediaUrl = getStoredMediaUrl(media.path);

    await CreateMessageService({
      messageData: {
        id: sentMessage.id,
        ticketId: ticket.id,
        body: hasBody || media.originalname || media.filename,
        fromMe: true,
        read: true,
        mediaType: sentMessage.type,
        mediaUrl: storedMediaUrl || undefined,
        ack: sentMessage.ack ?? 1,
        ...(messageDate
          ? {
              createdAt: messageDate,
              updatedAt: messageDate
            }
          : {})
      }
    });

    if (removeAfterSend && !storedMediaUrl && fs.existsSync(media.path)) {
      fs.unlinkSync(media.path);
    }

    return sentMessage;
  } catch (err) {
    console.log(err);
    throw new AppError("ERR_SENDING_WAPP_MSG");
  }
};

export default SendWhatsAppMedia;
