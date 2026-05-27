import { httpLink, httpBatchStreamLink } from "@repo/trpc/client";
import { env } from "~/env.js";

interface CreateTRPCHttpBatchClientClientOpts {
  enableStreaming?: boolean;
}

function getApiUrl() {
  if (env.NEXT_PUBLIC_API_URL) return env.NEXT_PUBLIC_API_URL;
  if (typeof window !== "undefined") return "/trpc";
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  if (process.env.RAILWAY_SERVICE_API_URL)
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    return `https://${process.env.RAILWAY_SERVICE_API_URL}/trpc`;
  return "http://localhost:8000/trpc";
}

export const createTRPCHttpBatchClientClient = (opts?: CreateTRPCHttpBatchClientClientOpts) => {
  const c = opts?.enableStreaming ? httpBatchStreamLink : httpLink;
  return c({
    url: getApiUrl(),
    fetch(url, options) {
      return fetch(url, {
        ...options,
        credentials: "include",
      });
    },
  });
};
