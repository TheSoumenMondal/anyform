export const PUBLIC_PATHS = ["/", "/login", "/signup", "/submit"] as const;

export const AUTH_PATHS = ["/login", "/signup"] as const;

export const DEFAULT_AUTHENTICATED_REDIRECT = "/dashboard";

export const LOGIN_PATH = "/login";

const matchesPathPrefix = (pathname: string, basePath: string) =>
  pathname === basePath || pathname.startsWith(`${basePath}/`);

export const isPublicPath = (pathname: string) =>
  PUBLIC_PATHS.some((path) => {
    if (path === "/") {
      return pathname === "/";
    }

    return matchesPathPrefix(pathname, path);
  });

export const isAuthPath = (pathname: string) =>
  AUTH_PATHS.some((path) => matchesPathPrefix(pathname, path));

export const isLandingPath = (pathname: string) => pathname === "/";

export const shouldCheckSession = (pathname: string) =>
  !isPublicPath(pathname) || isAuthPath(pathname) || isLandingPath(pathname);
