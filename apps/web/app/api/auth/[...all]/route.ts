import { auth } from "@repo/services/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Force Next.js API route to hot-reload
export const { POST, GET } = toNextJsHandler(auth);
