import { handleMessageAck } from "../../handlers/handleWhatsappEvents";
import { MessageAck } from "../../providers/WhatsApp";

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

const getNumericAck = (value: any): MessageAck | null => {
  const numericValue = Number(value);

  if (!Number.isInteger(numericValue) || numericValue < 0 || numericValue > 4) {
    return null;
  }

  return numericValue as MessageAck;
};

const getAckFromReceipts = (item: any): MessageAck | null => {
  const receipts = Array.isArray(item?.userReceipt)
    ? item.userReceipt
    : Array.isArray(item?.receipt)
      ? item.receipt
      : Array.isArray(item?.receipts)
        ? item.receipts
        : [];

  if (receipts.some((receipt: any) => receipt?.playedTimestamp)) {
    return 4;
  }

  if (receipts.some((receipt: any) => receipt?.readTimestamp)) {
    return 3;
  }

  if (
    receipts.some(
      (receipt: any) =>
        receipt?.receiptTimestamp ||
        receipt?.deliveryTimestamp ||
        receipt?.deliveredTimestamp
    )
  ) {
    return 2;
  }

  return null;
};

const getAckFromStatus = (value: any): MessageAck | null => {
  const numericAck = getNumericAck(value);

  if (numericAck !== null) {
    return numericAck;
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalizedStatus = value.trim().toUpperCase();

  if (!normalizedStatus) {
    return null;
  }

  if (["PENDING", "SERVER_ACK", "SENT"].includes(normalizedStatus)) {
    return 1;
  }

  if (
    ["DELIVERY_ACK", "DELIVERED", "DEVICE_ACK", "RECEIVED"].includes(
      normalizedStatus
    )
  ) {
    return 2;
  }

  if (["READ", "READ_ACK", "SEEN"].includes(normalizedStatus)) {
    return 3;
  }

  if (["PLAYED", "PLAYED_ACK"].includes(normalizedStatus)) {
    return 4;
  }

  return null;
};

const getAckValue = (item: any): MessageAck | null => {
  const statusCandidates = [
    item?.update?.status,
    item?.status,
    item?.message?.status,
    item?.data?.status,
    item?.data?.update?.status,
    item?.messageStatus,
    item?.statusMessage,
    item?.ack
  ];

  for (const candidate of statusCandidates) {
    const ack = getAckFromStatus(candidate);

    if (ack !== null) {
      return ack;
    }
  }

  return getAckFromReceipts(item);
};

const HandleEvolutionMessageAckService = async ({
  payload
}: Request): Promise<Response> => {
  const items = normalizeToArray(payload);
  let processedCount = 0;

  /* eslint-disable no-await-in-loop */
  for (const item of items) {
    const messageId = getMessageId(item);
    const ack = getAckValue(item);

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
