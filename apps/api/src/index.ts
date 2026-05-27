import crypto from "node:crypto";

if (typeof globalThis.crypto === "undefined") {
  Object.assign(globalThis, { crypto: crypto.webcrypto });
}
if (typeof global.crypto === "undefined") {
  global.crypto = globalThis.crypto;
}

import http from "node:http";
import { logger } from "@repo/logger";
import { app as expressApplication } from "./server.js";

import { env } from "./env.js";

async function init() {
  try {
    const server = http.createServer(expressApplication);
    const PORT: number = env.PORT ? +env.PORT : 8000;
    server.listen(PORT, () => {
      logger.info(`http server is running on PORT ${PORT}`);
    });
  } catch (err) {
    logger.error(`Error creating http server`, { err });
    process.exit(1);
  }
}

init();
