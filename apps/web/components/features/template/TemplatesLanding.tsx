"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { LayersLogoIcon } from "@hugeicons/core-free-icons";

import { TemplateCard } from "~/components/features/template/TemplateCard";
import { useTemplates } from "~/hooks/api/template/use-templates";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export const TemplatesLanding = () => {
  const { templates, templatesIsLoading, templatesIsError, templatesError } = useTemplates();

  return (
    <main className="flex min-h-full flex-col gap-6 p-2">
      {/* page header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold font-instrumental-serif tracking-wide">
          Community Templates
        </h1>
        <p className="text-sm text-muted-foreground">
          Pick a template, fork it in one click, and start collecting responses right away.
        </p>
      </div>

      {/* content */}
      {templatesIsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, index) => (
            <Skeleton key={index} className="h-52 rounded-xl" />
          ))}
        </div>
      ) : templatesIsError ? (
        <Empty className="min-h-80">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HugeiconsIcon icon={LayersLogoIcon} className="size-5" />
            </EmptyMedia>
            <EmptyTitle>Could not load templates</EmptyTitle>
            <EmptyDescription>{templatesError?.message ?? "Please try again."}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : templates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      ) : (
        <Empty className="min-h-96">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HugeiconsIcon icon={LayersLogoIcon} className="size-5" />
            </EmptyMedia>
            <EmptyTitle>No templates yet</EmptyTitle>
            <EmptyDescription>
              Be the first to share a form as a template for the community.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link href="/dashboard">
              <Button variant="default">Go to my forms</Button>
            </Link>
          </EmptyContent>
        </Empty>
      )}
    </main>
  );
};
