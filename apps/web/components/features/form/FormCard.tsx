"use client";

import React, { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Globe02Icon,
  Key01Icon,
  LockPasswordIcon,
  Megaphone02Icon,
  PencilIcon,
  QrCodeIcon,
  Share05Icon,
  Trash2,
  UserStatusIcon,
} from "@hugeicons/core-free-icons";
import { type RouterOutputs } from "@repo/trpc/client";
import { toast } from "sonner";

import QrDialog from "./QrDialog";
import { EditFormSheet } from "./EditFormSheet";
import { DeleteFormDialog } from "./DeleteFormDialog";
import { Button } from "~/components/ui/button";
import { useShareAsTemplate } from "~/hooks/api/template/use-share-as-template";
import { useUnshareTemplate } from "~/hooks/api/template/use-unshare-template";
import { useMyTemplates } from "~/hooks/api/template/use-templates";

import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

type UserForm = RouterOutputs["form"]["getFormsByUserId"][number];

type FormCardProps = {
  form: UserForm;
};

const formatDate = (date: Date | string) => format(new Date(date), "MMM d, yyyy p");

const formatFormType = (formType: UserForm["formType"]) =>
  formType === "single_step" ? "Single step" : "Multi step";

export const FormCard = ({ form }: FormCardProps) => {
  const router = useRouter();
  const [qrOpen, setQrOpen] = useState(false);
  const { shareAsTemplate, shareAsTemplateIsPending } = useShareAsTemplate();
  const { unshareTemplate, unshareTemplateIsPending } = useUnshareTemplate();
  const { myTemplates } = useMyTemplates();

  const handleAddFormFields = () => {
    router.push(`/form/${form.slug}`);
  };

  // check if this form is already shared as a template
  const existingTemplate = myTemplates.find((t) => t.formId === form.id);
  const isSharedAsTemplate = Boolean(existingTemplate);

  const handleShareAsTemplate = () => {
    shareAsTemplate(
      { formId: form.id },
      {
        onSuccess: () => {
          toast.success("Template shared!", {
            description: "Your form is now available in the community templates.",
          });
        },
        onError: (error) => {
          toast.error("Failed to share template", {
            description: error.message,
          });
        },
      },
    );
  };

  const handleUnshareTemplate = () => {
    if (!existingTemplate) return;
    unshareTemplate(
      { templateId: existingTemplate.id },
      {
        onSuccess: () => {
          toast.success("Template removed", {
            description: "Your form has been removed from community templates.",
          });
        },
        onError: (error) => {
          toast.error("Failed to remove template", {
            description: error.message,
          });
        },
      },
    );
  };

  return (
    <div className="w-full bg-accent flex flex-col rounded-xl overflow-hidden border">
      <div className="w-full p-2 px-4 flex items-center justify-between">
        <div>
          <p className="text-2xl font-semibold font-instrumental-serif tracking-wide">
            {form.title}
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            {form.description && form.description.length > 20
              ? form.description.substring(0, 20) + "..."
              : form.description}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="hidden sm:flex" onClick={handleAddFormFields}>
            <HugeiconsIcon icon={PencilIcon} className="size-4" />
            Add fields
          </Button>

          {/* Share button — desktop only, opens QR dialog */}
          <Button
            variant="warning"
            className="hidden sm:flex"
            onClick={() => setQrOpen(true)}
            aria-label={`Share ${form.title}`}
          >
            <HugeiconsIcon icon={Share05Icon} className="size-4" />
            Share
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
              >
                <MoreHorizontal className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-card p-1.5">
              <div className="sm:hidden">
                <DropdownMenuItem className="w-full cursor-pointer" onSelect={handleAddFormFields}>
                  <HugeiconsIcon icon={PencilIcon} className="size-4" />
                  Add fields
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </div>
              <EditFormSheet
                form={form}
                trigger={
                  <DropdownMenuItem
                    className="w-full cursor-pointer"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <HugeiconsIcon icon={PencilIcon} className="size-4" />
                    Settings
                  </DropdownMenuItem>
                }
              />
              {/* Share QR — mobile only (desktop has the Share button) */}
              <div className="sm:hidden">
                <DropdownMenuItem
                  className="w-full cursor-pointer"
                  onSelect={(e) => {
                    e.preventDefault();
                    setQrOpen(true);
                  }}
                >
                  <HugeiconsIcon icon={QrCodeIcon} className="size-4" />
                  Share QR
                </DropdownMenuItem>
              </div>
              {!form.forkedFromTemplateId && (
                <>
                  <DropdownMenuSeparator />
                  {isSharedAsTemplate ? (
                    <DropdownMenuItem
                      className="w-full cursor-pointer"
                      disabled={unshareTemplateIsPending}
                      onSelect={(e) => {
                        e.preventDefault();
                        handleUnshareTemplate();
                      }}
                    >
                      <HugeiconsIcon icon={Share05Icon} className="size-4" />
                      Unshare template
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      className="w-full cursor-pointer"
                      disabled={shareAsTemplateIsPending}
                      onSelect={(e) => {
                        e.preventDefault();
                        handleShareAsTemplate();
                      }}
                    >
                      <HugeiconsIcon icon={Share05Icon} className="size-4" />
                      Publish template
                    </DropdownMenuItem>
                  )}
                </>
              )}
              <DropdownMenuSeparator />
              <DeleteFormDialog
                formId={form.id}
                formTitle={form.title}
                trigger={
                  <DropdownMenuItem
                    className="w-full cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <HugeiconsIcon icon={Trash2} className="size-4" />
                    Delete form
                  </DropdownMenuItem>
                }
              />
            </DropdownMenuContent>
          </DropdownMenu>
          <QrDialog
            formTitle={form.title}
            formSlug={form.slug}
            open={qrOpen}
            onOpenChange={setQrOpen}
          />
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
          {isSharedAsTemplate && (
            <Button className="border border-dashed" variant={"outline"} size="icon">
              <HugeiconsIcon icon={Share05Icon} className="text-violet-500" />
            </Button>
          )}
        </div>
        <div className="hidden lg:flex flex-col">
          <p className="text-xs text-muted-foreground">Created: {formatDate(form.createdAt)}</p>
          <p className="text-xs text-muted-foreground">Expiring: {formatDate(form.expiry)}</p>
        </div>
      </Link>
    </div>
  );
};
