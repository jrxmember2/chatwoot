import { handleMessageAck } from "../../handlers/handleWhatsappEvents";
import {
  getAckValueFromEvolutionItem
} from "./resolveEvolutionMessageAck";

interface Request {
  payload: any;
}

interface Response {
  processedCount: number;
}

const normalizeToArray = (payload: any): any[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.updates)) {
    return payload.updates;
  }

  if (Array.isArray(payload?.data?.updates)) {
    return payload.data.updates;
  }

  if (payload?.data?.key) {
    return [payload.data];
  }

  if (payload?.key) {
    return [payload];
  }

  return [];
};

const getMessageId = (item: any): string | undefined => {
  return (
    item?.key?.id ||
    item?.data?.key?.id ||
    item?.messageId ||
    item?.data?.messageId ||
    undefined
  );
};

const HandleEvolutionMessageAckService = async ({
  payload
}: Request): Promise<Response> => {
  const items = normalizeToArray(payload);
  let processedCount = 0;

  /* eslint-disable no-await-in-loop */
  for (const item of items) {
    const messageId = getMessageId(item);
    const ack = getAckValueFromEvolutionItem(item);

    if (!messageId || ack === null) {
      continue;
    }

    await handleMessageAck(messageId, ack);
    processedCount += 1;
  }

  return {
    processedCount
  };
};

export default HandleEvolutionMessageAckService;
