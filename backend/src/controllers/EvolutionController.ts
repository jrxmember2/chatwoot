import { Request, Response } from "express";
import AppError from "../errors/AppError";
import GetOrCreateIntegrationSettingService from "../services/IntegrationServices/GetOrCreateIntegrationSettingService";
import TestEvolutionConnectionService from "../services/IntegrationServices/TestEvolutionConnectionService";

const ensureAdmin = (req: Request): void => {
  if (!req.user || req.user.profile !== "admin") {
    throw new AppError("ERR_NO_PERMISSION", 403);
  }
};

export const test = async (
  req: Request,
  res: Response
): Promise<Response> => {
  ensureAdmin(req);

  const settings = await GetOrCreateIntegrationSettingService();
  const baseUrl = req.body.baseUrl || settings.evolutionBaseUrl;
  const apiKey = req.body.apiKey || settings.evolutionApiKey;

  if (!baseUrl) {
    throw new AppError("ERR_EVOLUTION_INVALID_URL", 400);
  }

  const result = await TestEvolutionConnectionService({
    baseUrl,
    apiKey
  });

  return res.status(200).json(result);
};
