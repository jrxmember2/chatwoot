import http from "http";
import https from "https";

interface RequestOptions {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: string;
  timeoutMs?: number;
}

interface Response {
  statusCode: number;
  body: string;
  headers: http.IncomingHttpHeaders;
}

const HttpRequestService = ({
  url,
  method = "GET",
  headers = {},
  body,
  timeoutMs = 15000
}: RequestOptions): Promise<Response> => {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === "https:" ? https : http;

    const request = client.request(
      parsedUrl,
      {
        method,
        headers,
        timeout: timeoutMs
      },
      response => {
        const chunks: Buffer[] = [];

        response.on("data", chunk => {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        });

        response.on("end", () => {
          resolve({
            statusCode: response.statusCode || 0,
            body: Buffer.concat(chunks).toString("utf-8"),
            headers: response.headers
          });
        });
      }
    );

    request.on("error", reject);
    request.on("timeout", () => {
      request.destroy(new Error("Request timeout"));
    });

    if (body) {
      request.write(body);
    }

    request.end();
  });
};

export default HttpRequestService;
