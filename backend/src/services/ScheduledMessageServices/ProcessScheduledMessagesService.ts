import fs from "fs";
import path from "path";
import { Op } from "sequelize";
import uploadConfig from "../../config/upload";
import Contact from "../../models/Contact";
import ScheduledMessage from "../../models/ScheduledMessage";
import Ticket from "../../models/Ticket";
import User from "../../models/User";
import Whatsapp from "../../models/Whatsapp";
import { logger } from "../../utils/logger";
import SendWhatsAppMedia from "../WbotServices/SendWhatsAppMedia";
import SendWhatsAppMessage from "../WbotServices/SendWhatsAppMessage";

const BATCH_SIZE = 10;

const buildScheduledBody = (
  scheduledMessage: ScheduledMessage
): string | undefined => {
  const trimmedBody = scheduledMessage.body?.trim();

  if (!trimmedBody) {
    return undefined;
  }

  if (!scheduledMessage.signMessage) {
    return trimmedBody;
  }

  const userName = scheduledMessage.user?.name || "Usuario";

  return `*${userName}:*\n${trimmedBody}`;
};

const ProcessScheduledMessagesService = async (): Promise<void> => {
  const scheduledMessages = await ScheduledMessage.findAll({
    where: {
      status: "pending",
      scheduledAt: {
        [Op.lte]: new Date()
      }
    },
    include: [
      {
        model: Contact,
        as: "contact",
        attributes: ["id", "name", "number", "profilePicUrl"]
      },
      {
        model: Ticket,
        as: "ticket",
        include: [
          {
            model: Contact,
            as: "contact",
            attributes: ["id", "name", "number", "profilePicUrl"]
          },
          {
            model: Whatsapp,
            as: "whatsapp",
            attributes: ["id", "name"]
          }
        ]
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "name"]
      }
    ],
    order: [["scheduledAt", "ASC"], ["id", "ASC"]],
    limit: BATCH_SIZE
  });

  for (const scheduledMessage of scheduledMessages) {
    const [updatedRows] = await ScheduledMessage.update(
      {
        status: "processing",
        error: null
      },
      {
        where: {
          id: scheduledMessage.id,
          status: "pending"
        }
      }
    );

    if (!updatedRows) {
      continue;
    }

    try {
      if (!scheduledMessage.ticket || !scheduledMessage.contact) {
        throw new Error("Scheduled ticket not found.");
      }

      scheduledMessage.ticket.contact = scheduledMessage.contact;
      scheduledMessage.ticket.contactId = scheduledMessage.contactId;
      scheduledMessage.ticket.whatsappId = scheduledMessage.whatsappId;

      const body = buildScheduledBody(scheduledMessage);
      const storedMediaUrl = scheduledMessage.getDataValue("mediaUrl") as
        | string
        | null;

      if (storedMediaUrl) {
        const mediaPath = path.resolve(uploadConfig.directory, storedMediaUrl);

        if (!fs.existsSync(mediaPath)) {
          throw new Error("Scheduled media file not found.");
        }

        const media = {
          filename: path.basename(storedMediaUrl),
          originalname:
            scheduledMessage.mediaName || path.basename(storedMediaUrl),
          mimetype:
            scheduledMessage.mediaType || "application/octet-stream",
          path: mediaPath
        } as Express.Multer.File;

        await SendWhatsAppMedia({
          media,
          ticket: scheduledMessage.ticket,
          body,
          removeAfterSend: false
        });
      } else if (body) {
        await SendWhatsAppMessage({
          body,
          ticket: scheduledMessage.ticket
        });
      } else {
        throw new Error("Scheduled message has no body or media.");
      }

      await scheduledMessage.update({
        status: "sent",
        sentAt: new Date(),
        error: null
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown scheduled message error";

      logger.error({
        info: "Error processing scheduled message",
        scheduledMessageId: scheduledMessage.id,
        err
      });

      await scheduledMessage.update({
        status: "failed",
        error: errorMessage
      });
    }
  }
};

export default ProcessScheduledMessagesService;
