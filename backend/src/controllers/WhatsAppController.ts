import { Request, Response } from "express";
import { getIO } from "../libs/socket";
import { StartWhatsAppSession } from "../services/WbotServices/StartWhatsAppSession";

import CreateWhatsAppService from "../services/WhatsappService/CreateWhatsAppService";
import DeleteWhatsAppService from "../services/WhatsappService/DeleteWhatsAppService";
import ListWhatsAppsService from "../services/WhatsappService/ListWhatsAppsService";
import ShowWhatsAppService from "../services/WhatsappService/ShowWhatsAppService";
import UpdateWhatsAppService from "../services/WhatsappService/UpdateWhatsAppService";
import { whatsappProvider } from "../providers/WhatsApp";
import { maybeStartConfiguredOldMessagesImportInBackground } from "../services/WhatsappHistoryServices/ImportOldMessagesService";

interface WhatsappData {
  name: string;
  queueIds: number[];
  greetingMessage?: string;
  farewellMessage?: string;
  status?: string;
  isDefault?: boolean;
  provider?: string;
  evolutionInstanceName?: string | null;
  importOldMessages?: boolean;
  importOldMessagesDays?: number | null;
}

export const index = async (req: Request, res: Response): Promise<Response> => {
  const whatsapps = await ListWhatsAppsService();

  return res.status(200).json(whatsapps);
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const {
    name,
    status,
    isDefault,
    greetingMessage,
    farewellMessage,
    queueIds,
    provider,
    evolutionInstanceName,
    importOldMessages,
    importOldMessagesDays
  }: WhatsappData = req.body;

  const { whatsapp, oldDefaultWhatsapp } = await CreateWhatsAppService({
    name,
    status,
    isDefault,
    greetingMessage,
    farewellMessage,
    queueIds,
    provider,
    evolutionInstanceName,
    importOldMessages,
    importOldMessagesDays
  });

  StartWhatsAppSession(whatsapp);

  const io = getIO();
  io.emit("whatsapp", {
    action: "update",
    whatsapp
  });

  if (oldDefaultWhatsapp) {
    io.emit("whatsapp", {
      action: "update",
      whatsapp: oldDefaultWhatsapp
    });
  }

  return res.status(200).json(whatsapp);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { whatsappId } = req.params;

  const whatsapp = await ShowWhatsAppService(whatsappId);

  return res.status(200).json(whatsapp);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { whatsappId } = req.params;
  const whatsappData = req.body;
  const previousWhatsApp = await ShowWhatsAppService(whatsappId);

  const { whatsapp, oldDefaultWhatsapp } = await UpdateWhatsAppService({
    whatsappData,
    whatsappId
  });

  const shouldRestartProviderSession =
    previousWhatsApp.provider !== whatsapp.provider ||
    (whatsapp.provider === "evolution" &&
      previousWhatsApp.evolutionInstanceName !== whatsapp.evolutionInstanceName);

  if (shouldRestartProviderSession) {
    whatsappProvider.removeSession(whatsapp.id);
    StartWhatsAppSession(whatsapp);
  } else if (whatsapp.provider === "evolution") {
    StartWhatsAppSession(whatsapp);
  }

  if (
    whatsapp.status === "CONNECTED" &&
    whatsapp.importOldMessages &&
    whatsapp.oldMessagesImportStatus === "pending"
  ) {
    await maybeStartConfiguredOldMessagesImportInBackground(whatsapp.id);
  }

  const io = getIO();
  io.emit("whatsapp", {
    action: "update",
    whatsapp
  });

  if (oldDefaultWhatsapp) {
    io.emit("whatsapp", {
      action: "update",
      whatsapp: oldDefaultWhatsapp
    });
  }

  return res.status(200).json(whatsapp);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { whatsappId } = req.params;

  await DeleteWhatsAppService(whatsappId);
  whatsappProvider.removeSession(+whatsappId);

  const io = getIO();
  io.emit("whatsapp", {
    action: "delete",
    whatsappId: +whatsappId
  });

  return res.status(200).json({ message: "Whatsapp deleted." });
};
