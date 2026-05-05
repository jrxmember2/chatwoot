import { randomBytes } from "crypto";
import Whatsapp from "../../models/Whatsapp";

const EnsureEvolutionWebhookTokenService = async (
  whatsapp: Whatsapp
): Promise<string> => {
  if (whatsapp.evolutionWebhookToken) {
    return whatsapp.evolutionWebhookToken;
  }

  const evolutionWebhookToken = randomBytes(24).toString("hex");
  await whatsapp.update({ evolutionWebhookToken });

  return evolutionWebhookToken;
};

export default EnsureEvolutionWebhookTokenService;
