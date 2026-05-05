import AppError from "../../errors/AppError";
import Whatsapp from "../../models/Whatsapp";
import EnsureEvolutionWebhookTokenService from "./EnsureEvolutionWebhookTokenService";
import EvolutionRequestService from "./EvolutionRequestService";
import GetEvolutionConnectionConfigService from "./GetEvolutionConnectionConfigService";

const WEBHOOK_EVENTS = ["MESSAGES_UPSERT", "CONNECTION_UPDATE"];

const ConfigureEvolutionWebhookService = async (
  whatsapp: Whatsapp
): Promise<void> => {
  const backendUrl = (process.env.BACKEND_URL || "").trim().replace(/\/$/, "");

  if (!backendUrl) {
    throw new AppError("ERR_EVOLUTION_BACKEND_URL_NOT_CONFIGURED", 500);
  }

  const token = await EnsureEvolutionWebhookTokenService(whatsapp);
  // Evolution appends the event name when "by events" is enabled.
  const webhookUrl = `${backendUrl}/evolution/webhook/${whatsapp.id}/${token}/`;
  const config = await GetEvolutionConnectionConfigService(whatsapp);
  const path = `/webhook/set/${encodeURIComponent(config.instanceName)}`;

  const attempts: Array<Record<string, unknown>> = [
    {
      enabled: true,
      url: webhookUrl,
      webhook_by_events: true,
      webhook_base64: false,
      events: WEBHOOK_EVENTS
    },
    {
      enabled: true,
      url: webhookUrl,
      webhookByEvents: true,
      webhookBase64: false,
      events: WEBHOOK_EVENTS
    },
    {
      webhook: {
        enabled: true,
        url: webhookUrl,
        byEvents: true,
        base64: false,
        events: WEBHOOK_EVENTS
      }
    },
    {
      webhook: {
        enabled: true,
        url: webhookUrl,
        webhookByEvents: true,
        webhookBase64: false,
        events: WEBHOOK_EVENTS
      }
    }
  ];

  let lastError: unknown;

  for (const body of attempts) {
    try {
      await EvolutionRequestService({
        whatsapp,
        method: "POST",
        path,
        body
      });
      return;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
};

export default ConfigureEvolutionWebhookService;
