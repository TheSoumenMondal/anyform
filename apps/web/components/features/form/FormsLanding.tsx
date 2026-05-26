"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { LicenseDraftIcon } from "@hugeicons/core-free-icons";

import { CreateFormDialog } from "~/components/features/form/CreateFormDialog";
import { FormCard } from "~/components/features/form/FormCard";
import { useForms } from "~/hooks/api/form/use-forms";
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

export const FormsLanding = () => {
  const { forms, formsError, formsIsError, formsIsLoading } = useForms();
  const gridClassName = getFormGridClassName();

  return (
    <main className="flex min-h-full flex-col gap-6 p-2">
      {formsIsLoading ? (
        <div className={gridClassName}>
          {Array.from({ length: 12 }).map((_, index) => (
            <Skeleton key={index} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : formsIsError ? (
        <Empty className="min-h-80">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HugeiconsIcon icon={LicenseDraftIcon} className="size-5" />
            </EmptyMedia>
            <EmptyTitle>Could not load forms</EmptyTitle>
            <EmptyDescription>{formsError?.message ?? "Please try again."}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : forms.length > 0 ? (
        <div className={cn(gridClassName, "w-full")}>
          {forms.map((form) => (
            <FormCard key={form.id} form={form} />
          ))}
        </div>
      ) : (
        <Empty className="min-h-96">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HugeiconsIcon icon={LicenseDraftIcon} className="size-5" />
            </EmptyMedia>
            <EmptyTitle>No forms yet</EmptyTitle>
            <EmptyDescription>Create your first form to see it here.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <CreateFormDialog />
          </EmptyContent>
        </Empty>
      )}
    </main>
  );
};
