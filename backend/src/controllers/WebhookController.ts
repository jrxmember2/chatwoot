import { Request, Response } from "express";
import AppError from "../errors/AppError";
import Webhook from "../models/Webhook";
import WebhookLog from "../models/WebhookLog";
import {
  dispatchTestWebhook,
  ensureValidWebhookUrl
} from "../services/IntegrationServices/WebhookDispatchService";

const ensureAdmin = (req: Request): void => {
  if (!req.user || req.user.profile !== "admin") {
    throw new AppError("ERR_NO_PERMISSION", 403);
  }
};

export const index = async (
  req: Request,
  res: Response
): Promise<Response> => {
  ensureAdmin(req);

  const webhooks = await Webhook.findAll({
    order: [["createdAt", "DESC"]]
  });

  return res.status(200).json(webhooks);
};

export const store = async (
  req: Request,
  res: Response
): Promise<Response> => {
  ensureAdmin(req);

  const { name, url, secret, events = [], isActive = true } = req.body;

  if (!name || !url || !Array.isArray(events) || events.length === 0) {
    throw new AppError("ERR_WEBHOOK_INVALID_PAYLOAD", 400);
  }

  ensureValidWebhookUrl(url);

  const webhook = await Webhook.create({
    name,
    url,
    secret: secret || null,
    events: JSON.stringify(events),
    isActive: Boolean(isActive)
  });

  return res.status(201).json(webhook);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  ensureAdmin(req);

  const { webhookId } = req.params;
  const webhook = await Webhook.findByPk(webhookId);

  if (!webhook) {
    throw new AppError("ERR_NO_WEBHOOK_FOUND", 404);
  }

  const { name, url, secret, events, isActive } = req.body;

  if (url) {
    ensureValidWebhookUrl(url);
  }

  await webhook.update({
    name: name !== undefined ? name : webhook.name,
    url: url !== undefined ? url : webhook.url,
    secret: secret !== undefined ? secret || null : webhook.secret,
    events: Array.isArray(events) ? JSON.stringify(events) : webhook.events,
    isActive: isActive !== undefined ? Boolean(isActive) : webhook.isActive
  });

  return res.status(200).json(webhook);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  ensureAdmin(req);

  const { webhookId } = req.params;
  const webhook = await Webhook.findByPk(webhookId);

  if (!webhook) {
    throw new AppError("ERR_NO_WEBHOOK_FOUND", 404);
  }

  await webhook.destroy();

  return res.status(200).json({ message: "Webhook deleted" });
};

export const test = async (
  req: Request,
  res: Response
): Promise<Response> => {
  ensureAdmin(req);

  const { webhookId } = req.params;
  const webhook = await Webhook.findByPk(webhookId);

  if (!webhook) {
    throw new AppError("ERR_NO_WEBHOOK_FOUND", 404);
  }

  await dispatchTestWebhook(webhook);

  return res.status(200).json({ message: "webhook_test_sent" });
};

export const logs = async (
  req: Request,
  res: Response
): Promise<Response> => {
  ensureAdmin(req);

  const { webhookId } = req.params;
  const logs = await WebhookLog.findAll({
    where: { webhookId },
    order: [["createdAt", "DESC"]],
    limit: 50
  });

  return res.status(200).json(logs);
};
