"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { AuthGuardFallback } from "~/components/auth/AuthGuardFallback";
import { useUser } from "~/hooks/api/auth/use-user";
import { buildLoginUrl, getSafeRedirectPath } from "~/lib/auth/redirect";
import {
  DEFAULT_AUTHENTICATED_REDIRECT,
  isAuthPath,
  isLandingPath,
  isPublicPath,
} from "~/lib/auth/routes";

type AuthGuardProps = {
  children: React.ReactNode;
};

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isRedirecting, setIsRedirecting] = React.useState(false);

  const {
    isAuthenticated,
    isUnauthorized,
    isSessionPending,
    isSessionError,
    refetchSession,
    enabled,
  } = useUser();

  const isPublic = isPublicPath(pathname);
  const isAuth = isAuthPath(pathname);
  const isLanding = isLandingPath(pathname);

  React.useEffect(() => {
    if (!enabled || isSessionPending || isSessionError) {
      return;
    }

    if (isAuthenticated && (isAuth || isLanding)) {
      const redirectTo = isAuth
        ? getSafeRedirectPath(searchParams.get("from"), DEFAULT_AUTHENTICATED_REDIRECT)
        : DEFAULT_AUTHENTICATED_REDIRECT;

      if (pathname !== redirectTo) {
        setIsRedirecting(true);
        router.replace(redirectTo);
      }

      return;
    }

    if (!isAuthenticated && isUnauthorized && !isPublic) {
      setIsRedirecting(true);
      router.replace(buildLoginUrl(pathname));
    }
  }, [
    enabled,
    isAuthenticated,
    isAuth,
    isLanding,
    isPublic,
    isSessionError,
    isSessionPending,
    isUnauthorized,
    pathname,
    router,
    searchParams,
  ]);

  React.useEffect(() => {
    setIsRedirecting(false);
  }, [pathname]);

  if (!enabled) {
    return <>{children}</>;
  }

  if (isSessionPending || isRedirecting) {
    return <AuthGuardFallback />;
  }

  if (isSessionError) {
    return (
      <AuthGuardFallback
        message="Unable to verify your session. Check your connection and try again."
        showRetry
        onRetry={() => {
          void refetchSession();
        }}
      />
    );
  }

  if (isAuthenticated && (isAuth || isLanding)) {
    return <AuthGuardFallback />;
  }

  if (!isAuthenticated && !isPublic) {
    return <AuthGuardFallback />;
  }

  return <>{children}</>;
};
