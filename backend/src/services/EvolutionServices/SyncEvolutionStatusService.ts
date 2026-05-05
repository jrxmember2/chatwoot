import Whatsapp from "../../models/Whatsapp";
import ShowWhatsAppService from "../WhatsappService/ShowWhatsAppService";
import EvolutionRequestService from "./EvolutionRequestService";
import GetEvolutionConnectionConfigService from "./GetEvolutionConnectionConfigService";

const mapEvolutionStateToWhatsappStatus = (state?: string | null): string => {
  const normalizedState = (state || "").toString().trim().toLowerCase();

  if (!normalizedState) {
    return "DISCONNECTED";
  }

  if (["open", "connected", "online"].includes(normalizedState)) {
    return "CONNECTED";
  }

  if (
    [
      "connecting",
      "opening",
      "pairing",
      "starting",
      "qr",
      "qrcode"
    ].includes(normalizedState)
  ) {
    return "OPENING";
  }

  if (
    ["close", "closed", "disconnected", "offline", "logout"].includes(
      normalizedState
    )
  ) {
    return "DISCONNECTED";
  }

  return normalizedState.includes("open") ? "OPENING" : "DISCONNECTED";
};

export const applyEvolutionStateToWhatsapp = async (
  whatsapp: Whatsapp,
  state?: string | null
): Promise<Whatsapp> => {
  const status = mapEvolutionStateToWhatsappStatus(state);

  await whatsapp.update({
    status,
    qrcode: "",
    retries: 0
  });

  return ShowWhatsAppService(whatsapp.id);
};

const SyncEvolutionStatusService = async (
  whatsappId: number
): Promise<Whatsapp> => {
  const whatsapp = await ShowWhatsAppService(whatsappId);
  const config = await GetEvolutionConnectionConfigService(whatsapp);
  const response = await EvolutionRequestService({
    whatsapp,
    path: `/instance/connectionState/${encodeURIComponent(config.instanceName)}`
  });

  const state =
    response.data?.instance?.state ||
    response.data?.state ||
    response.data?.status ||
    null;

  return applyEvolutionStateToWhatsapp(whatsapp, state);
};

export default SyncEvolutionStatusService;
