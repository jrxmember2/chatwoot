import ProcessScheduledMessagesService from "../services/ScheduledMessageServices/ProcessScheduledMessagesService";
import { logger } from "../utils/logger";

const SCHEDULED_MESSAGES_INTERVAL = 60 * 1000;

let isRunning = false;
let scheduledMessagesInterval: NodeJS.Timeout | null = null;

const runScheduledMessages = async (): Promise<void> => {
  if (isRunning) {
    return;
  }

  isRunning = true;

  try {
    await ProcessScheduledMessagesService();
  } catch (err) {
    logger.error({ info: "Scheduled messages job failed", err });
  } finally {
    isRunning = false;
  }
};

export const startScheduledMessagesJob = (): void => {
  if (scheduledMessagesInterval) {
    return;
  }

  runScheduledMessages();
  scheduledMessagesInterval = setInterval(
    runScheduledMessages,
    SCHEDULED_MESSAGES_INTERVAL
  );
};
