import { Request, Response } from "express";
import AppError from "../errors/AppError";
import Whatsapp from "../models/Whatsapp";
import ShowWhatsAppService from "../services/WhatsappService/ShowWhatsAppService";
import HandleEvolutionMessagesWebhookService from "../services/EvolutionServices/HandleEvolutionMessagesWebhookService";
import SyncEvolutionStatusService, {
  applyEvolutionStateToWhatsapp
} from "../services/EvolutionServices/SyncEvolutionStatusService";
import { getIO } from "../libs/socket";
import EmitIntegrationEventService from "../services/IntegrationServices/EmitIntegrationEventService";

const loadWebhookWhatsapp = async (
  whatsappId: string,
  token: string
): Promise<Whatsapp> => {
  const whatsapp = await ShowWhatsAppService(whatsappId);

  if (
    whatsapp.provider !== "evolution" ||
    !whatsapp.evolutionWebhookToken ||
    whatsapp.evolutionWebhookToken !== token
  ) {
    throw new AppError("ERR_EVOLUTION_WEBHOOK_UNAUTHORIZED", 403);
  }

  return whatsapp;
};

const emitSessionUpdate = (whatsapp: Whatsapp): void => {
  const io = getIO();

  io.emit("whatsappSession", {
    action: "update",
    session: whatsapp
  });
};

const emitIntegrationStatusIfNeeded = (
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

const extractState = (payload: any): string | null => {
  return (
    payload?.instance?.state ||
    payload?.data?.instance?.state ||
    payload?.data?.state ||
    payload?.state ||
    payload?.status ||
    null
  );
};

const isMessagePayload = (payload: any): boolean => {
  return Boolean(
    payload?.key ||
      payload?.data?.key ||
      payload?.messages ||
      payload?.data?.messages ||
      (Array.isArray(payload?.data) && payload.data.some((item: any) => item?.key)) ||
      (Array.isArray(payload) && payload.some((item: any) => item?.key))
  );
};

const detectWebhookType = (
  payload: any
): "messages" | "connection" | null => {
  const normalizedEvent = (
    payload?.event ||
    payload?.type ||
    payload?.data?.event ||
    payload?.data?.type ||
    payload?.eventType ||
    ""
  )
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[.\-\s]+/g, "_");

  if (normalizedEvent.includes("message")) {
    return "messages";
  }

  if (normalizedEvent.includes("connection")) {
    return "connection";
  }

  if (isMessagePayload(payload)) {
    return "messages";
  }

  if (extractState(payload)) {
    return "connection";
  }

  return null;
};

const processMessagesUpsert = async (
  whatsapp: Whatsapp,
  payload: any
): Promise<{ received: true; processedCount: number }> => {
  const processedCount = await HandleEvolutionMessagesWebhookService({
    whatsappId: whatsapp.id,
    payload
  });

  return {
    received: true,
    processedCount
  };
};

const processConnectionUpdate = async (
  whatsapp: Whatsapp,
  payload: any
): Promise<{ received: true; status: string }> => {
  const previousStatus = whatsapp.status;
  const state = extractState(payload);

  const updatedWhatsapp = state
    ? await applyEvolutionStateToWhatsapp(whatsapp, state)
    : await SyncEvolutionStatusService(whatsapp.id);

  emitSessionUpdate(updatedWhatsapp);
  emitIntegrationStatusIfNeeded(previousStatus, updatedWhatsapp);

  return {
    received: true,
    status: updatedWhatsapp.status
  };
};

export const receive = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { whatsappId, token } = req.params;
  const whatsapp = await loadWebhookWhatsapp(whatsappId, token);
  const webhookType = detectWebhookType(req.body);

  if (webhookType === "messages") {
    const result = await processMessagesUpsert(whatsapp, req.body);
    return res.status(200).json(result);
  }

  if (webhookType === "connection") {
    const result = await processConnectionUpdate(whatsapp, req.body);
    return res.status(200).json(result);
  }

  return res.status(202).json({
    received: true,
    ignored: true
  });
};

export const messagesUpsert = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { whatsappId, token } = req.params;
  const whatsapp = await loadWebhookWhatsapp(whatsappId, token);
  const result = await processMessagesUpsert(whatsapp, req.body);
  return res.status(200).json(result);
};

export const connectionUpdate = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { whatsappId, token } = req.params;
  const whatsapp = await loadWebhookWhatsapp(whatsappId, token);
  const result = await processConnectionUpdate(whatsapp, req.body);
  return res.status(200).json(result);
};
