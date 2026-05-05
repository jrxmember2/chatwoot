import AppError from "../../errors/AppError";
import Whatsapp from "../../models/Whatsapp";
import {
  ProviderContact,
  ProviderMediaInput,
  ProviderMessage,
  SendMediaOptions,
  SendMessageOptions
} from "./types";
import { WhatsappWebJsProvider } from "./Implementations/wwebjs";
import { WhaileysProvider } from "./Implementations/whaileys";
import { EvolutionApiProvider } from "./Implementations/evolution";

export interface WhatsappProvider {
  init(whatsapp: Whatsapp): Promise<void>;
  removeSession(whatsappId: number): void;
  logout(sessionId: number): Promise<void>;
  sendMessage(
    sessionId: number,
    to: string,
    body: string,
    options?: SendMessageOptions
  ): Promise<ProviderMessage>;
  sendMedia(
    sessionId: number,
    to: string,
    media: ProviderMediaInput,
    options?: SendMediaOptions
  ): Promise<ProviderMessage>;
  deleteMessage(
    sessionId: number,
    chatId: string,
    messageId: string,
    fromMe: boolean
  ): Promise<void>;
  checkNumber(sessionId: number, number: string): Promise<string>;
  getProfilePicUrl(sessionId: number, number: string): Promise<string>;
  getContacts(sessionId: number): Promise<ProviderContact[]>;
  sendSeen(sessionId: number, chatId: string): Promise<void>;
  fetchChatMessages(
    sessionId: number,
    chatId: string,
    limit: number
  ): Promise<ProviderMessage[]>;
}

const defaultProvider = process.env.WHATSAPP_PROVIDER || "wwebjs";

const providersMap: Record<string, WhatsappProvider> = {
  wwebjs: WhatsappWebJsProvider,
  whaileys: WhaileysProvider,
  evolution: EvolutionApiProvider
};

const getProviderKeyFromWhatsapp = (whatsapp?: Partial<Whatsapp> | null): string => {
  const providerKey = whatsapp?.provider || defaultProvider;

  if (providersMap[providerKey]) {
    return providerKey;
  }

  return defaultProvider;
};

const getProviderFromWhatsapp = (
  whatsapp?: Partial<Whatsapp> | null
): WhatsappProvider => {
  return providersMap[getProviderKeyFromWhatsapp(whatsapp)];
};

const getWhatsappById = async (whatsappId: number): Promise<Whatsapp> => {
  const whatsapp = await Whatsapp.findByPk(whatsappId);

  if (!whatsapp) {
    throw new AppError("ERR_NO_WAPP_FOUND", 404);
  }

  return whatsapp;
};

const getProviderByWhatsappId = async (
  whatsappId: number
): Promise<WhatsappProvider> => {
  const whatsapp = await getWhatsappById(whatsappId);
  return getProviderFromWhatsapp(whatsapp);
};

const init = async (whatsapp: Whatsapp): Promise<void> => {
  await getProviderFromWhatsapp(whatsapp).init(whatsapp);
};

const removeSession = (whatsappId: number): void => {
  Object.values(providersMap).forEach(provider => {
    try {
      provider.removeSession(whatsappId);
    } catch {
      // ignore providers that do not own this session
    }
  });
};

const logout = async (sessionId: number): Promise<void> => {
  const provider = await getProviderByWhatsappId(sessionId);
  await provider.logout(sessionId);
};

const sendMessage = async (
  sessionId: number,
  to: string,
  body: string,
  options?: SendMessageOptions
): Promise<ProviderMessage> => {
  const provider = await getProviderByWhatsappId(sessionId);
  return provider.sendMessage(sessionId, to, body, options);
};

const sendMedia = async (
  sessionId: number,
  to: string,
  media: ProviderMediaInput,
  options?: SendMediaOptions
): Promise<ProviderMessage> => {
  const provider = await getProviderByWhatsappId(sessionId);
  return provider.sendMedia(sessionId, to, media, options);
};

const deleteMessage = async (
  sessionId: number,
  chatId: string,
  messageId: string,
  fromMe: boolean
): Promise<void> => {
  const provider = await getProviderByWhatsappId(sessionId);
  await provider.deleteMessage(sessionId, chatId, messageId, fromMe);
};

const checkNumber = async (
  sessionId: number,
  number: string
): Promise<string> => {
  const provider = await getProviderByWhatsappId(sessionId);
  return provider.checkNumber(sessionId, number);
};

const getProfilePicUrl = async (
  sessionId: number,
  number: string
): Promise<string> => {
  const provider = await getProviderByWhatsappId(sessionId);
  return provider.getProfilePicUrl(sessionId, number);
};

const getContacts = async (sessionId: number): Promise<ProviderContact[]> => {
  const provider = await getProviderByWhatsappId(sessionId);
  return provider.getContacts(sessionId);
};

const sendSeen = async (sessionId: number, chatId: string): Promise<void> => {
  const provider = await getProviderByWhatsappId(sessionId);
  await provider.sendSeen(sessionId, chatId);
};

const fetchChatMessages = async (
  sessionId: number,
  chatId: string,
  limit: number
): Promise<ProviderMessage[]> => {
  const provider = await getProviderByWhatsappId(sessionId);
  return provider.fetchChatMessages(sessionId, chatId, limit);
};

const whatsappProvider: WhatsappProvider = {
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

export {
  whatsappProvider,
  getProviderFromWhatsapp,
  getProviderByWhatsappId,
  getProviderKeyFromWhatsapp
};
