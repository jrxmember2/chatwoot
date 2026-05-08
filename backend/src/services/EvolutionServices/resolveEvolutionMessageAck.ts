import { MessageAck } from "../../providers/WhatsApp";

const getNumericAck = (value: any): MessageAck | null => {
  const numericValue = Number(value);

  if (!Number.isInteger(numericValue) || numericValue < 0 || numericValue > 4) {
    return null;
  }

  return numericValue as MessageAck;
};

export const getAckFromReceipts = (item: any): MessageAck | null => {
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

export const getAckFromStatus = (value: any): MessageAck | null => {
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

const getAckFromStatusCandidates = (item: any): MessageAck | null => {
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

  let highestAck: MessageAck | null = null;

  for (const candidate of statusCandidates) {
    const ack = getAckFromStatus(candidate);

    if (ack !== null && (highestAck === null || ack > highestAck)) {
      highestAck = ack;
    }
  }

  return highestAck;
};

const getAckFromMessageUpdates = (item: any): MessageAck | null => {
  const updates = Array.isArray(item?.MessageUpdate)
    ? item.MessageUpdate
    : Array.isArray(item?.messageUpdate)
      ? item.messageUpdate
      : Array.isArray(item?.updates)
        ? item.updates
        : [];

  let highestAck: MessageAck | null = null;

  for (const update of updates) {
    const ack =
      getAckFromStatusCandidates(update) || getAckFromReceipts(update);

    if (ack !== null && (highestAck === null || ack > highestAck)) {
      highestAck = ack;
    }
  }

  return highestAck;
};

export const getAckValueFromEvolutionItem = (item: any): MessageAck | null => {
  const statusAck = getAckFromStatusCandidates(item);
  const messageUpdateAck = getAckFromMessageUpdates(item);
  const receiptAck = getAckFromReceipts(item);

  return [statusAck, messageUpdateAck, receiptAck].reduce<MessageAck | null>(
    (highestAck, currentAck) => {
      if (currentAck === null) {
        return highestAck;
      }

      if (highestAck === null || currentAck > highestAck) {
        return currentAck;
      }

      return highestAck;
    },
    null
  );
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

const collectMatchingNodes = (
  input: any,
  messageId: string,
  matches: any[] = [],
  visited = new WeakSet<object>()
): any[] => {
  if (!input || typeof input !== "object") {
    return matches;
  }

  if (visited.has(input)) {
    return matches;
  }

  visited.add(input);

  if (getMessageId(input) === messageId) {
    matches.push(input);
  }

  if (Array.isArray(input)) {
    input.forEach(item => collectMatchingNodes(item, messageId, matches, visited));
    return matches;
  }

  Object.values(input).forEach(value => {
    if (value && typeof value === "object") {
      collectMatchingNodes(value, messageId, matches, visited);
    }
  });

  return matches;
};

const collectAckNodes = (
  input: any,
  nodes: any[] = [],
  visited = new WeakSet<object>()
): any[] => {
  if (!input || typeof input !== "object") {
    return nodes;
  }

  if (visited.has(input)) {
    return nodes;
  }

  visited.add(input);

  nodes.push(input);

  if (Array.isArray(input)) {
    input.forEach(item => collectAckNodes(item, nodes, visited));
    return nodes;
  }

  Object.values(input).forEach(value => {
    if (value && typeof value === "object") {
      collectAckNodes(value, nodes, visited);
    }
  });

  return nodes;
};

export const extractAckFromEvolutionPayload = (
  payload: any,
  messageId?: string
): MessageAck | null => {
  const candidates = messageId
    ? collectMatchingNodes(payload, messageId)
    : collectAckNodes(payload);

  const fallbackCandidates =
    candidates.length > 0 ? candidates : collectAckNodes(payload);

  let highestAck: MessageAck | null = null;

  for (const candidate of fallbackCandidates) {
    const ack = getAckValueFromEvolutionItem(candidate);

    if (ack !== null && (highestAck === null || ack > highestAck)) {
      highestAck = ack;
    }
  }

  return highestAck;
};

