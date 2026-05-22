import * as React from "react";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";

type LoadingButtonProps = Omit<React.ComponentProps<typeof Button>, "children"> & {
  disabled?: boolean;
  initialText: string;
  loading?: boolean;
  loadingText: string;
  animation?: "none" | "all" | "colors" | "only-scale" | undefined;
  size?: "sm" | "lg" | "default" | "xs" | "icon" | "icon-xs" | "icon-sm" | "icon-lg" | undefined;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "info"
    | "decorations"
    | "muted"
    | "success"
    | "warning"
    | "raised"
    | undefined;
};

function LoadingButton({
  disabled = false,
  initialText,
  loading = false,
  loadingText,
  ...props
}: LoadingButtonProps) {
  return (
    <Button aria-busy={loading} disabled={disabled || loading} {...props}>
      {loading && <Spinner />}
      {loading ? loadingText : initialText}
    </Button>
  );
}

export { LoadingButton };
