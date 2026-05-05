import { logger } from "../../utils/logger";
import GetOrCreateIntegrationSettingService from "./GetOrCreateIntegrationSettingService";
import N8nService from "./N8nService";
import WebhookDispatchService from "./WebhookDispatchService";

interface Request {
  event: string;
  payload: Record<string, unknown>;
}

const EmitIntegrationEventService = ({ event, payload }: Request): void => {
  void (async () => {
    try {
      const settings = await GetOrCreateIntegrationSettingService();

      await Promise.all([
        N8nService({ event, payload, settings }).catch(() => undefined),
        WebhookDispatchService({ event, payload }).catch(() => undefined)
      ]);
    } catch (error) {
      logger.error(
        {
          err: error,
          event
        },
        "Erro ao emitir evento de integracao."
      );
    }
  })();
};

export default EmitIntegrationEventService;
