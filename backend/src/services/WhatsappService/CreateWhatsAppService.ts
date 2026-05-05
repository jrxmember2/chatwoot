import * as Yup from "yup";

import AppError from "../../errors/AppError";
import Whatsapp from "../../models/Whatsapp";
import AssociateWhatsappQueue from "./AssociateWhatsappQueue";

interface Request {
  name: string;
  queueIds?: number[];
  greetingMessage?: string;
  farewellMessage?: string;
  status?: string;
  isDefault?: boolean;
  provider?: string;
  evolutionInstanceName?: string | null;
  importOldMessages?: boolean;
  importOldMessagesDays?: number | null;
}

interface Response {
  whatsapp: Whatsapp;
  oldDefaultWhatsapp: Whatsapp | null;
}

const CreateWhatsAppService = async ({
  name,
  status = "OPENING",
  queueIds = [],
  greetingMessage,
  farewellMessage,
  isDefault = false,
  provider = process.env.WHATSAPP_PROVIDER || "wwebjs",
  evolutionInstanceName = null,
  importOldMessages = false,
  importOldMessagesDays = null
}: Request): Promise<Response> => {
  const schema = Yup.object().shape({
    name: Yup.string()
      .required()
      .min(2)
      .test(
        "Check-name",
        "This whatsapp name is already used.",
        async value => {
          if (!value) return false;
          const nameExists = await Whatsapp.findOne({
            where: { name: value }
          });
          return !nameExists;
        }
      ),
    isDefault: Yup.boolean().required(),
    provider: Yup.string()
      .oneOf(["wwebjs", "whaileys", "evolution"])
      .required(),
    evolutionInstanceName: Yup.string().nullable().when("provider", {
      is: "evolution",
      then: Yup.string().trim().required("ERR_EVOLUTION_INSTANCE_REQUIRED"),
      otherwise: Yup.string().nullable()
    }),
    importOldMessages: Yup.boolean().required(),
    importOldMessagesDays: Yup.number()
      .nullable()
      .when("importOldMessages", {
        is: true,
        then: Yup.number().required().integer().min(1).max(90),
        otherwise: Yup.number().nullable()
      })
  });

  try {
    await schema.validate({
      name,
      status,
      isDefault,
      provider,
      evolutionInstanceName,
      importOldMessages,
      importOldMessagesDays
    });
  } catch (err) {
    throw new AppError(err.message);
  }

  const whatsappFound = await Whatsapp.findOne();

  isDefault = !whatsappFound;

  let oldDefaultWhatsapp: Whatsapp | null = null;

  if (isDefault) {
    oldDefaultWhatsapp = await Whatsapp.findOne({
      where: { isDefault: true }
    });
    if (oldDefaultWhatsapp) {
      await oldDefaultWhatsapp.update({ isDefault: false });
    }
  }

  if (queueIds.length > 1 && !greetingMessage) {
    throw new AppError("ERR_WAPP_GREETING_REQUIRED");
  }

  const normalizedProvider = provider || "wwebjs";
  const normalizedEvolutionInstanceName =
    normalizedProvider === "evolution" ? evolutionInstanceName?.trim() || null : null;
  const shouldImportOldMessages =
    normalizedProvider === "evolution" ? false : importOldMessages;
  const normalizedStatus =
    normalizedProvider === "evolution" ? "DISCONNECTED" : status;

  const whatsapp = await Whatsapp.create(
    {
      name,
      status: normalizedStatus,
      greetingMessage,
      farewellMessage,
      isDefault,
      provider: normalizedProvider,
      evolutionInstanceName: normalizedEvolutionInstanceName,
      importOldMessages: shouldImportOldMessages,
      importOldMessagesDays: shouldImportOldMessages ? importOldMessagesDays : null,
      oldMessagesImportStatus: shouldImportOldMessages ? "pending" : "idle",
      oldMessagesImportError: null
    },
    { include: ["queues"] }
  );

  await AssociateWhatsappQueue(whatsapp, queueIds);

  return { whatsapp, oldDefaultWhatsapp };
};

export default CreateWhatsAppService;
