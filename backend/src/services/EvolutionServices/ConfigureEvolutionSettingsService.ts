import Whatsapp from "../../models/Whatsapp";
import { logger } from "../../utils/logger";
import EvolutionRequestService from "./EvolutionRequestService";
import GetEvolutionConnectionConfigService from "./GetEvolutionConnectionConfigService";

interface EvolutionSettingsResponse {
  reject_call?: boolean;
  groups_ignore?: boolean;
  always_online?: boolean;
  read_messages?: boolean;
  read_status?: boolean;
  sync_full_history?: boolean;
  msg_call?: string;
  rejectCall?: boolean;
  groupsIgnore?: boolean;
  alwaysOnline?: boolean;
  readMessages?: boolean;
  readStatus?: boolean;
  syncFullHistory?: boolean;
  msgCall?: string;
}

const readBooleanSetting = (
  settings: EvolutionSettingsResponse,
  snakeKey: keyof EvolutionSettingsResponse,
  camelKey: keyof EvolutionSettingsResponse,
  fallback: boolean
): boolean => {
  const snakeValue = settings[snakeKey];

  if (typeof snakeValue === "boolean") {
    return snakeValue;
  }

  const camelValue = settings[camelKey];

  if (typeof camelValue === "boolean") {
    return camelValue;
  }

  return fallback;
};

const readStringSetting = (
  settings: EvolutionSettingsResponse,
  snakeKey: keyof EvolutionSettingsResponse,
  camelKey: keyof EvolutionSettingsResponse
): string => {
  const snakeValue = settings[snakeKey];

  if (typeof snakeValue === "string") {
    return snakeValue;
  }

  const camelValue = settings[camelKey];

  if (typeof camelValue === "string") {
    return camelValue;
  }

  return "";
};

const ConfigureEvolutionSettingsService = async (
  whatsapp: Whatsapp
): Promise<void> => {
  const config = await GetEvolutionConnectionConfigService(whatsapp);
  const instanceName = encodeURIComponent(config.instanceName);

  try {
    const response = await EvolutionRequestService({
      whatsapp,
      method: "GET",
      path: `/settings/find/${instanceName}`,
      expectedStatusCodes: [200]
    });

    const currentSettings = (response.data || {}) as EvolutionSettingsResponse;
    const readStatusEnabled = readBooleanSetting(
      currentSettings,
      "read_status",
      "readStatus",
      false
    );

    if (readStatusEnabled) {
      return;
    }

    const nextSettings = {
      rejectCall: readBooleanSetting(
        currentSettings,
        "reject_call",
        "rejectCall",
        true
      ),
      msgCall: readStringSetting(currentSettings, "msg_call", "msgCall"),
      groupsIgnore: readBooleanSetting(
        currentSettings,
        "groups_ignore",
        "groupsIgnore",
        true
      ),
      alwaysOnline: readBooleanSetting(
        currentSettings,
        "always_online",
        "alwaysOnline",
        true
      ),
      readMessages: readBooleanSetting(
        currentSettings,
        "read_messages",
        "readMessages",
        true
      ),
      readStatus: true,
      syncFullHistory: readBooleanSetting(
        currentSettings,
        "sync_full_history",
        "syncFullHistory",
        false
      )
    };

    const attempts: Array<Record<string, unknown>> = [
      nextSettings,
      {
        reject_call: nextSettings.rejectCall,
        msg_call: nextSettings.msgCall,
        groups_ignore: nextSettings.groupsIgnore,
        always_online: nextSettings.alwaysOnline,
        read_messages: nextSettings.readMessages,
        read_status: nextSettings.readStatus,
        sync_full_history: nextSettings.syncFullHistory
      }
    ];

    let lastError: unknown;

    for (const body of attempts) {
      try {
        await EvolutionRequestService({
          whatsapp,
          method: "POST",
          path: `/settings/set/${instanceName}`,
          body,
          expectedStatusCodes: [200, 201]
        });
        return;
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError;
  } catch (error) {
    logger.warn(
      { err: error, whatsappId: whatsapp.id },
      "Nao foi possivel garantir as configuracoes de leitura/status da Evolution."
    );
  }
};

export default ConfigureEvolutionSettingsService;

