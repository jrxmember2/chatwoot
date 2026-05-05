import ProcessCampaignsService from "../services/CampaignServices/ProcessCampaignsService";
import { logger } from "../utils/logger";

let campaignsInterval: NodeJS.Timeout | null = null;
let isRunning = false;

const runCampaignsJob = async (): Promise<void> => {
  if (isRunning) {
    return;
  }

  isRunning = true;

  try {
    await ProcessCampaignsService();
  } catch (error) {
    logger.error({ info: "Campaigns job failed", err: error });
  } finally {
    isRunning = false;
  }
};

export const startCampaignsJob = (): void => {
  if (campaignsInterval) {
    return;
  }

  campaignsInterval = setInterval(() => {
    void runCampaignsJob();
  }, 60 * 1000);
};
