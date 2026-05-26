"use client";

import Link from "next/link";
import { format } from "date-fns";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add,
  Globe02Icon,
  Key01Icon,
  LockPasswordIcon,
  Megaphone02Icon,
  PencilIcon,
  QrCodeIcon,
  Trash2,
  UserStatusIcon,
} from "@hugeicons/core-free-icons";
import { type RouterOutputs } from "@repo/trpc/client";

import QrDialog from "./QrDialog";
import { EditFormSheet } from "./EditFormSheet";
import { DeleteFormDialog } from "./DeleteFormDialog";
import { Button } from "~/components/ui/button";

import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useSidebar } from "~/components/ui/sidebar";
import { useRouter } from "next/navigation";

type UserForm = RouterOutputs["form"]["getFormsByUserId"][number];

type FormCardProps = {
  form: UserForm;
};

const formatDate = (date: Date | string) => format(new Date(date), "MMM d, yyyy p");

const formatFormType = (formType: UserForm["formType"]) =>
  formType === "single_step" ? "Single step" : "Multi step";

export const FormCard = ({ form }: FormCardProps) => {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const handleAddFormFields = () => {
    router.push(`/form/${form.slug}`);
  };

  return (
    <div className="w-full bg-accent flex flex-col rounded-xl overflow-hidden border">
      <div className="w-full p-2 px-4 flex items-center justify-between">
        <div>
          <p className="text-2xl font-semibold font-instrumental-serif tracking-wide">
            {form.title}
          </p>
          <p className="text-xs text-muted-foreground font-mono">{form.description}</p>
        </div>
        <div className="flex items-center gap-2">
          {isMobile ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreHorizontal />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card mr-10 p-1.5">
                <EditFormSheet
                  form={form}
                  trigger={
                    <DropdownMenuItem className="w-full" onSelect={(e) => e.preventDefault()}>
                      <HugeiconsIcon icon={PencilIcon} className="size-3.5" />
                      Edit form settings
                    </DropdownMenuItem>
                  }
                />
                <QrDialog
                  formTitle={form.title}
                  formSlug={form.slug}
                  trigger={
                    <DropdownMenuItem className="w-full" onSelect={(e) => e.preventDefault()}>
                      <HugeiconsIcon icon={QrCodeIcon} className="size-3.5" />
                      QR Code
                    </DropdownMenuItem>
                  }
                />
                <DropdownMenuItem className="w-full" onSelect={handleAddFormFields}>
                  <HugeiconsIcon icon={Add} className="size-3.5" />
                  Add form fields
                </DropdownMenuItem>
                <DeleteFormDialog
                  formId={form.id}
                  formTitle={form.title}
                  trigger={
                    <DropdownMenuItem
                      className="w-full"
                      variant="destructive"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <HugeiconsIcon icon={Trash2} className="size-3.5" />
                      Delete form
                    </DropdownMenuItem>
                  }
                />
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-0.5">
              <DeleteFormDialog formId={form.id} formTitle={form.title} />
              <EditFormSheet form={form} />
              <QrDialog formTitle={form.title} formSlug={form.slug} />
              <Button variant="warning" onClick={handleAddFormFields}>
                <HugeiconsIcon icon={Add} />
                Add form fields
              </Button>
            </div>
          )}
        </div>
      </div>
      <Link
        href={`/form/${form.slug}`}
        className="bg-card w-full p-4 rounded-lg border-t flex items-center justify-between"
      >
        <div className="flex gap-1">
          <Button className="border border-dashed" variant={"outline"}>
            {formatFormType(form.formType)}
          </Button>
          <Button className="border border-dashed" variant={"outline"}>
            {form.formStatus}
          </Button>
          <Button className="border border-dashed" variant={"outline"} size="icon">
            {form.isPublic ? (
              <HugeiconsIcon icon={Globe02Icon} className="text-sky-600" />
            ) : (
              <HugeiconsIcon icon={LockPasswordIcon} />
            )}
          </Button>
          <Button className="border border-dashed" variant={"outline"}>
            <HugeiconsIcon icon={UserStatusIcon} />
            {form.maxSubmissionLimit}
          </Button>
          <Button className="border border-dashed" variant={"outline"} size="icon">
            {form.isProtected ? (
              <HugeiconsIcon icon={Key01Icon} />
            ) : (
              <HugeiconsIcon icon={Megaphone02Icon} />
            )}
          </Button>
        </div>
        <div className="hidden lg:flex flex-col">
          <p className="text-xs text-muted-foreground">Created: {formatDate(form.createdAt)}</p>
          <p className="text-xs text-muted-foreground">Expiring: {formatDate(form.expiry)}</p>
        </div>
      </Link>
    </div>
  );
};
