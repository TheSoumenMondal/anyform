import { initTRPC, TRPCError } from "@trpc/server";
import { OpenApiMeta } from "trpc-to-openapi";

import { createContext } from "./context";
import { getAuthenticationTokenFromCookie } from "./utils/cookie";
import { authService } from "./services";
import { auth } from "@repo/services/auth";

export const tRPCContext = initTRPC.meta<OpenApiMeta>().context<typeof createContext>().create({});

export const router = tRPCContext.router;

export const publicProcedure = tRPCContext.procedure;

export const protectedProcedure = tRPCContext.procedure.use(async ({ ctx, next }) => {
  // Try better-auth session first using native request headers
  const headers = new Headers();
  const cookieStr = Object.entries(ctx.cookies)
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
  headers.set("cookie", cookieStr);

  let sessionUser = null;
  let sessionId = "";
  let sessionToken = "";
  let sessionExpiresAt = new Date();

  try {
    const betterAuthSession = await auth.api.getSession({ headers });
    if (betterAuthSession?.user) {
      sessionUser = betterAuthSession.user;
      sessionId = betterAuthSession.session.id;
      sessionToken = betterAuthSession.session.token;
      sessionExpiresAt = betterAuthSession.session.expiresAt;
    }
  } catch (err) {
    // ignore and fallback
  }

  // Fallback to legacy custom email/password token
  if (!sessionUser) {
    const token = getAuthenticationTokenFromCookie(ctx);
    if (!token) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Authentication token is missing",
      });
    }

    const legacySession = await authService.getSessionFromToken(token);
    if (!legacySession?.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid or expired session. Please sign in again.",
      });
    }
    sessionUser = legacySession.user;
    sessionId = legacySession.id;
    sessionToken = legacySession.token;
    sessionExpiresAt = legacySession.expiresAt;
  }

  return next({
    ctx: {
      ...ctx,
      user: sessionUser,
      session: {
        id: sessionId,
        token: sessionToken,
        userId: sessionUser.id,
        expiresAt: sessionExpiresAt,
      },
    },
  });
});
