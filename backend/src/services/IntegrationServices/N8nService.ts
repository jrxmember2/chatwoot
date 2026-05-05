import IntegrationSetting from "../../models/IntegrationSetting";
import { logger } from "../../utils/logger";
import HttpRequestService from "./HttpRequestService";

interface Request {
  event: string;
  payload: Record<string, unknown>;
  settings: IntegrationSetting;
}

const buildWebhookUrl = (
  settings: IntegrationSetting,
  event: string
): string | null => {
  if (settings.n8nWebhookUrl) {
    return settings.n8nWebhookUrl;
  }

  if (!settings.n8nBaseUrl) {
    return null;
  }

  return `${settings.n8nBaseUrl.replace(/\/$/, "")}/webhook/${event}`;
};

const N8nService = async ({
  event,
  payload,
  settings
}: Request): Promise<void> => {
  if (!settings.n8nActive) {
    return;
  }

  const webhookUrl = buildWebhookUrl(settings, event);

  if (!webhookUrl) {
    return;
  }

  try {
    await HttpRequestService({
      url: webhookUrl,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(settings.n8nSecret
          ? {
              "X-Webhook-Secret": settings.n8nSecret
            }
          : {})
      },
      body: JSON.stringify({
        event,
        payload,
        sentAt: new Date().toISOString()
      })
    });
  } catch (error) {
    logger.error(
      {
        err: error,
        event
      },
      "Erro ao enviar evento para o n8n."
    );
  }
};

export default N8nService;
