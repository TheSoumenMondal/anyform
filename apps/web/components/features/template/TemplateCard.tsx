"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { GitForkIcon, LayersLogoIcon, Loading03Icon, Note01Icon } from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { type RouterOutputs } from "@repo/trpc/client";
import { useForkTemplate } from "~/hooks/api/template/use-fork-template";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type Template = RouterOutputs["template"]["listTemplates"][number];

const THEME_LABELS: Record<string, string> = {
  default: "Default",
  movie: "Movie",
  terminal: "Terminal",
  startup: "Startup",
  game: "Game",
  anime: "Anime",
  os: "OS",
};

const THEME_COLORS: Record<string, string> = {
  default: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  movie: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  terminal: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  startup: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  game: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  anime: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
  os: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
};

type TemplateCardProps = {
  template: Template;
};

export const TemplateCard = ({ template }: TemplateCardProps) => {
  const router = useRouter();
  const { forkTemplateAsync, forkTemplateIsPending } = useForkTemplate();

  const handleFork = async () => {
    try {
      const result = await forkTemplateAsync({ templateId: template.id });
      toast.success("Form created!", {
        description: "Your forked form is ready — go build something great.",
      });
      router.push(`/form/${result.slug}`);
    } catch (error) {
      toast.error("Failed to use template", {
        description: error instanceof Error ? error.message : "Something went wrong.",
      });
    }
  };

  const themeColor = THEME_COLORS[template.theme] ?? THEME_COLORS.default;
  const themeLabel = THEME_LABELS[template.theme] ?? "Default";
  const formTypeLabel = template.formType === "single_step" ? "Single step" : "Multi step";

  return (
    <div className="group bg-card border rounded-xl overflow-hidden flex flex-col transition-all duration-200">
      {/* card header — icon + theme badge */}
      <div className="bg-accent px-4 pt-4 pb-3 flex items-start justify-between gap-3">
        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <HugeiconsIcon icon={Note01Icon} className="size-5 text-primary" />
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "text-[10px] font-medium px-2 py-0.5 rounded-full border border-transparent",
              themeColor,
            )}
          >
            {themeLabel}
          </span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            {formTypeLabel}
          </span>
        </div>
      </div>

      {/* body */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <p className="text-lg font-semibold font-instrumental-serif tracking-wide leading-tight line-clamp-2">
          {template.title}
        </p>
        {template.description ? (
          <p className="text-xs text-muted-foreground font-mono line-clamp-2">
            {template.description}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground italic">No description</p>
        )}
      </div>

      {/* footer */}
      <div className="px-4 pb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <HugeiconsIcon icon={GitForkIcon} className="size-3.5" />
          <span>{template.totalForks.toLocaleString()} forks</span>
        </div>
        <Button
          variant="default"
          size="sm"
          onClick={handleFork}
          disabled={forkTemplateIsPending}
          id={`fork-template-${template.id}`}
        >
          {forkTemplateIsPending ? (
            <>
              <HugeiconsIcon icon={Loading03Icon} className="size-3.5 animate-spin" />
              Forking...
            </>
          ) : (
            <>
              <HugeiconsIcon icon={LayersLogoIcon} className="size-3.5" />
              Use template
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
