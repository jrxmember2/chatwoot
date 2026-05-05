import { Request, Response } from "express";
import AppError from "../errors/AppError";
import GetOrCreateIntegrationSettingService from "../services/IntegrationServices/GetOrCreateIntegrationSettingService";

const ensureAdmin = (req: Request): void => {
  if (!req.user || req.user.profile !== "admin") {
    throw new AppError("ERR_NO_PERMISSION", 403);
  }
};

const ensureValidOptionalUrl = (value?: string): void => {
  if (!value) {
    return;
  }

  try {
    const parsedUrl = new URL(value);

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error("Invalid protocol");
    }
  } catch (error) {
    throw new AppError("ERR_INTEGRATION_INVALID_URL", 400);
  }
};

const serializeSetting = (setting: any) => ({
  id: setting.id,
  n8nActive: setting.n8nActive,
  n8nBaseUrl: setting.n8nBaseUrl,
  n8nWebhookUrl: setting.n8nWebhookUrl,
  n8nHasSecret: Boolean(setting.n8nSecret),
  chatgptActive: setting.chatgptActive,
  chatgptHasApiKey: Boolean(setting.chatgptApiKey),
  chatgptModel: setting.chatgptModel,
  chatgptBasePrompt: setting.chatgptBasePrompt,
  chatgptTemperature: setting.chatgptTemperature,
  chatgptMaxTokens: setting.chatgptMaxTokens,
  chatgptQueueIds: setting.chatgptQueueIds
    ? JSON.parse(setting.chatgptQueueIds)
    : [],
  evolutionActive: setting.evolutionActive,
  evolutionBaseUrl: setting.evolutionBaseUrl,
  evolutionDefaultInstance: setting.evolutionDefaultInstance,
  evolutionUseAsDefault: setting.evolutionUseAsDefault,
  evolutionHasApiKey: Boolean(setting.evolutionApiKey)
});

export const show = async (
  req: Request,
  res: Response
): Promise<Response> => {
  ensureAdmin(req);
  const setting = await GetOrCreateIntegrationSettingService();

  return res.status(200).json(serializeSetting(setting));
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  ensureAdmin(req);
  const setting = await GetOrCreateIntegrationSettingService();

  ensureValidOptionalUrl(req.body.n8nBaseUrl);
  ensureValidOptionalUrl(req.body.n8nWebhookUrl);
  ensureValidOptionalUrl(req.body.evolutionBaseUrl);

  const payload: Record<string, unknown> = {
    n8nActive: Boolean(req.body.n8nActive),
    n8nBaseUrl: req.body.n8nBaseUrl || null,
    n8nWebhookUrl: req.body.n8nWebhookUrl || null,
    chatgptActive: Boolean(req.body.chatgptActive),
    chatgptModel: req.body.chatgptModel || setting.chatgptModel,
    chatgptBasePrompt: req.body.chatgptBasePrompt || null,
    chatgptTemperature:
      req.body.chatgptTemperature !== undefined
        ? Number(req.body.chatgptTemperature)
        : setting.chatgptTemperature,
    chatgptMaxTokens:
      req.body.chatgptMaxTokens !== undefined
        ? Number(req.body.chatgptMaxTokens)
        : setting.chatgptMaxTokens,
    chatgptQueueIds: Array.isArray(req.body.chatgptQueueIds)
      ? JSON.stringify(req.body.chatgptQueueIds.map((id: any) => Number(id)))
      : setting.chatgptQueueIds,
    evolutionActive: Boolean(req.body.evolutionActive),
    evolutionBaseUrl: req.body.evolutionBaseUrl || null,
    evolutionDefaultInstance: req.body.evolutionDefaultInstance || null,
    evolutionUseAsDefault: Boolean(req.body.evolutionUseAsDefault)
  };

  if (typeof req.body.n8nSecret === "string" && req.body.n8nSecret.trim()) {
    payload.n8nSecret = req.body.n8nSecret.trim();
  }

  if (
    typeof req.body.chatgptApiKey === "string" &&
    req.body.chatgptApiKey.trim()
  ) {
    payload.chatgptApiKey = req.body.chatgptApiKey.trim();
  }

  if (
    typeof req.body.evolutionApiKey === "string" &&
    req.body.evolutionApiKey.trim()
  ) {
    payload.evolutionApiKey = req.body.evolutionApiKey.trim();
  }

  if (
    Number.isNaN(payload.chatgptTemperature) ||
    Number(payload.chatgptTemperature) < 0 ||
    Number(payload.chatgptTemperature) > 2
  ) {
    throw new AppError("ERR_CHATGPT_INVALID_TEMPERATURE", 400);
  }

  if (
    Number.isNaN(payload.chatgptMaxTokens) ||
    Number(payload.chatgptMaxTokens) < 100 ||
    Number(payload.chatgptMaxTokens) > 4000
  ) {
    throw new AppError("ERR_CHATGPT_INVALID_MAX_TOKENS", 400);
  }

  await setting.update(payload);

  return res.status(200).json(serializeSetting(setting));
};
