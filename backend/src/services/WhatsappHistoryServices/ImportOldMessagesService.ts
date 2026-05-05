import { Op } from "sequelize";
import { getIO } from "../../libs/socket";
import AppError from "../../errors/AppError";
import Contact from "../../models/Contact";
import Message from "../../models/Message";
import Ticket from "../../models/Ticket";
import Whatsapp from "../../models/Whatsapp";
import WhatsAppHistoryImport from "../../models/WhatsAppHistoryImport";
import CreateOrUpdateContactService from "../ContactServices/CreateOrUpdateContactService";
import CreateMessageService from "../MessageServices/CreateMessageService";
import FindOrCreateHistoryTicketService from "../TicketServices/FindOrCreateHistoryTicketService";
import ShowWhatsAppService from "../WhatsappService/ShowWhatsAppService";
import { getWwebjsSession } from "../../providers/WhatsApp/Implementations/wwebjs";
import { logger } from "../../utils/logger";
import { sleep } from "../../utils/sleep";

const MAX_IMPORT_DAYS = 90;
const DEFAULT_MESSAGES_LIMIT = 100;
const CHAT_PROCESS_DELAY_MS = 150;
const runningImports = new Set<number>();

type StartImportRequest = {
  whatsappId: number;
  days?: number;
  userId?: number;
};

type ImportCounters = {
  importedChatsCount: number;
  importedMessagesCount: number;
  skippedMessagesCount: number;
};

type HistoryStatusResponse = {
  status: string;
  days: number | null;
  lastOldMessagesImportAt: Date | null;
  importedChatsCount: number;
  importedMessagesCount: number;
  skippedMessagesCount: number;
  error: string | null;
};

const supportedMessageTypes = new Set([
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

const ensureValidImportDays = (days: number): void => {
  if (!Number.isInteger(days) || days < 1 || days > MAX_IMPORT_DAYS) {
    throw new AppError("ERR_OLD_MESSAGES_IMPORT_INVALID_DAYS", 400);
  }
};

const emitWhatsappUpdate = async (whatsappId: number): Promise<void> => {
  const io = getIO();
  const whatsapp = await ShowWhatsAppService(whatsappId);

  io.emit("whatsapp", {
    action: "update",
    whatsapp
  });
};

const getImportBody = (message: any): string => {
  if (message.hasMedia) {
    return (
      message.body ||
      "[Midia nao importada automaticamente]"
    );
  }

  if (message.type === "location" && !message.body) {
    return "[Localizacao nao importada automaticamente]";
  }

  return message.body || "";
};

const getImportMediaType = (message: any): string => {
  if (message.hasMedia) {
    return message.type || "media";
  }

  return message.type || "chat";
};

const updateTicketWithImportedMessage = async (
  ticket: Ticket,
  messageDate: Date,
  lastMessage: string
): Promise<void> => {
  const currentUpdatedAt = ticket.updatedAt ? new Date(ticket.updatedAt) : null;

  if (!currentUpdatedAt || currentUpdatedAt.getTime() <= messageDate.getTime()) {
    ticket.set("lastMessage", lastMessage);
    ticket.set("updatedAt", messageDate);
    await ticket.save({ silent: true });
  }
};

const resolveContactForChat = async (chat: any): Promise<Contact> => {
  const chatContact = await chat.getContact();
  const number = chatContact.number || chatContact.id?.user || "";
  const name =
    chatContact.name ||
    chatContact.pushname ||
    chat.name ||
    number;

  return CreateOrUpdateContactService({
    name,
    number,
    profilePicUrl: undefined,
    isGroup: false,
    skipSocketEmit: true
  });
};

const createImportLog = async (
  whatsappId: number,
  days: number
): Promise<WhatsAppHistoryImport> => {
  return WhatsAppHistoryImport.create({
    whatsappId,
    status: "running",
    days,
    startedAt: new Date(),
    importedChatsCount: 0,
    importedMessagesCount: 0,
    skippedMessagesCount: 0,
    error: null
  });
};

const updateImportProgress = async (
  historyImport: WhatsAppHistoryImport,
  counters: ImportCounters
): Promise<void> => {
  await historyImport.update({
    importedChatsCount: counters.importedChatsCount,
    importedMessagesCount: counters.importedMessagesCount,
    skippedMessagesCount: counters.skippedMessagesCount
  });
};

const finalizeImportSuccess = async (
  whatsapp: Whatsapp,
  historyImport: WhatsAppHistoryImport,
  counters: ImportCounters
): Promise<void> => {
  const finishedAt = new Date();

  await historyImport.update({
    status: "done",
    finishedAt,
    importedChatsCount: counters.importedChatsCount,
    importedMessagesCount: counters.importedMessagesCount,
    skippedMessagesCount: counters.skippedMessagesCount,
    error: null
  });

  await whatsapp.update({
    oldMessagesImportStatus: "done",
    oldMessagesImportError: null,
    lastOldMessagesImportAt: finishedAt
  });

  await emitWhatsappUpdate(whatsapp.id);
};

const finalizeImportFailure = async (
  whatsapp: Whatsapp,
  historyImport: WhatsAppHistoryImport | null,
  errorMessage: string
): Promise<void> => {
  const finishedAt = new Date();

  if (historyImport) {
    await historyImport.update({
      status: "failed",
      finishedAt,
      error: errorMessage
    });
  }

  await whatsapp.update({
    oldMessagesImportStatus: "failed",
    oldMessagesImportError: errorMessage,
    lastOldMessagesImportAt: finishedAt
  });

  await emitWhatsappUpdate(whatsapp.id);
};

const getConfiguredDays = (whatsapp: Whatsapp, days?: number): number => {
  const configuredDays =
    days || whatsapp.importOldMessagesDays || 0;

  ensureValidImportDays(configuredDays);

  return configuredDays;
};

const markWhatsappPendingImport = async (
  whatsapp: Whatsapp,
  days: number
): Promise<void> => {
  await whatsapp.update({
    importOldMessages: true,
    importOldMessagesDays: days,
    oldMessagesImportStatus: "pending",
    oldMessagesImportError: null
  });

  await emitWhatsappUpdate(whatsapp.id);
};

const getLatestHistoryImport = async (
  whatsappId: number
): Promise<WhatsAppHistoryImport | null> => {
  return WhatsAppHistoryImport.findOne({
    where: { whatsappId },
    order: [["createdAt", "DESC"]]
  });
};

const ImportOldMessagesService = async ({
  whatsappId,
  days
}: StartImportRequest): Promise<void> => {
  const whatsapp = await ShowWhatsAppService(whatsappId);

  if (whatsapp.provider !== "wwebjs") {
    throw new AppError("ERR_OLD_MESSAGES_IMPORT_UNSUPPORTED", 400);
  }

  const importDays = getConfiguredDays(whatsapp, days);
  const sinceDate = new Date(Date.now() - importDays * 24 * 60 * 60 * 1000);
  const wbot = getWwebjsSession(whatsappId);
  let historyImport: WhatsAppHistoryImport | null = null;
  const counters: ImportCounters = {
    importedChatsCount: 0,
    importedMessagesCount: 0,
    skippedMessagesCount: 0
  };

  try {
    await whatsapp.update({
      oldMessagesImportStatus: "running",
      oldMessagesImportError: null
    });
    await emitWhatsappUpdate(whatsapp.id);

    historyImport = await createImportLog(whatsapp.id, importDays);

    logger.info(
      `Iniciando sincronizacao de mensagens antigas da conexao ${whatsapp.id}`
    );

    const chats = await wbot.getChats();

    /* eslint-disable no-await-in-loop */
    for (const chat of chats) {
      try {
        if (chat.isGroup || chat.archived) {
          continue;
        }

        const messages = await chat.fetchMessages({
          limit: DEFAULT_MESSAGES_LIMIT
        });

        if (!messages || messages.length === 0) {
          continue;
        }

        const sortedMessages = [...messages].sort(
          (a, b) => a.timestamp - b.timestamp
        );

        const eligibleMessages = sortedMessages.filter(message => {
          const messageDate = new Date(message.timestamp * 1000);

          if (!supportedMessageTypes.has(message.type)) {
            return false;
          }

          return messageDate.getTime() >= sinceDate.getTime();
        });

        if (eligibleMessages.length === 0) {
          continue;
        }

        const contact = await resolveContactForChat(chat);
        let importedMessagesInChat = 0;

        for (const message of eligibleMessages) {
          const messageId = message.id?.id;

          if (!messageId) {
            counters.skippedMessagesCount += 1;
            continue;
          }

          const existingMessage = await Message.findByPk(messageId);

          if (existingMessage) {
            counters.skippedMessagesCount += 1;
            continue;
          }

          const messageDate = new Date(message.timestamp * 1000);
          const ticket = await FindOrCreateHistoryTicketService({
            contact,
            whatsappId: whatsapp.id,
            messageDate
          });

          const body = getImportBody(message);
          const mediaType = getImportMediaType(message);

          await CreateMessageService({
            messageData: {
              id: messageId,
              ticketId: ticket.id,
              contactId: message.fromMe ? undefined : contact.id,
              body,
              fromMe: message.fromMe,
              read: true,
              mediaType,
              ack: typeof message.ack === "number" ? message.ack : 0,
              createdAt: messageDate,
              updatedAt: messageDate
            },
            skipSocketEmit: true
          });

          await updateTicketWithImportedMessage(
            ticket,
            messageDate,
            body || "[Midia nao importada automaticamente]"
          );

          importedMessagesInChat += 1;
          counters.importedMessagesCount += 1;
        }

        if (importedMessagesInChat > 0) {
          counters.importedChatsCount += 1;
          await updateImportProgress(historyImport, counters);
        }
      } catch (chatError) {
        logger.warn(
          {
            err: chatError,
            whatsappId: whatsapp.id,
            chatId: chat.id?._serialized || chat.id?.user || "unknown"
          },
          "Erro ao importar historico de um chat. Seguindo para o proximo."
        );
      }

      await sleep(CHAT_PROCESS_DELAY_MS);
    }

    await finalizeImportSuccess(whatsapp, historyImport, counters);

    logger.info(
      `Finalizada sincronizacao: ${counters.importedChatsCount} chats, ${counters.importedMessagesCount} mensagens importadas, ${counters.skippedMessagesCount} ignoradas`
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "ERR_OLD_MESSAGES_IMPORT_FAILED";

    await finalizeImportFailure(whatsapp, historyImport, errorMessage);
    throw error;
  } finally {
    runningImports.delete(whatsappId);
  }
};

export const startOldMessagesImportInBackground = async ({
  whatsappId,
  days,
  userId
}: StartImportRequest): Promise<void> => {
  if (runningImports.has(whatsappId)) {
    throw new AppError("ERR_OLD_MESSAGES_IMPORT_ALREADY_RUNNING", 409);
  }

  const whatsapp = await ShowWhatsAppService(whatsappId);
  const importDays = getConfiguredDays(whatsapp, days);

  await markWhatsappPendingImport(whatsapp, importDays);
  runningImports.add(whatsappId);

  void ImportOldMessagesService({
    whatsappId,
    days: importDays,
    userId
  }).catch(error => {
    logger.error(
      {
        err: error,
        whatsappId
      },
      "Erro fatal na sincronizacao de mensagens antigas."
    );
  });
};

export const maybeStartConfiguredOldMessagesImportInBackground = async (
  whatsappId: number
): Promise<void> => {
  const whatsapp = await ShowWhatsAppService(whatsappId);

  if (!whatsapp.importOldMessages || !whatsapp.importOldMessagesDays) {
    return;
  }

  if (runningImports.has(whatsappId)) {
    return;
  }

  if (whatsapp.oldMessagesImportStatus === "done") {
    return;
  }

  if (whatsapp.oldMessagesImportStatus === "running") {
    await whatsapp.update({
      oldMessagesImportStatus: "pending"
    });
    await emitWhatsappUpdate(whatsapp.id);
  }

  if (whatsapp.oldMessagesImportStatus !== "pending") {
    return;
  }

  await startOldMessagesImportInBackground({
    whatsappId,
    days: whatsapp.importOldMessagesDays
  });
};

export const getOldMessagesImportStatus = async (
  whatsappId: number
): Promise<HistoryStatusResponse> => {
  const whatsapp = await ShowWhatsAppService(whatsappId);
  const latestImport = await getLatestHistoryImport(whatsappId);

  return {
    status: whatsapp.oldMessagesImportStatus || "idle",
    days: latestImport?.days || whatsapp.importOldMessagesDays || null,
    lastOldMessagesImportAt: whatsapp.lastOldMessagesImportAt || null,
    importedChatsCount: latestImport?.importedChatsCount || 0,
    importedMessagesCount: latestImport?.importedMessagesCount || 0,
    skippedMessagesCount: latestImport?.skippedMessagesCount || 0,
    error: whatsapp.oldMessagesImportError || latestImport?.error || null
  };
};

export default ImportOldMessagesService;
