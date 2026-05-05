import AppError from "../../errors/AppError";
import HttpRequestService from "./HttpRequestService";

interface Request {
  baseUrl: string;
  apiKey?: string | null;
}

const TestEvolutionConnectionService = async ({
  baseUrl,
  apiKey
}: Request): Promise<{ statusCode: number; body: string }> => {
  try {
    new URL(baseUrl);
  } catch (error) {
    throw new AppError("ERR_EVOLUTION_INVALID_URL", 400);
  }

  const response = await HttpRequestService({
    url: baseUrl,
    method: "GET",
    headers: apiKey
      ? {
          apikey: apiKey
        }
      : {}
  });

  if (response.statusCode >= 400) {
    throw new AppError("ERR_EVOLUTION_TEST_FAILED", 400);
  }

  return {
    statusCode: response.statusCode,
    body: response.body
  };
};

export default TestEvolutionConnectionService;
