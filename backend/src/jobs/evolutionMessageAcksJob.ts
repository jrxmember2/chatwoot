import ProcessEvolutionMessageAcksService from "../services/EvolutionServices/ProcessEvolutionMessageAcksService";
import { logger } from "../utils/logger";

const EVOLUTION_MESSAGE_ACKS_INTERVAL = 30 * 1000;

let evolutionMessageAcksInterval: NodeJS.Timeout | null = null;
let isRunning = false;

const runEvolutionMessageAcks = async (): Promise<void> => {
  if (isRunning) {
    return;
  }

  isRunning = true;

  try {
    await ProcessEvolutionMessageAcksService();
  } catch (error) {
    logger.error({ info: "Evolution message ack job failed", err: error });
  } finally {
    isRunning = false;
  }
};

export const startEvolutionMessageAcksJob = (): void => {
  if (evolutionMessageAcksInterval) {
    return;
  }

  runEvolutionMessageAcks();
  evolutionMessageAcksInterval = setInterval(
    runEvolutionMessageAcks,
    EVOLUTION_MESSAGE_ACKS_INTERVAL
  );
};

