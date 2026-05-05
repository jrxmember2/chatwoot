import AppError from "../../errors/AppError";
import Whatsapp from "../../models/Whatsapp";
import GetOrCreateIntegrationSettingService from "../IntegrationServices/GetOrCreateIntegrationSettingService";

export interface EvolutionConnectionConfig {
  baseUrl: string;
  apiKey: string;
  instanceName: string;
}

const normalizeOptionalValue = (value?: string | null): string => {
  return typeof value === "string" ? value.trim() : "";
};

const GetEvolutionConnectionConfigService = async (
  whatsapp: Whatsapp
): Promise<EvolutionConnectionConfig> => {
  const settings = await GetOrCreateIntegrationSettingService();

  const baseUrl = normalizeOptionalValue(
    whatsapp.evolutionApiUrl || settings.evolutionBaseUrl
  ).replace(/\/$/, "");
  const apiKey = normalizeOptionalValue(
    whatsapp.evolutionApiKey || settings.evolutionApiKey
  );
  const instanceName = normalizeOptionalValue(
    whatsapp.evolutionInstanceName || settings.evolutionDefaultInstance
  );

  if (!baseUrl || !apiKey || !instanceName) {
    throw new AppError("ERR_EVOLUTION_NOT_CONFIGURED", 400);
  }

  return {
    baseUrl,
    apiKey,
    instanceName
  };
};

export default GetEvolutionConnectionConfigService;
