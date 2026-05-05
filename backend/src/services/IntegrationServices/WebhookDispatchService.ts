import AppError from "../../errors/AppError";
import Webhook from "../../models/Webhook";
import WebhookLog from "../../models/WebhookLog";
import { logger } from "../../utils/logger";
import HttpRequestService from "./HttpRequestService";

interface DispatchRequest {
  event: string;
  payload: Record<string, unknown>;
}

const parseWebhookEvents = (events: string): string[] => {
  try {
    const parsed = JSON.parse(events);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const ensureValidWebhookUrl = (url: string): void => {
  try {
    const parsed = new URL(url);

    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error("Invalid protocol");
    }
  } catch (error) {
    throw new AppError("ERR_WEBHOOK_INVALID_URL", 400);
  }
};

const dispatchSingleWebhook = async (
  webhook: Webhook,
  event: string,
  payload: Record<string, unknown>
): Promise<void> => {
  const requestPayload = JSON.stringify({
    event,
    payload,
    sentAt: new Date().toISOString()
  });

  try {
    const response = await HttpRequestService({
      url: webhook.url,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Event": event,
        ...(webhook.secret
          ? {
              "X-Webhook-Secret": webhook.secret
            }
          : {})
      },
      body: requestPayload
    });

    await webhook.update({
      lastStatus: response.statusCode,
      lastError: response.statusCode >= 400 ? response.body : null,
      lastSentAt: new Date()
    });

    await WebhookLog.create({
      webhookId: webhook.id,
      event,
      payload: requestPayload,
      statusCode: response.statusCode,
      responseBody: response.body,
      error: response.statusCode >= 400 ? response.body : null
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Webhook dispatch failed";

    await webhook.update({
      lastStatus: 0,
      lastError: errorMessage,
      lastSentAt: new Date()
    });

    await WebhookLog.create({
      webhookId: webhook.id,
      event,
      payload: requestPayload,
      statusCode: 0,
      responseBody: null,
      error: errorMessage
    });

    logger.error(
      {
        err: error,
        webhookId: webhook.id,
        event
      },
      "Erro ao disparar webhook."
    );
  }
};

const WebhookDispatchService = async ({
  event,
  payload
}: DispatchRequest): Promise<void> => {
  const webhooks = await Webhook.findAll({
    where: {
      isActive: true
    }
  });

  const matchingWebhooks = webhooks.filter(webhook => {
    const events = parseWebhookEvents(webhook.events);
    return events.includes("*") || events.includes(event);
  });

  await Promise.all(
    matchingWebhooks.map(webhook =>
      dispatchSingleWebhook(webhook, event, payload).catch(() => undefined)
    )
  );
};

export const dispatchTestWebhook = async (
  webhook: Webhook
): Promise<void> => {
  await dispatchSingleWebhook(webhook, "webhook_test", {
    ok: true,
    source: "whaticket"
  });
};

export default WebhookDispatchService;
