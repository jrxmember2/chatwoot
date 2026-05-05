import AppError from "../../errors/AppError";
import Campaign from "../../models/Campaign";
import CampaignContact from "../../models/CampaignContact";

const CancelCampaignService = async (campaignId: number): Promise<Campaign> => {
  const campaign = await Campaign.findByPk(campaignId);

  if (!campaign) {
    throw new AppError("ERR_NO_CAMPAIGN_FOUND", 404);
  }

  if (!["draft", "scheduled", "processing"].includes(campaign.status)) {
    throw new AppError("ERR_CAMPAIGN_CANCEL_NOT_ALLOWED", 400);
  }

  await campaign.update({
    status: "canceled"
  });

  await CampaignContact.update(
    {
      status: "canceled"
    },
    {
      where: {
        campaignId,
        status: "pending"
      }
    }
  );

  return campaign;
};

export default CancelCampaignService;
