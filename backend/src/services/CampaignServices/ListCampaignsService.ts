import Campaign from "../../models/Campaign";
import CampaignContact from "../../models/CampaignContact";
import Contact from "../../models/Contact";
import User from "../../models/User";
import Whatsapp from "../../models/Whatsapp";

const ListCampaignsService = async (): Promise<Campaign[]> => {
  return Campaign.findAll({
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
    ],
    order: [["createdAt", "DESC"]]
  });
};

export default ListCampaignsService;
