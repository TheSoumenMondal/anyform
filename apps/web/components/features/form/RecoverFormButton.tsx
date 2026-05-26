"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { RotateLeft02Icon } from "@hugeicons/core-free-icons";

import useRecoverForm from "~/hooks/api/form/use-recover-form";
import { Button, buttonVariants } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "~/components/ui/alert-dialog";

type RecoverFormButtonProps = {
  formId: string;
  formTitle: string;
};

export const RecoverFormButton = ({ formId, formTitle }: RecoverFormButtonProps) => {
  const [open, setOpen] = useState(false);
  const { recoverForm, recoverFormIsPending } = useRecoverForm();

  const handleRecover = () => {
    recoverForm(
      { formId },
      {
        onSuccess: () => {
          toast.success("Form recovered", {
            description: `${formTitle} moved back to drafts.`,
          });
        },
        onError: (error) => {
          toast.error("Failed to recover form", {
            description: error.message,
          });
        },
      },
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="success" size="sm" animation="none" disabled={recoverFormIsPending}>
          <HugeiconsIcon icon={RotateLeft02Icon} className="size-3.5" />
          Recover
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-sm">
        <AlertDialogHeader>
          <div className="relative h-40 w-full mb-4 sm:h-56">
            <Image
              src="/images/restore.png"
              alt="Recover illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
          <AlertDialogTitle className="text-3xl font-instrumental-serif flex items-center justify-center text-center">
            Recover {formTitle}?
          </AlertDialogTitle>
          <AlertDialogDescription className="flex items-center justify-center text-center">
            This will move the form back to drafts so it becomes active again.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={recoverFormIsPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "success", size: "default", animation: "none" })}
            disabled={recoverFormIsPending}
            onClick={(e) => {
              e.preventDefault();
              handleRecover();
            }}
          >
            {recoverFormIsPending ? (
              <>
                <Spinner className="size-3.5" />
                Recovering…
              </>
            ) : (
              "Recover form"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
