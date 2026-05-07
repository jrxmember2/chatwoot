import path from "path";
import { MediaPayload } from "../../handlers/handleWhatsappEvents";
import { MessageType } from "../../providers/WhatsApp";
import ShowWhatsAppService from "../WhatsappService/ShowWhatsAppService";
import EvolutionRequestService from "./EvolutionRequestService";
import { logger } from "../../utils/logger";

interface Request {
  whatsappId: number;
  eventPayload: any;
  messageType: MessageType;
}

const mediaNodeByType: Partial<Record<MessageType, string>> = {
  audio: "audioMessage",
  ptt: "audioMessage",
  video: "videoMessage",
  image: "imageMessage",
  document: "documentMessage",
  sticker: "stickerMessage"
};

const inferMimeType = (messageType: MessageType): string => {
  switch (messageType) {
    case "image":
      return "image/jpeg";
    case "video":
      return "video/mp4";
    case "audio":
    case "ptt":
      return "audio/ogg";
    case "sticker":
      return "image/webp";
    default:
      return "application/octet-stream";
  }
};

const inferExtension = (mimetype: string, messageType: MessageType): string => {
  const cleanMimeType = (mimetype || "").split(";")[0].trim().toLowerCase();

  if (cleanMimeType === "image/jpeg") return "jpg";
  if (cleanMimeType === "image/png") return "png";
  if (cleanMimeType === "image/webp") return "webp";
  if (cleanMimeType === "video/mp4") return "mp4";
  if (cleanMimeType === "audio/ogg") return "ogg";
  if (cleanMimeType === "audio/mpeg") return "mp3";
  if (cleanMimeType === "audio/mp4") return "m4a";
  if (cleanMimeType === "application/pdf") return "pdf";

  const [, subtype] = cleanMimeType.split("/");
  if (subtype) {
    return subtype.split("+")[0];
  }

  switch (messageType) {
    case "image":
      return "jpg";
    case "video":
      return "mp4";
    case "audio":
    case "ptt":
      return "ogg";
    case "sticker":
      return "webp";
    default:
      return "bin";
  }
};

const normalizeBase64 = (value?: string | null): string | null => {
  if (!value || typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  const base64PrefixMatch = trimmedValue.match(/^data:.*?;base64,(.+)$/i);

  if (base64PrefixMatch?.[1]) {
    return base64PrefixMatch[1];
  }

  return trimmedValue;
};

const getMediaNode = (eventPayload: any, messageType: MessageType): any => {
  const nodeKey = mediaNodeByType[messageType];

  if (!nodeKey) {
    return null;
  }

  return eventPayload?.message?.[nodeKey] || null;
};

const getFilename = (
  mediaNode: any,
  apiData: any,
  mimetype: string,
  messageType: MessageType
): string => {
  const rawFileName =
    apiData?.fileName ||
    apiData?.filename ||
    mediaNode?.fileName ||
    mediaNode?.filename ||
    mediaNode?.file_name ||
    null;

  if (rawFileName) {
    return rawFileName;
  }

  return `${messageType}-${Date.now()}.${inferExtension(mimetype, messageType)}`;
};

const getMimeType = (
  mediaNode: any,
  apiData: any,
  messageType: MessageType
): string => {
  return (
    apiData?.mimetype ||
    apiData?.mimeType ||
    apiData?.mime_type ||
    mediaNode?.mimetype ||
    mediaNode?.mimeType ||
    mediaNode?.mime_type ||
    inferMimeType(messageType)
  );
};

const extractWebhookBase64 = (eventPayload: any): string | null => {
  return normalizeBase64(
    eventPayload?.message?.base64 ||
      eventPayload?.base64 ||
      eventPayload?.data?.message?.base64 ||
      eventPayload?.data?.base64
  );
};

const fetchMediaBase64FromEvolution = async (
  whatsappId: number,
  eventPayload: any,
  messageType: MessageType
): Promise<any | null> => {
  try {
    const whatsapp = await ShowWhatsAppService(whatsappId);

    const response = await EvolutionRequestService({
      whatsapp,
      method: "POST",
      path: `/chat/getBase64FromMediaMessage/${encodeURIComponent(
        whatsapp.evolutionInstanceName || ""
      )}`,
      body: {
        message: eventPayload,
        convertToMp4: messageType === "video"
      }
    });

    return response.data;
  } catch (error) {
    logger.warn(
      {
        err: error,
        whatsappId,
        messageId: eventPayload?.key?.id,
        messageType
      },
      "Nao foi possivel obter a base64 da midia via Evolution."
    );

    return null;
  }
};

const GetEvolutionMediaPayloadService = async ({
  whatsappId,
  eventPayload,
  messageType
}: Request): Promise<MediaPayload | undefined> => {
  const mediaNode = getMediaNode(eventPayload, messageType);

  if (!mediaNode) {
    return undefined;
  }

  let apiData: any = null;
  let base64 = extractWebhookBase64(eventPayload);

  if (!base64) {
    apiData = await fetchMediaBase64FromEvolution(
      whatsappId,
      eventPayload,
      messageType
    );

    base64 = normalizeBase64(
      apiData?.base64 ||
        apiData?.data?.base64 ||
        apiData?.message?.base64 ||
        (typeof apiData === "string" ? apiData : null)
    );
  }

  if (!base64) {
    return undefined;
  }

  const mimetype = getMimeType(mediaNode, apiData, messageType);
  const filename = getFilename(mediaNode, apiData, mimetype, messageType);

  return {
    filename: path.basename(filename),
    mimetype,
    data: base64
  };
};

export default GetEvolutionMediaPayloadService;
