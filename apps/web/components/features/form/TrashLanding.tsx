"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Trash2 } from "@hugeicons/core-free-icons";

import { TrashFormCard } from "~/components/features/form/TrashFormCard";
import { useDeletedForms } from "~/hooks/api/form/use-deleted-forms";
import { cn } from "~/lib/utils";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { Skeleton } from "~/components/ui/skeleton";

const getFormGridClassName = () => cn("flex flex-col gap-3 w-full");

export const TrashLanding = () => {
  const { deletedForms, deletedFormsError, deletedFormsIsError, deletedFormsIsLoading } =
    useDeletedForms();
  const gridClassName = getFormGridClassName();

  return (
    <main className="flex min-h-full flex-col gap-6 p-2">
      {deletedFormsIsLoading ? (
        <div className={gridClassName}>
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : deletedFormsIsError ? (
        <Empty className="min-h-80">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HugeiconsIcon icon={Trash2} className="size-5" />
            </EmptyMedia>
            <EmptyTitle>Could not load trash</EmptyTitle>
            <EmptyDescription>{deletedFormsError?.message ?? "Please try again."}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : deletedForms.length > 0 ? (
        <div className={cn(gridClassName, "w-full")}>
          {deletedForms.map((form) => (
            <TrashFormCard key={form.id} form={form} />
          ))}
        </div>
      ) : (
        <Empty className="min-h-96">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HugeiconsIcon icon={Trash2} className="size-5" />
            </EmptyMedia>
            <EmptyTitle>No deleted forms</EmptyTitle>
            <EmptyDescription>
              Deleted forms will appear here until you recover or remove them.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent />
        </Empty>
      )}
    </main>
  );
};
