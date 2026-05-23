"use client";

import { useState } from "react";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Trash2 } from "@hugeicons/core-free-icons";

import useDeleteForm from "~/hooks/api/form/use-delete-form";
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
import Image from "next/image";

type DeleteFormDialogProps = {
  formId: string;
  formTitle: string;
};

export const DeleteFormDialog = ({ formId, formTitle }: DeleteFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const { deleteForm, deleteFormIsPending } = useDeleteForm();

  const handleDelete = () => {
    deleteForm(
      { formId },
      {
        onSuccess: () => {
          toast.success("Form deleted", {
            description: `Form deleted successfully`,
          });
          setOpen(false);
        },
        onError: (error) => {
          toast.error("Failed to delete form", {
            description: error.message,
          });
        },
      },
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          animation="none"
          type="button"
          size="lg"
          variant="destructive"
          aria-label={`Delete ${formTitle}`}
        >
          <HugeiconsIcon icon={Trash2} className="size-3.5" />
          Delete
        </Button>
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
          <AlertDialogCancel disabled={deleteFormIsPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive", size: "lg", animation: "none" })}
            disabled={deleteFormIsPending}
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
          >
            {deleteFormIsPending ? (
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
