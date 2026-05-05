import fs from "fs";
import path from "path";
import { Op } from "sequelize";
import Campaign from "../../models/Campaign";
import CampaignContact from "../../models/CampaignContact";
import CampaignDailyLimit from "../../models/CampaignDailyLimit";
import Contact from "../../models/Contact";
import { logger } from "../../utils/logger";
import uploadConfig from "../../config/upload";
import FindOrCreateTicketService from "../TicketServices/FindOrCreateTicketService";
import GetAvailableCampaignLimitService from "./GetAvailableCampaignLimitService";
import SendWhatsAppMessage from "../WbotServices/SendWhatsAppMessage";
import SendWhatsAppMedia from "../WbotServices/SendWhatsAppMedia";
import EmitIntegrationEventService from "../IntegrationServices/EmitIntegrationEventService";

const updateCampaignDailyLimit = async (whatsappId: number): Promise<void> => {
  const date = new Date().toISOString().slice(0, 10);

  const [limit, created] = await CampaignDailyLimit.findOrCreate({
    where: {
      whatsappId,
      date
    },
    defaults: {
      whatsappId,
      date,
      sentCount: 0
    }
  });

  if (created) {
    await limit.reload();
  }

  await limit.update({
    sentCount: limit.sentCount + 1
  });
};

const buildStoredMedia = (campaign: Campaign): Express.Multer.File => {
  const relativePath = campaign.getDataValue("mediaUrl") as string;
  const absolutePath = path.resolve(uploadConfig.directory, relativePath);

  return {
    fieldname: "file",
    originalname: campaign.mediaName || path.basename(relativePath),
    encoding: "7bit",
    mimetype: campaign.mediaType || "application/octet-stream",
    destination: path.dirname(absolutePath),
    filename: path.basename(absolutePath),
    path: absolutePath,
    size: fs.existsSync(absolutePath) ? fs.statSync(absolutePath).size : 0,
    stream: undefined as any,
    buffer: undefined as any
  };
};

const finalizeCampaignStatus = async (campaign: Campaign): Promise<void> => {
  const contacts = await CampaignContact.findAll({
    where: {
      campaignId: campaign.id
    }
  });

  const pending = contacts.filter(contact => contact.status === "pending").length;
  const sent = contacts.filter(contact => contact.status === "sent").length;
  const failed = contacts.filter(contact => contact.status === "failed").length;

  if (pending > 0) {
    await campaign.update({
      status: "processing"
    });
    return;
  }

  if (sent > 0 && failed > 0) {
    await campaign.update({
      status: "partially_failed"
    });
    return;
  }

  if (sent > 0) {
    await campaign.update({
      status: "sent"
    });
    return;
  }

  if (failed > 0) {
    await campaign.update({
      status: "failed"
    });
  }
};

const processCampaignContact = async (
  campaign: Campaign,
  campaignContact: CampaignContact
): Promise<void> => {
  const contact = await Contact.findByPk(campaignContact.contactId);

  if (!contact) {
    await campaignContact.update({
      status: "failed",
      error: "ERR_NO_CONTACT_FOUND"
    });
    return;
  }

  await campaignContact.update({
    status: "processing"
  });

  try {
    const ticket = await FindOrCreateTicketService(contact, campaign.whatsappId, 0);

    if (campaign.getDataValue("mediaUrl")) {
      const media = buildStoredMedia(campaign);

      await SendWhatsAppMedia({
        media,
        ticket,
        body: campaign.message || undefined,
        removeAfterSend: false
      });
    } else {
      await SendWhatsAppMessage({
        body: campaign.message || "",
        ticket
      });
    }

    await campaignContact.update({
      status: "sent",
      sentAt: new Date(),
      error: null
    });

    await updateCampaignDailyLimit(campaign.whatsappId);

    EmitIntegrationEventService({
      event: "campaign_sent",
      payload: {
        campaignId: campaign.id,
        contactId: campaignContact.contactId,
        whatsappId: campaign.whatsappId
      }
    });
  } catch (error) {
    await campaignContact.update({
      status: "failed",
      error: error instanceof Error ? error.message : "ERR_CAMPAIGN_SEND_FAILED"
    });
  }
};

const ProcessCampaignsService = async (): Promise<void> => {
  const campaigns = await Campaign.findAll({
    where: {
      status: {
        [Op.in]: ["scheduled", "processing"]
      },
      scheduledAt: {
        [Op.lte]: new Date()
      }
    },
    order: [["scheduledAt", "ASC"]],
    limit: 10
  });

  /* eslint-disable no-await-in-loop */
  for (const campaign of campaigns) {
    const { remaining } = await GetAvailableCampaignLimitService(
      campaign.whatsappId
    );

    if (remaining <= 0) {
      continue;
    }

    await campaign.update({
      status: "processing"
    });

    const dueContacts = await CampaignContact.findAll({
      where: {
        campaignId: campaign.id,
        status: "pending",
        nextAttemptAt: {
          [Op.lte]: new Date()
        }
      },
      order: [["nextAttemptAt", "ASC"]],
      limit: remaining
    });

    for (const campaignContact of dueContacts) {
      await processCampaignContact(campaign, campaignContact);
    }

    await finalizeCampaignStatus(campaign);
  }
};

export default ProcessCampaignsService;
