"use client";

import Link from "next/link";
import { format } from "date-fns";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar01Icon,
  LockKeyIcon,
  Trash2,
  UserGroupIcon,
  PencilIcon,
} from "@hugeicons/core-free-icons";
import { type RouterOutputs } from "@repo/trpc/client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { BadgeAdditional } from "~/components/ui/badge-1";
import { Button } from "~/components/ui/button";
import QrDialog from "./QrDialog";

type UserForm = RouterOutputs["form"]["getFormsByUserId"][number];

type FormCardProps = {
  form: UserForm;
};

const formatDate = (date: Date | string) => format(new Date(date), "MMM d, yyyy p");

const formatFormType = (formType: UserForm["formType"]) =>
  formType === "single_step" ? "Single step" : "Multi step";

export const FormCard = ({ form }: FormCardProps) => {
  return (
    <Card className="h-full rounded-md border py-0">
      <Link href={`/form/${form.slug}`} className="group flex flex-1 flex-col">
        <CardHeader className="gap-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-2">
              <CardTitle className="line-clamp-2 text-base leading-snug">{form.title}</CardTitle>
              <p className="line-clamp-2 min-h-10 text-sm text-muted-foreground">
                {form.description || "No description provided."}
              </p>
            </div>
            <BadgeAdditional variant="outline" className="capitalize">
              {form.formStatus}
            </BadgeAdditional>
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-4 p-5 pt-0">
          <div className="flex flex-wrap gap-2">
            <BadgeAdditional variant="secondary">{formatFormType(form.formType)}</BadgeAdditional>
            <BadgeAdditional variant={form.isPublic ? "info" : "outline"}>
              {form.isPublic ? "Public" : "Private"}
            </BadgeAdditional>
            {form.isProtected ? (
              <BadgeAdditional variant="warning">
                <HugeiconsIcon icon={LockKeyIcon} className="size-3" />
                Protected
              </BadgeAdditional>
            ) : null}
          </div>

          <div className="grid gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={UserGroupIcon} className="size-4 shrink-0" />
              <span>{form.maxSubmissionLimit ?? "Unlimited"} submissions</span>
            </div>
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Calendar01Icon} className="size-4 shrink-0" />
              <span>Expires {formatDate(form.expiry)}</span>
            </div>
          </div>
        </CardContent>
      </Link>
      <CardFooter
        background
        className="mb-0! mt-auto h-auto! flex-wrap justify-end gap-2 border-t bg-muted/25 px-5! py-3!"
      >
        <Button
          animation="none"
          type="button"
          size="lg"
          variant="destructive"
          aria-label={`Delete ${form.title}`}
        >
          <HugeiconsIcon icon={Trash2} className="size-3.5" />
          Delete
        </Button>
        <Button
          animation="none"
          size="lg"
          type="button"
          variant="info"
          aria-label={`Edit ${form.title}`}
        >
          <HugeiconsIcon icon={PencilIcon} className="size-3.5" />
          Edit
        </Button>
        <QrDialog formId={form.id} formTitle={form.title} />
      </CardFooter>
    </Card>
  );
};
