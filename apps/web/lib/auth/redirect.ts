import { AUTH_PATHS, DEFAULT_AUTHENTICATED_REDIRECT } from "./routes";

const isAuthPath = (pathname: string) =>
  AUTH_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));

export const getSafeRedirectPath = (
  from: string | null | undefined,
  fallback: string = DEFAULT_AUTHENTICATED_REDIRECT,
): string => {
  if (!from || !from.startsWith("/") || from.startsWith("//")) {
    return fallback;
  }

  if (isAuthPath(from)) {
    return fallback;
  }

  return from;
};

export const buildLoginUrl = (returnPath: string) => {
  const params = new URLSearchParams({ from: returnPath });
  return `/login?${params.toString()}`;
};
