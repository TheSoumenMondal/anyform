"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Trash2 } from "@hugeicons/core-free-icons";
import { type RouterOutputs } from "@repo/trpc/client";

import { Button } from "~/components/ui/button";
import { DeleteFormPermanentlyDialog } from "~/components/features/form/DeleteFormPermanentlyDialog";
import { RecoverFormButton } from "~/components/features/form/RecoverFormButton";

type DeletedForm = RouterOutputs["form"]["getDeletedForms"][number];

type TrashFormCardProps = {
  form: DeletedForm;
};

const formatFormType = (formType: DeletedForm["formType"]) =>
  formType === "single_step" ? "Single step" : "Multi step";

export const TrashFormCard = ({ form }: TrashFormCardProps) => {
  return (
    <div className="w-full bg-accent flex flex-col rounded-xl overflow-hidden border border-dashed">
      <div className="w-full p-2 px-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-2xl font-semibold font-instrumental-serif tracking-wide line-clamp-1">
            {form.title}
          </p>
          <p className="text-xs text-muted-foreground font-mono line-clamp-2">
            {form.description ?? "No description provided."}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <RecoverFormButton formId={form.id} formTitle={form.title} />
          <DeleteFormPermanentlyDialog formId={form.id} formTitle={form.title} />
        </div>
      </div>

      <div className="bg-card w-full p-4 rounded-lg border-t flex flex-wrap gap-1.5 items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          <Button className="border border-dashed" variant="outline">
            {formatFormType(form.formType)}
          </Button>
          <Button className="border border-dashed" variant="outline">
            {form.formStatus}
          </Button>
          <Button className="border border-dashed" variant="outline">
            <HugeiconsIcon icon={Trash2} className="size-3.5" />
            In trash
          </Button>
        </div>
      </div>
    </div>
  );
};
