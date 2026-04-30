import { Request, Response } from "express";
import AppError from "../errors/AppError";
import {
  getOldMessagesImportStatus,
  startOldMessagesImportInBackground
} from "../services/WhatsappHistoryServices/ImportOldMessagesService";

const ensureAdmin = (req: Request): void => {
  if (req.user.profile !== "admin") {
    throw new AppError("ERR_NO_PERMISSION", 403);
  }
};

export const start = async (
  req: Request,
  res: Response
): Promise<Response> => {
  ensureAdmin(req);

  const whatsappId = Number(req.params.whatsappId);
  const days = Number(req.body.days);

  await startOldMessagesImportInBackground({
    whatsappId,
    days,
    userId: Number(req.user.id)
  });

  return res.status(202).json({
    message: "ERR_OLD_MESSAGES_IMPORT_STARTED"
  });
};

export const status = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const whatsappId = Number(req.params.whatsappId);
  const importStatus = await getOldMessagesImportStatus(whatsappId);

  return res.status(200).json(importStatus);
};
