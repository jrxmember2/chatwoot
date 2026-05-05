import { readFileSync } from "fs";
import { getIO } from "../../../libs/socket";
import AppError from "../../../errors/AppError";
import Whatsapp from "../../../models/Whatsapp";
import { logger } from "../../../utils/logger";
import {
  MessageType,
  ProviderContact,
  ProviderMediaInput,
  ProviderMessage,
  SendMediaOptions,
  SendMessageOptions
} from "../types";
import { WhatsappProvider } from "../whatsappProvider";
import ShowWhatsAppService from "../../../services/WhatsappService/ShowWhatsAppService";
import ConfigureEvolutionWebhookService from "../../../services/EvolutionServices/ConfigureEvolutionWebhookService";
import EvolutionRequestService from "../../../services/EvolutionServices/EvolutionRequestService";
import SyncEvolutionStatusService, {
  applyEvolutionStateToWhatsapp
} from "../../../services/EvolutionServices/SyncEvolutionStatusService";
import EmitIntegrationEventService from "../../../services/IntegrationServices/EmitIntegrationEventService";

const emitSessionUpdate = (whatsapp: Whatsapp): void => {
  const io = getIO();

  io.emit("whatsappSession", {
    action: "update",
    session: whatsapp
  });
};

const normalizeNumber = (value: string): string => {
  return value
    .replace(/@s\.whatsapp\.net$/i, "")
    .replace(/@c\.us$/i, "")
    .replace(/@g\.us$/i, "")
    .replace(/\D/g, "");
};

const normalizeRemoteJid = (value: string): string => {
  if (value.endsWith("@g.us")) {
    return value;
  }

  if (/@(s\.whatsapp\.net|c\.us)$/i.test(value)) {
    return value.replace(/@c\.us$/i, "@s.whatsapp.net");
  }

  return `${normalizeNumber(value)}@s.whatsapp.net`;
};

const buildQuotedPayload = (
  body: string,
  options?: SendMessageOptions | SendMediaOptions
): Record<string, unknown> | undefined => {
  if (!options?.quotedMessageId) {
    return undefined;
  }

  return {
    key: {
      id: options.quotedMessageId
    },
    message: {
      conversation: body || ""
    }
  };
};

const parseMessageType = (responseData: any, fallbackType: MessageType): MessageType => {
  const message = responseData?.message || {};

  if (message.imageMessage) return "image";
  if (message.videoMessage) return "video";
  if (message.documentMessage) return "document";
  if (message.audioMessage?.ptt) return "ptt";
  if (message.audioMessage) return "audio";
  if (message.stickerMessage) return "sticker";
  if (message.locationMessage) return "location";
  if (message.contactMessage || message.contactsArrayMessage) return "vcard";
  if (message.conversation || message.extendedTextMessage) return "chat";

  return fallbackType;
};

const buildProviderMessage = (
  responseData: any,
  fallbackBody: string,
  fallbackType: MessageType
): ProviderMessage => {
  const type = parseMessageType(responseData, fallbackType);
  const remoteJid = responseData?.key?.remoteJid || "";

  return {
    id: responseData?.key?.id || "",
    body: fallbackBody,
    fromMe: Boolean(responseData?.key?.fromMe ?? true),
    hasMedia: type !== "chat",
    type,
    timestamp: Number(responseData?.messageTimestamp || Date.now()),
    from: "me",
    to: remoteJid,
    ack: 1
  };
};

const emitConnectionIntegrationEvent = (
  previousStatus: string,
  whatsapp: Whatsapp
): void => {
  if (previousStatus === whatsapp.status) {
    return;
  }

  if (whatsapp.status === "CONNECTED") {
    EmitIntegrationEventService({
      event: "whatsapp_connected",
      payload: {
        id: whatsapp.id,
        name: whatsapp.name,
        status: whatsapp.status,
        provider: whatsapp.provider
      }
    });
    return;
  }

  if (whatsapp.status === "DISCONNECTED") {
    EmitIntegrationEventService({
      event: "whatsapp_disconnected",
      payload: {
        id: whatsapp.id,
        name: whatsapp.name,
        status: whatsapp.status,
        provider: whatsapp.provider
      }
    });
  }
};

const getWhatsapp = async (sessionId: number): Promise<Whatsapp> => {
  return ShowWhatsAppService(sessionId);
};

const init = async (whatsapp: Whatsapp): Promise<void> => {
  const previousStatus = whatsapp.status;

  try {
    await ConfigureEvolutionWebhookService(whatsapp);
    const updatedWhatsapp = await SyncEvolutionStatusService(whatsapp.id);
    emitSessionUpdate(updatedWhatsapp);
    emitConnectionIntegrationEvent(previousStatus, updatedWhatsapp);
  } catch (error) {
    logger.error(
      { err: error, whatsappId: whatsapp.id },
      "Erro ao inicializar conexao Evolution."
    );

    const disconnectedWhatsapp = await applyEvolutionStateToWhatsapp(
      whatsapp,
      "disconnected"
    );
    emitSessionUpdate(disconnectedWhatsapp);
    emitConnectionIntegrationEvent(previousStatus, disconnectedWhatsapp);
    throw error;
  }
};

const removeSession = (_whatsappId: number): void => {
  // No in-memory session is maintained locally for Evolution instances.
};

const logout = async (sessionId: number): Promise<void> => {
  const whatsapp = await getWhatsapp(sessionId);
  const previousStatus = whatsapp.status;

  await EvolutionRequestService({
    whatsapp,
    method: "DELETE",
    path: `/instance/logout/${encodeURIComponent(
      whatsapp.evolutionInstanceName || ""
    )}`
  });

  const updatedWhatsapp = await applyEvolutionStateToWhatsapp(
    whatsapp,
    "disconnected"
  );

  emitSessionUpdate(updatedWhatsapp);
  emitConnectionIntegrationEvent(previousStatus, updatedWhatsapp);
};

const sendMessage = async (
  sessionId: number,
  to: string,
  body: string,
  options?: SendMessageOptions
): Promise<ProviderMessage> => {
  const whatsapp = await getWhatsapp(sessionId);

  const response = await EvolutionRequestService({
    whatsapp,
    method: "POST",
    path: `/message/sendText/${encodeURIComponent(
      whatsapp.evolutionInstanceName || ""
    )}`,
    body: {
      number: normalizeNumber(to),
      text: body,
      linkPreview: options?.linkPreview,
      quoted: buildQuotedPayload(body, options)
    }
  });

  return buildProviderMessage(response.data, body, "chat");
};

const getMediaPayload = (
  media: ProviderMediaInput
): { content: string; filename: string } => {
  const buffer = media.path ? readFileSync(media.path) : media.data;

  if (!buffer) {
    throw new AppError("ERR_NO_MEDIA_DATA", 400);
  }

  return {
    content: buffer.toString("base64"),
    filename: media.filename
  };
};

const resolveEvolutionMediaType = (mimetype: string): MessageType => {
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype.startsWith("video/")) return "video";
  if (mimetype.startsWith("audio/")) return "audio";
  return "document";
};

const sendMedia = async (
  sessionId: number,
  to: string,
  media: ProviderMediaInput,
  options?: SendMediaOptions
): Promise<ProviderMessage> => {
  const whatsapp = await getWhatsapp(sessionId);
  const mediaType = resolveEvolutionMediaType(media.mimetype);
  const mediaPayload = getMediaPayload(media);

  const basePayload = {
    number: normalizeNumber(to),
    linkPreview: false,
    quoted: buildQuotedPayload(options?.caption || media.filename, options)
  };

  const response =
    mediaType === "audio" || mediaType === "ptt"
      ? await EvolutionRequestService({
          whatsapp,
          method: "POST",
          path: `/message/sendWhatsAppAudio/${encodeURIComponent(
            whatsapp.evolutionInstanceName || ""
          )}`,
          body: {
            ...basePayload,
            audio: mediaPayload.content
          }
        })
      : await EvolutionRequestService({
          whatsapp,
          method: "POST",
          path: `/message/sendMedia/${encodeURIComponent(
            whatsapp.evolutionInstanceName || ""
          )}`,
          body: {
            ...basePayload,
            mediatype:
              mediaType === "image"
                ? "image"
                : mediaType === "video"
                  ? "video"
                  : "document",
            mimetype: media.mimetype,
            caption: options?.caption || media.filename,
            media: mediaPayload.content,
            fileName: mediaPayload.filename
          }
        });

  return buildProviderMessage(
    response.data,
    options?.caption || media.filename,
    mediaType === "audio" && options?.sendAudioAsVoice ? "ptt" : mediaType
  );
};

const deleteMessage = async (
  sessionId: number,
  chatId: string,
  messageId: string,
  fromMe: boolean
): Promise<void> => {
  const whatsapp = await getWhatsapp(sessionId);

  await EvolutionRequestService({
    whatsapp,
    method: "DELETE",
    path: `/chat/deleteMessageForEveryone/${encodeURIComponent(
      whatsapp.evolutionInstanceName || ""
    )}`,
    body: {
      id: messageId,
      remoteJid: normalizeRemoteJid(chatId),
      fromMe
    }
  });
};

const checkNumber = async (
  sessionId: number,
  number: string
): Promise<string> => {
  const whatsapp = await getWhatsapp(sessionId);

  const response = await EvolutionRequestService({
    whatsapp,
    method: "POST",
    path: `/chat/whatsappNumbers/${encodeURIComponent(
      whatsapp.evolutionInstanceName || ""
    )}`,
    body: {
      numbers: [normalizeNumber(number)]
    }
  });

  const firstResult = Array.isArray(response.data) ? response.data[0] : null;

  if (!firstResult?.exists || !firstResult?.jid) {
    throw new AppError("ERR_NUMBER_NOT_ON_WHATSAPP", 404);
  }

  return firstResult.jid;
};

const getProfilePicUrl = async (
  sessionId: number,
  number: string
): Promise<string> => {
  const whatsapp = await getWhatsapp(sessionId);

  const response = await EvolutionRequestService({
    whatsapp,
    method: "POST",
    path: `/chat/fetchProfilePictureUrl/${encodeURIComponent(
      whatsapp.evolutionInstanceName || ""
    )}`,
    body: {
      number: normalizeNumber(number)
    }
  });

  return response.data?.profilePictureUrl || "";
};

const getContacts = async (sessionId: number): Promise<ProviderContact[]> => {
  const whatsapp = await getWhatsapp(sessionId);

  try {
    const response = await EvolutionRequestService({
      whatsapp,
      method: "POST",
      path: `/chat/findContacts/${encodeURIComponent(
        whatsapp.evolutionInstanceName || ""
      )}`,
      body: {
        where: {}
      }
    });

    const contacts = Array.isArray(response.data)
      ? response.data
      : Array.isArray(response.data?.response)
        ? response.data.response
        : [];

    return contacts
      .map((contact: any) => ({
        id: contact.id || contact.wuid || "",
        name: contact.name || contact.notify || contact.pushName || "",
        pushname: contact.pushName || contact.notify || "",
        number: normalizeNumber(contact.id || contact.wuid || contact.number || ""),
        profilePicUrl: contact.profilePictureUrl,
        isGroup: Boolean(contact.id?.endsWith?.("@g.us"))
      }))
      .filter((contact: ProviderContact) => Boolean(contact.number));
  } catch {
    return [];
  }
};

const sendSeen = async (_sessionId: number, _chatId: string): Promise<void> => {
  // Evolution requires message ids to mark a chat as read.
};

const fetchChatMessages = async (
  _sessionId: number,
  _chatId: string,
  _limit: number
): Promise<ProviderMessage[]> => {
  return [];
};

export const EvolutionApiProvider: WhatsappProvider = {
  init,
  removeSession,
  logout,
  sendMessage,
  sendMedia,
  deleteMessage,
  checkNumber,
  getProfilePicUrl,
  getContacts,
  sendSeen,
  fetchChatMessages
};
