"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { LicenseDraftIcon } from "@hugeicons/core-free-icons";

import FormBuilder from "~/components/features/form/multi-step-form-builder/FormBuilder";
import { useFormBySlug } from "~/hooks/api/form/use-form-by-slug";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { Skeleton } from "~/components/ui/skeleton";
import { FormBuilderEditor } from "./builder/FormBuilderEditor";

type FormBuilderRouteProps = {
  slug: string;
};

export const FormBuilderRoute = ({ slug }: FormBuilderRouteProps) => {
  const { form, formIsLoading, formIsError, formError } = useFormBySlug(slug);

  if (formIsLoading) {
    return <Skeleton className="h-full min-h-96 w-full rounded-xl" />;
  }

  if (formIsError || !form) {
    return (
      <Empty className="min-h-80">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <HugeiconsIcon icon={LicenseDraftIcon} className="size-5" />
          </EmptyMedia>
          <EmptyTitle>Form not found</EmptyTitle>
          <EmptyDescription>
            {formError?.message ?? "The form you are looking for does not exist."}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  if (form.formType === "single_step") {
    return <FormBuilderEditor slug={slug} form={form} />;
  }

  return <FormBuilder slug={slug} form={form} />;
};
