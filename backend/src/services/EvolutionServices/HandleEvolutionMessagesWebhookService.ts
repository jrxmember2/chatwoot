import {
  handleMessage,
  ContactPayload,
  MediaPayload,
  MessagePayload,
  WhatsappContextPayload
} from "../../handlers/handleWhatsappEvents";
import { MessageType } from "../../providers/WhatsApp";
import GetEvolutionMediaPayloadService from "./GetEvolutionMediaPayloadService";

const supportedTypes = new Set([
  "chat",
  "audio",
  "ptt",
  "video",
  "image",
  "document",
  "vcard",
  "sticker",
  "location"
]);

const normalizeToArray = (payload: any): any[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.messages)) {
    return payload.messages;
  }

  if (Array.isArray(payload?.data?.messages)) {
    return payload.data.messages;
  }

  if (payload?.data?.key) {
    return [payload.data];
  }

  if (payload?.key) {
    return [payload];
  }

  return [];
};

const mapMessageType = (eventPayload: any): MessageType => {
  const explicitType = (eventPayload?.messageType || "").toString().toLowerCase();

  const explicitTypeMap: Record<string, MessageType> = {
    conversation: "chat",
    extendedtextmessage: "chat",
    imagemessage: "image",
    videomessage: "video",
    audiomessage: "audio",
    documentmessage: "document",
    contactmessage: "vcard",
    contactsarraymessage: "vcard",
    stickermessage: "sticker",
    locationmessage: "location"
  };

  if (explicitTypeMap[explicitType]) {
    return explicitTypeMap[explicitType];
  }

  const message = eventPayload?.message || {};

  if (message.audioMessage?.ptt) {
    return "ptt";
  }

  if (message.conversation || message.extendedTextMessage) {
    return "chat";
  }

  if (message.imageMessage) return "image";
  if (message.videoMessage) return "video";
  if (message.audioMessage) return "audio";
  if (message.documentMessage) return "document";
  if (message.contactMessage || message.contactsArrayMessage) return "vcard";
  if (message.stickerMessage) return "sticker";
  if (message.locationMessage) return "location";

  return "chat";
};

const extractBody = (eventPayload: any, messageType: MessageType): string => {
  const message = eventPayload?.message || {};

  if (message.conversation) {
    return message.conversation;
  }

  if (message.extendedTextMessage?.text) {
    return message.extendedTextMessage.text;
  }

  if (message.imageMessage?.caption) {
    return message.imageMessage.caption;
  }

  if (message.videoMessage?.caption) {
    return message.videoMessage.caption;
  }

  if (message.documentMessage?.caption) {
    return message.documentMessage.caption;
  }

  if (message.contactMessage?.vcard) {
    return message.contactMessage.vcard;
  }

  if (Array.isArray(message.contactsArrayMessage?.contacts)) {
    return message.contactsArrayMessage.contacts
      .map((contact: { vcard?: string }) => contact.vcard || "")
      .filter(Boolean)
      .join("\n");
  }

  if (messageType === "location") {
    const locationMessage = message.locationMessage;
    const latitude = locationMessage?.degreesLatitude;
    const longitude = locationMessage?.degreesLongitude;

    if (latitude && longitude) {
      const gmapsUrl = `https://maps.google.com/maps?q=${latitude}%2C${longitude}&z=17&hl=pt-BR`;
      const description =
        locationMessage?.name ||
        locationMessage?.address ||
        `${latitude}, ${longitude}`;

      return `${gmapsUrl}|${description}`;
    }

    return "[Localizacao recebida via Evolution]";
  }

  if (["image", "video", "audio", "ptt", "document", "sticker"].includes(messageType)) {
    return `[Midia recebida via Evolution: ${messageType}]`;
  }

  return "";
};

const extractQuotedMessageId = (eventPayload: any): string | undefined => {
  const message = eventPayload?.message || {};

  return (
    message.extendedTextMessage?.contextInfo?.stanzaId ||
    message.imageMessage?.contextInfo?.stanzaId ||
    message.videoMessage?.contextInfo?.stanzaId ||
    message.documentMessage?.contextInfo?.stanzaId ||
    message.audioMessage?.contextInfo?.stanzaId ||
    undefined
  );
};

const parseTimestamp = (value: any): number => {
  const numericValue = Number(value);

  if (Number.isFinite(numericValue) && numericValue > 0) {
    return numericValue;
  }

  return Math.floor(Date.now() / 1000);
};

const extractNumber = (remoteJid: string): string => {
  return remoteJid
    .replace(/@s\.whatsapp\.net$/i, "")
    .replace(/@c\.us$/i, "")
    .replace(/@g\.us$/i, "")
    .replace(/\D/g, "");
};

const hasMedia = (messageType: MessageType): boolean => {
  return ["audio", "ptt", "video", "image", "document", "sticker"].includes(
    messageType
  );
};

const isEvolutionMediaPlaceholder = (body: string): boolean => {
  return /^\[Midia recebida via Evolution: .+\]$/i.test((body || "").trim());
};

const buildMessagePayload = (eventPayload: any): MessagePayload | null => {
  const remoteJid =
    eventPayload?.key?.remoteJid ||
    eventPayload?.remoteJid ||
    eventPayload?.message?.key?.remoteJid ||
    "";

  if (!remoteJid || remoteJid === "status@broadcast" || remoteJid.endsWith("@g.us")) {
    return null;
  }

  const id = eventPayload?.key?.id || eventPayload?.messageId || "";

  if (!id) {
    return null;
  }

  const type = mapMessageType(eventPayload);

  if (!supportedTypes.has(type)) {
    return null;
  }

  const fromMe = Boolean(eventPayload?.key?.fromMe);
  const body = extractBody(eventPayload, type);

  return {
    id,
    body,
    fromMe,
    hasMedia: hasMedia(type),
    type,
    timestamp: parseTimestamp(
      eventPayload?.messageTimestamp || eventPayload?.timestamp
    ),
    from: fromMe ? "me" : remoteJid,
    to: remoteJid,
    hasQuotedMsg: Boolean(extractQuotedMessageId(eventPayload)),
    quotedMsgId: extractQuotedMessageId(eventPayload),
    ack: fromMe ? 1 : 0
  };
};

const buildContactPayload = (eventPayload: any): ContactPayload | null => {
  const remoteJid =
    eventPayload?.key?.remoteJid ||
    eventPayload?.remoteJid ||
    eventPayload?.message?.key?.remoteJid ||
    "";

  if (!remoteJid || remoteJid.endsWith("@g.us")) {
    return null;
  }

  const number = extractNumber(remoteJid);

  if (!number) {
    return null;
  }

  return {
    name: eventPayload?.pushName || eventPayload?.sender?.pushName || number,
    number,
    profilePicUrl: undefined,
    isGroup: false
  };
};

const buildMediaPayload = async (
  whatsappId: number,
  eventPayload: any,
  messageType: MessageType
): Promise<MediaPayload | undefined> => {
  if (!hasMedia(messageType)) {
    return undefined;
  }

  return GetEvolutionMediaPayloadService({
    whatsappId,
    eventPayload,
    messageType
  });
};

interface Request {
  whatsappId: number;
  payload: any;
}

const HandleEvolutionMessagesWebhookService = async ({
  whatsappId,
  payload
}: Request): Promise<number> => {
  const items = normalizeToArray(payload);
  let processedCount = 0;

  /* eslint-disable no-await-in-loop */
  for (const item of items) {
    const messagePayload = buildMessagePayload(item);
    const contactPayload = buildContactPayload(item);

    if (!messagePayload || !contactPayload) {
      continue;
    }

    const contextPayload: WhatsappContextPayload = {
      whatsappId,
      unreadMessages: messagePayload.fromMe ? 0 : 1
    };

    const mediaPayload = await buildMediaPayload(
      whatsappId,
      item,
      messagePayload.type
    );

    if (mediaPayload && isEvolutionMediaPlaceholder(messagePayload.body)) {
      messagePayload.body = "";
    }

    await handleMessage(
      messagePayload,
      contactPayload,
      contextPayload,
      mediaPayload
    );

    processedCount += 1;
  }

  return processedCount;
};

export default HandleEvolutionMessagesWebhookService;
