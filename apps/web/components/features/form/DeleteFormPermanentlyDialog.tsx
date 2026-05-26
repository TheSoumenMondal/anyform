"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Trash2 } from "@hugeicons/core-free-icons";

import useDeleteFormPermanently from "~/hooks/api/form/use-delete-form-permanently";
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

type DeleteFormPermanentlyDialogProps = {
  formId: string;
  formTitle: string;
  trigger?: React.ReactElement;
};

export const DeleteFormPermanentlyDialog = ({
  formId,
  formTitle,
  trigger,
}: DeleteFormPermanentlyDialogProps) => {
  const [open, setOpen] = useState(false);
  const { deleteFormPermanently, deleteFormPermanentlyIsPending } = useDeleteFormPermanently();

  const handleDeletePermanently = () => {
    deleteFormPermanently(
      { formId },
      {
        onSuccess: () => {
          toast.success("Form permanently deleted", {
            description: `${formTitle} was removed from trash.`,
          });
          setOpen(false);
        },
        onError: (error) => {
          toast.error("Failed to permanently delete form", {
            description: error.message,
          });
        },
      },
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger || (
          <Button
            animation="none"
            type="button"
            size="icon"
            variant="destructive"
            aria-label={`Permanently delete ${formTitle}`}
          >
            <HugeiconsIcon icon={Trash2} className="size-3.5" />
          </Button>
        )}
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-sm">
        <AlertDialogHeader>
          <div className="relative h-40 w-full mb-4 sm:h-56">
            <Image
              src="/images/delete_illustration.png"
              alt="Delete illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
          <AlertDialogTitle className="text-3xl font-instrumental-serif flex items-center justify-center text-center">
            Delete {formTitle}?
          </AlertDialogTitle>
          <AlertDialogDescription className="flex items-center justify-center text-center">
            This action cannot be undone. The form and all its submissions will be permanently
            deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteFormPermanentlyIsPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({
              variant: "destructive",
              size: "default",
              animation: "none",
            })}
            disabled={deleteFormPermanentlyIsPending}
            onClick={(e) => {
              e.preventDefault();
              handleDeletePermanently();
            }}
          >
            {deleteFormPermanentlyIsPending ? (
              <>
                <Spinner className="size-3.5" />
                Deleting…
              </>
            ) : (
              "Delete form"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
