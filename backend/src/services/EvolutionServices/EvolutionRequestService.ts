import AppError from "../../errors/AppError";
import Whatsapp from "../../models/Whatsapp";
import HttpRequestService from "../IntegrationServices/HttpRequestService";
import GetEvolutionConnectionConfigService, {
  EvolutionConnectionConfig
} from "./GetEvolutionConnectionConfigService";

type EvolutionMethod = "GET" | "POST" | "PUT" | "DELETE";

interface Request {
  whatsapp: Whatsapp;
  method?: EvolutionMethod;
  path: string;
  body?: Record<string, unknown>;
  timeoutMs?: number;
  expectedStatusCodes?: number[];
}

interface Response {
  data: any;
  statusCode: number;
  config: EvolutionConnectionConfig;
}

const parseJson = (value: string): any => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const buildErrorCode = (parsedBody: any): string => {
  return (
    parsedBody?.response?.message ||
    parsedBody?.message ||
    parsedBody?.error ||
    "ERR_EVOLUTION_REQUEST_FAILED"
  );
};

const EvolutionRequestService = async ({
  whatsapp,
  method = "GET",
  path,
  body,
  timeoutMs = 15000,
  expectedStatusCodes = [200, 201]
}: Request): Promise<Response> => {
  const config = await GetEvolutionConnectionConfigService(whatsapp);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${config.baseUrl}${normalizedPath}`;
  const serializedBody = body ? JSON.stringify(body) : undefined;

  const response = await HttpRequestService({
    url,
    method,
    timeoutMs,
    headers: {
      apikey: config.apiKey,
      ...(serializedBody
        ? {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(serializedBody).toString()
          }
        : {})
    },
    body: serializedBody
  });

  const parsedBody = parseJson(response.body);

  if (!expectedStatusCodes.includes(response.statusCode)) {
    throw new AppError(buildErrorCode(parsedBody), 502);
  }

  return {
    data: parsedBody,
    statusCode: response.statusCode,
    config
  };
};

export default EvolutionRequestService;
