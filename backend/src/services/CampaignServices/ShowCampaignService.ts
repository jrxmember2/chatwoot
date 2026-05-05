import AppError from "../../errors/AppError";
import Campaign from "../../models/Campaign";
import CampaignContact from "../../models/CampaignContact";
import Contact from "../../models/Contact";
import User from "../../models/User";
import Whatsapp from "../../models/Whatsapp";

const ShowCampaignService = async (campaignId: number): Promise<Campaign> => {
  const campaign = await Campaign.findByPk(campaignId, {
    include: [
      {
        model: Whatsapp,
        as: "whatsapp",
        attributes: ["id", "name"]
      },
      {
        model: User,
        as: "creator",
        attributes: ["id", "name"]
      },
      {
        model: CampaignContact,
        as: "contacts",
        include: [
          {
            model: Contact,
            as: "contact",
            attributes: ["id", "name", "number"]
          }
        ]
      }
    ]
  });

  if (!campaign) {
    throw new AppError("ERR_NO_CAMPAIGN_FOUND", 404);
  }

  return campaign;
};

export default ShowCampaignService;
