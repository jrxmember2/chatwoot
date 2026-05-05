import { Request, Response } from "express";
import AppError from "../errors/AppError";
import CreateCampaignService from "../services/CampaignServices/CreateCampaignService";
import ListCampaignsService from "../services/CampaignServices/ListCampaignsService";
import ShowCampaignService from "../services/CampaignServices/ShowCampaignService";
import CancelCampaignService from "../services/CampaignServices/CancelCampaignService";
import GetAvailableCampaignLimitService from "../services/CampaignServices/GetAvailableCampaignLimitService";

const ensureAdmin = (req: Request): void => {
  if (!req.user || req.user.profile !== "admin") {
    throw new AppError("ERR_NO_PERMISSION", 403);
  }
};

const parseContactIds = (rawValue: unknown): number[] => {
  if (Array.isArray(rawValue)) {
    return rawValue.map(value => Number(value)).filter(Boolean);
  }

  if (typeof rawValue === "string") {
    try {
      const parsed = JSON.parse(rawValue);
      if (Array.isArray(parsed)) {
        return parsed.map(value => Number(value)).filter(Boolean);
      }
    } catch (error) {
      return rawValue
        .split(",")
        .map(value => Number(value.trim()))
        .filter(Boolean);
    }
  }

  return [];
};

export const index = async (
  req: Request,
  res: Response
): Promise<Response> => {
  ensureAdmin(req);
  const campaigns = await ListCampaignsService();

  return res.status(200).json(campaigns);
};

export const show = async (
  req: Request,
  res: Response
): Promise<Response> => {
  ensureAdmin(req);
  const campaign = await ShowCampaignService(Number(req.params.campaignId));

  return res.status(200).json(campaign);
};

export const store = async (
  req: Request,
  res: Response
): Promise<Response> => {
  ensureAdmin(req);

  const campaign = await CreateCampaignService({
    name: req.body.name,
    whatsappId: Number(req.body.whatsappId),
    message: req.body.message,
    scheduledAt: req.body.scheduledAt ? new Date(req.body.scheduledAt) : null,
    createdBy: Number(req.user.id),
    contactIds: parseContactIds(req.body.contactIds),
    mediaFile: req.file || undefined
  });

  return res.status(201).json(campaign);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  ensureAdmin(req);
  const campaign = await CancelCampaignService(Number(req.params.campaignId));

  return res.status(200).json(campaign);
};

export const limits = async (
  req: Request,
  res: Response
): Promise<Response> => {
  ensureAdmin(req);
  const whatsappId = Number(req.query.whatsappId);
  const limit = await GetAvailableCampaignLimitService(whatsappId);

  return res.status(200).json(limit);
};
