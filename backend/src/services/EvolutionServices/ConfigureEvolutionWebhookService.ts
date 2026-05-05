import AppError from "../../errors/AppError";
import Whatsapp from "../../models/Whatsapp";
import EnsureEvolutionWebhookTokenService from "./EnsureEvolutionWebhookTokenService";
import EvolutionRequestService from "./EvolutionRequestService";
import GetEvolutionConnectionConfigService from "./GetEvolutionConnectionConfigService";

const ConfigureEvolutionWebhookService = async (
  whatsapp: Whatsapp
): Promise<void> => {
  const backendUrl = (process.env.BACKEND_URL || "").trim().replace(/\/$/, "");

  if (!backendUrl) {
    throw new AppError("ERR_EVOLUTION_BACKEND_URL_NOT_CONFIGURED", 500);
  }

  const token = await EnsureEvolutionWebhookTokenService(whatsapp);
  const webhookUrl = `${backendUrl}/evolution/webhook/${whatsapp.id}/${token}`;
  const config = await GetEvolutionConnectionConfigService(whatsapp);

  await EvolutionRequestService({
    whatsapp,
    method: "POST",
    path: `/webhook/set/${encodeURIComponent(config.instanceName)}`,
    body: {
      enabled: true,
      url: webhookUrl,
      webhook_by_events: true,
      webhook_base64: false,
      events: ["MESSAGES_UPSERT", "CONNECTION_UPDATE"]
    }
  });
};

export default ConfigureEvolutionWebhookService;
