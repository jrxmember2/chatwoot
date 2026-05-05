import * as Yup from "yup";
import { Op } from "sequelize";

import AppError from "../../errors/AppError";
import Whatsapp from "../../models/Whatsapp";
import ShowWhatsAppService from "./ShowWhatsAppService";
import AssociateWhatsappQueue from "./AssociateWhatsappQueue";

interface WhatsappData {
  name?: string;
  status?: string;
  session?: string;
  isDefault?: boolean;
  greetingMessage?: string;
  farewellMessage?: string;
  queueIds?: number[];
  provider?: string;
  evolutionInstanceName?: string | null;
  importOldMessages?: boolean;
  importOldMessagesDays?: number | null;
}

interface Request {
  whatsappData: WhatsappData;
  whatsappId: string;
}

interface Response {
  whatsapp: Whatsapp;
  oldDefaultWhatsapp: Whatsapp | null;
}

const UpdateWhatsAppService = async ({
  whatsappData,
  whatsappId
}: Request): Promise<Response> => {
  const schema = Yup.object().shape({
    name: Yup.string().min(2),
    status: Yup.string(),
    isDefault: Yup.boolean(),
    provider: Yup.string().oneOf(["wwebjs", "whaileys", "evolution"]),
    evolutionInstanceName: Yup.string().nullable().when("provider", {
      is: "evolution",
      then: Yup.string().trim().required("ERR_EVOLUTION_INSTANCE_REQUIRED"),
      otherwise: Yup.string().nullable()
    })
  });

  const {
    name,
    status,
    isDefault,
    session,
    greetingMessage,
    farewellMessage,
    queueIds = [],
    provider,
    evolutionInstanceName,
    importOldMessages,
    importOldMessagesDays
  } = whatsappData;

  try {
    await schema.validate({
      name,
      status,
      isDefault,
      provider,
      evolutionInstanceName
    });
  } catch (err) {
    throw new AppError(err.message);
  }

  if (queueIds.length > 1 && !greetingMessage) {
    throw new AppError("ERR_WAPP_GREETING_REQUIRED");
  }

  let oldDefaultWhatsapp: Whatsapp | null = null;

  if (isDefault) {
    oldDefaultWhatsapp = await Whatsapp.findOne({
      where: { isDefault: true, id: { [Op.not]: whatsappId } }
    });
    if (oldDefaultWhatsapp) {
      await oldDefaultWhatsapp.update({ isDefault: false });
    }
  }

  const whatsapp = await ShowWhatsAppService(whatsappId);
  const normalizedProvider = provider || whatsapp.provider || "wwebjs";
  const normalizedEvolutionInstanceName =
    normalizedProvider === "evolution"
      ? evolutionInstanceName?.trim() || whatsapp.evolutionInstanceName || null
      : null;
  let nextImportOldMessagesStatus = whatsapp.oldMessagesImportStatus;
  let nextImportOldMessagesError = whatsapp.oldMessagesImportError;
  let nextImportOldMessagesDays = whatsapp.importOldMessagesDays;
  let nextImportOldMessages = whatsapp.importOldMessages;

  if (importOldMessages !== undefined || normalizedProvider === "evolution") {
    if (normalizedProvider === "evolution") {
      nextImportOldMessages = false;
      nextImportOldMessagesDays = null;
      nextImportOldMessagesStatus = "idle";
      nextImportOldMessagesError = null;
    } else if (importOldMessages) {
      const normalizedDays = Number(importOldMessagesDays);

      if (
        !Number.isInteger(normalizedDays) ||
        normalizedDays < 1 ||
        normalizedDays > 90
      ) {
        throw new AppError("ERR_OLD_MESSAGES_IMPORT_INVALID_DAYS");
      }

      const shouldResetImportStatus =
        !whatsapp.importOldMessages ||
        whatsapp.importOldMessagesDays !== normalizedDays;

      nextImportOldMessages = true;
      nextImportOldMessagesDays = normalizedDays;

      if (whatsapp.oldMessagesImportStatus !== "running" && shouldResetImportStatus) {
        nextImportOldMessagesStatus = "pending";
        nextImportOldMessagesError = null;
      }
    } else {
      nextImportOldMessages = false;
      nextImportOldMessagesDays = null;
      nextImportOldMessagesStatus = "idle";
      nextImportOldMessagesError = null;
    }
  }

  await whatsapp.update({
    name,
    status,
    session,
    greetingMessage,
    farewellMessage,
    isDefault,
    provider: normalizedProvider,
    evolutionInstanceName: normalizedEvolutionInstanceName,
    importOldMessages: nextImportOldMessages,
    importOldMessagesDays: nextImportOldMessagesDays,
    oldMessagesImportStatus: nextImportOldMessagesStatus,
    oldMessagesImportError: nextImportOldMessagesError
  });

  await AssociateWhatsappQueue(whatsapp, queueIds);

  return { whatsapp, oldDefaultWhatsapp };
};

export default UpdateWhatsAppService;
