"use client";

import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";

type AuthGuardFallbackProps = {
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
};

export const AuthGuardFallback = ({
  message,
  onRetry,
  showRetry = false,
}: AuthGuardFallbackProps) => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 p-6">
      {!showRetry && <Spinner className="size-8" />}
      {message && <p className="text-muted-foreground max-w-sm text-center text-sm">{message}</p>}
      {showRetry && onRetry && (
        <Button type="button" variant="outline" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
};
