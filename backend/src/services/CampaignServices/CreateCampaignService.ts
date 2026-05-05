import AppError from "../../errors/AppError";
import Campaign from "../../models/Campaign";
import CampaignContact from "../../models/CampaignContact";
import Contact from "../../models/Contact";
import GetAvailableCampaignLimitService from "./GetAvailableCampaignLimitService";

interface Request {
  name: string;
  whatsappId: number;
  message?: string;
  scheduledAt?: Date | null;
  createdBy: number;
  contactIds: number[];
  mediaFile?: Express.Multer.File;
}

const getRandomDelayMs = (): number => {
  const min = 30 * 1000;
  const max = 90 * 1000;

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const CreateCampaignService = async ({
  name,
  whatsappId,
  message,
  scheduledAt,
  createdBy,
  contactIds,
  mediaFile
}: Request): Promise<Campaign> => {
  const normalizedContactIds = Array.from(
    new Set(contactIds.map(id => Number(id)).filter(Boolean))
  );

  if (!name.trim()) {
    throw new AppError("ERR_CAMPAIGN_NAME_REQUIRED", 400);
  }

  if (!message?.trim() && !mediaFile) {
    throw new AppError("ERR_CAMPAIGN_EMPTY", 400);
  }

  if (normalizedContactIds.length === 0) {
    throw new AppError("ERR_CAMPAIGN_CONTACTS_REQUIRED", 400);
  }

  if (scheduledAt && scheduledAt.getTime() < Date.now()) {
    throw new AppError("ERR_CAMPAIGN_PAST_DATE", 400);
  }

  const { remaining } = await GetAvailableCampaignLimitService(whatsappId);

  if (normalizedContactIds.length > remaining) {
    throw new AppError("ERR_CAMPAIGN_LIMIT_EXCEEDED", 400);
  }

  const contacts = await Contact.findAll({
    where: {
      id: normalizedContactIds
    }
  });

  if (contacts.length !== normalizedContactIds.length) {
    throw new AppError("ERR_CAMPAIGN_INVALID_CONTACTS", 400);
  }

  const startAt = scheduledAt || new Date();

  const campaign = await Campaign.create({
    name: name.trim(),
    whatsappId,
    message: message?.trim() || null,
    mediaUrl: mediaFile ? `campaigns/${mediaFile.filename}` : null,
    mediaName: mediaFile ? mediaFile.originalname : null,
    mediaType: mediaFile ? mediaFile.mimetype : null,
    status: "scheduled",
    scheduledAt: startAt,
    createdBy
  });

  let nextAttemptAt = startAt.getTime();

  await CampaignContact.bulkCreate(
    normalizedContactIds.map(contactId => {
      const attemptAt = new Date(nextAttemptAt);
      nextAttemptAt += getRandomDelayMs();

      return {
        campaignId: campaign.id,
        contactId,
        status: "pending",
        nextAttemptAt: attemptAt
      };
    })
  );

  const fullCampaign = await Campaign.findByPk(campaign.id, {
    include: ["contacts", "whatsapp", "creator"]
  });

  if (!fullCampaign) {
    throw new AppError("ERR_CAMPAIGN_CREATE_FAILED", 500);
  }

  return fullCampaign;
};

export default CreateCampaignService;
