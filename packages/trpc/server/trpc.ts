import { initTRPC, TRPCError } from "@trpc/server";
import { OpenApiMeta } from "trpc-to-openapi";

import { createContext } from "./context";
import { getAuthenticationTokenFromCookie } from "./utils/cookie";
import { auth } from "@repo/services/auth/auth";

export const tRPCContext = initTRPC.meta<OpenApiMeta>().context<typeof createContext>().create({});

export const router = tRPCContext.router;

export const publicProcedure = tRPCContext.procedure;

export const protectedProcedure = tRPCContext.procedure.use(async ({ ctx, next }) => {
  const token = getAuthenticationTokenFromCookie(ctx);
  if (!token) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication token is missing",
    });
  }

  const session = await auth.api.getSession({
    headers: new Headers({
      Authorization: `Bearer ${token}`,
    }),
  });

  if (!session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid or expired session. Please sign in again.",
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: session.user,
      session: session.session,
    },
  });
});
