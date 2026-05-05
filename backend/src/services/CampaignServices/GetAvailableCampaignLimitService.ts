import { subHours } from "date-fns";
import { Op } from "sequelize";
import Campaign from "../../models/Campaign";
import CampaignContact from "../../models/CampaignContact";

export const CAMPAIGN_LIMIT_PER_24H = 50;

const GetAvailableCampaignLimitService = async (
  whatsappId: number
): Promise<{
  used: number;
  remaining: number;
}> => {
  const used = await CampaignContact.count({
    where: {
      status: "sent",
      sentAt: {
        [Op.gte]: subHours(new Date(), 24)
      }
    },
    include: [
      {
        model: Campaign,
        as: "campaign",
        where: {
          whatsappId
        },
        attributes: []
      }
    ]
  });

  return {
    used,
    remaining: Math.max(0, CAMPAIGN_LIMIT_PER_24H - used)
  };
};

export default GetAvailableCampaignLimitService;
