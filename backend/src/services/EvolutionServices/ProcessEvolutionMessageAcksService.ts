import { Op } from "sequelize";
import Contact from "../../models/Contact";
import Message from "../../models/Message";
import Ticket from "../../models/Ticket";
import Whatsapp from "../../models/Whatsapp";
import { handleMessageAck } from "../../handlers/handleWhatsappEvents";
import FindEvolutionMessageAckService from "./FindEvolutionMessageAckService";

const LOOKBACK_WINDOW_MS = 48 * 60 * 60 * 1000;
const MAX_MESSAGES_PER_RUN = 20;

const ProcessEvolutionMessageAcksService = async (): Promise<void> => {
  const recentMessages = await Message.findAll({
    where: {
      fromMe: true,
      ack: {
        [Op.lt]: 4
      },
      createdAt: {
        [Op.gte]: new Date(Date.now() - LOOKBACK_WINDOW_MS)
      }
    },
    include: [
      {
        model: Ticket,
        as: "ticket",
        required: true,
        include: [
          {
            model: Contact,
            as: "contact",
            attributes: ["id", "number"]
          },
          {
            model: Whatsapp,
            as: "whatsapp",
            required: true,
            where: {
              provider: "evolution",
              status: {
                [Op.in]: ["CONNECTED", "OPENING", "PAIRING", "TIMEOUT"]
              }
            },
            attributes: [
              "id",
              "provider",
              "evolutionInstanceName",
              "evolutionApiUrl",
              "evolutionApiKey",
              "status"
            ]
          }
        ]
      }
    ],
    order: [["updatedAt", "DESC"]],
    limit: MAX_MESSAGES_PER_RUN
  });

  /* eslint-disable no-await-in-loop */
  for (const message of recentMessages) {
    const nextAck = await FindEvolutionMessageAckService(message as any);

    if (nextAck === null || nextAck <= (message.ack || 0)) {
      continue;
    }

    await handleMessageAck(message.id, nextAck);
  }
};

export default ProcessEvolutionMessageAcksService;

