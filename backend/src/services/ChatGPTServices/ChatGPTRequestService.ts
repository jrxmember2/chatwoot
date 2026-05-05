import AppError from "../../errors/AppError";
import GetOrCreateIntegrationSettingService from "../IntegrationServices/GetOrCreateIntegrationSettingService";
import HttpRequestService from "../IntegrationServices/HttpRequestService";

interface Request {
  instructions: string;
  input: string;
  queueId?: number | null;
}

const extractOutputText = (payload: any): string => {
  if (typeof payload?.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  if (Array.isArray(payload?.output)) {
    const textParts = payload.output
      .flatMap((item: any) => item?.content || [])
      .map((content: any) => content?.text)
      .filter((text: unknown) => typeof text === "string");

    if (textParts.length > 0) {
      return textParts.join("\n").trim();
    }
  }

  return "";
};

const ChatGPTRequestService = async ({
  instructions,
  input,
  queueId
}: Request): Promise<string> => {
  const settings = await GetOrCreateIntegrationSettingService();

  if (!settings.chatgptActive || !settings.chatgptApiKey) {
    throw new AppError("ERR_CHATGPT_NOT_CONFIGURED", 400);
  }

  if (settings.chatgptQueueIds) {
    try {
      const queueIds = JSON.parse(settings.chatgptQueueIds);

      if (
        Array.isArray(queueIds) &&
        queueIds.length > 0 &&
        queueId &&
        !queueIds.includes(queueId)
      ) {
        throw new AppError("ERR_CHATGPT_QUEUE_NOT_ALLOWED", 403);
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
    }
  }

  const response = await HttpRequestService({
    url: "https://api.openai.com/v1/responses",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${settings.chatgptApiKey}`
    },
    body: JSON.stringify({
      model: settings.chatgptModel || "gpt-4.1-mini",
      instructions: `${settings.chatgptBasePrompt || ""}\n${instructions}`.trim(),
      input,
      temperature: settings.chatgptTemperature,
      max_output_tokens: settings.chatgptMaxTokens,
      store: false
    }),
    timeoutMs: 30000
  });

  const parsedBody = response.body ? JSON.parse(response.body) : {};

  if (response.statusCode >= 400) {
    throw new AppError(
      parsedBody?.error?.message || "ERR_CHATGPT_REQUEST_FAILED",
      400
    );
  }

  const text = extractOutputText(parsedBody);

  if (!text) {
    throw new AppError("ERR_CHATGPT_EMPTY_RESPONSE", 400);
  }

  return text;
};

export default ChatGPTRequestService;
