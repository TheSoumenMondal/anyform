"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar01Icon,
  Note01Icon,
  LockKeyIcon,
  UserGroupIcon,
  PencilIcon,
} from "@hugeicons/core-free-icons";
import { useUpdateForm } from "~/hooks/api/form/use-update-form";
import { cn } from "~/lib/utils";
import type { RouterOutputs } from "@repo/trpc/client";

import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "~/components/ui/sheet";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "~/components/ui/input-group";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Calendar } from "~/components/ui/calendar";
import { Separator } from "~/components/ui/separator";

const DESCRIPTION_MAX_LENGTH = 300;

const getStartOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const getSuggestedExpiry = () => {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 30);
  expiry.setSeconds(0, 0);
  return expiry;
};

const isSameCalendarDay = (firstDate: Date, secondDate: Date) =>
  firstDate.getFullYear() === secondDate.getFullYear() &&
  firstDate.getMonth() === secondDate.getMonth() &&
  firstDate.getDate() === secondDate.getDate();

const mergeDateWithTime = (date: Date, timeSource?: Date) => {
  const nextDate = new Date(date);
  const nextTime = timeSource ?? getSuggestedExpiry();

  nextDate.setHours(nextTime.getHours(), nextTime.getMinutes(), 0, 0);

  if (nextDate <= new Date()) {
    return getSuggestedExpiry();
  }

  return nextDate;
};

const formSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters").max(255),
    description: z.string().max(DESCRIPTION_MAX_LENGTH).optional(),
    formType: z.enum(["single_step", "multi_step"]).default("single_step"),
    isPublic: z.boolean().default(false),
    isProtected: z.boolean().default(false),
    password: z.string().max(255).optional(),
    maxSubmissionLimit: z.number().int().min(1, "Limit must be at least 1").default(100),
    expiry: z.date({
      message: "Expiry date is required",
    }),
  })
  .refine((data) => data.expiry > new Date(), {
    message: "Expiry must be in the future",
    path: ["expiry"],
  })
  .refine((data) => !data.isProtected || (data.password && data.password.length > 0), {
    message: "Password is required when protected",
    path: ["password"],
  });

type FormInput = z.input<typeof formSchema>;
type FormOutput = z.infer<typeof formSchema>;
type UserForm = RouterOutputs["form"]["getFormsByUserId"][number];

type EditFormSheetProps = {
  form: UserForm;
};

export const EditFormSheet = ({ form: initialForm }: EditFormSheetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { updateForm, updateFormIsPending } = useUpdateForm();

  const form = useForm<FormInput, undefined, FormOutput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialForm.title,
      description: initialForm.description ?? "",
      formType: initialForm.formType,
      isPublic: initialForm.isPublic,
      isProtected: initialForm.isProtected,
      password: "",
      maxSubmissionLimit: initialForm.maxSubmissionLimit ?? 100,
      expiry: new Date(initialForm.expiry),
    },
  });

  const isProtected = form.watch("isProtected");

  const onSubmit = (values: FormOutput) => {
    if (!values.expiry) return;
    updateForm(
      {
        formId: initialForm.id,
        title: values.title,
        description: values.description,
        formType: values.formType,
        isPublic: values.isPublic,
        isProtected: values.isProtected,
        password: values.isProtected ? values.password : undefined,
        maxSubmissionLimit: values.maxSubmissionLimit,
        expiry: values.expiry.toISOString(),
      },
      {
        onSuccess: () => {
          toast.success("Success", {
            description: "Your form has been updated.",
            action: (
              <Button
                className="ml-auto"
                size="sm"
                type="button"
                variant="raised"
                onClick={() => toast.dismiss()}
              >
                Close
              </Button>
            ),
            style: {
              border: "1px solid var(--border)",
              borderStyle: "dashed",
            },
          });
          setIsOpen(false);
        },
        onError: (error) => {
          toast.error("Failed to update form", {
            description: error.message,
          });
        },
      },
    );
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          form.reset();
        }
      }}
    >
      <SheetTrigger asChild>
        <Button
          size="lg"
          animation="none"
          type="button"
          variant="info"
          aria-label={`Edit ${initialForm.title}`}
        >
          <HugeiconsIcon icon={PencilIcon} className="size-3.5" />
          Edit
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="sm:max-w-xl w-full flex flex-col p-0 gap-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="font-instrumental-serif text-3xl tracking-wide">
            Edit Form
          </SheetTitle>
          <SheetDescription className="font-sans text-sm">
            Update your form settings.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 min-h-0">
          <Form {...form}>
            <form
              id="edit-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <InputGroup>
                        <InputGroupAddon>
                          <HugeiconsIcon icon={Note01Icon} className="size-4" />
                        </InputGroupAddon>
                        <InputGroupInput placeholder="e.g. Contact Form" {...field} />
                      </InputGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <InputGroup>
                        <InputGroupTextarea
                          placeholder="Enter form description"
                          maxLength={DESCRIPTION_MAX_LENGTH}
                          {...field}
                        />
                        <InputGroupAddon align="block-end">
                          <InputGroupText className="text-xs text-muted-foreground">
                            {DESCRIPTION_MAX_LENGTH - (field.value?.length ?? 0)} characters left
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="formType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Form Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select form type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="single_step">Single Step</SelectItem>
                          <SelectItem value="multi_step">Multi Step</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxSubmissionLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Submission Limit</FormLabel>
                      <FormControl>
                        <InputGroup>
                          <InputGroupAddon>
                            <HugeiconsIcon icon={UserGroupIcon} className="size-4" />
                          </InputGroupAddon>
                          <InputGroupInput
                            type="number"
                            min={1}
                            placeholder="100"
                            name={field.name}
                            value={field.value}
                            onBlur={field.onBlur}
                            ref={field.ref}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === "" ? undefined : Number(e.target.value),
                              )
                            }
                          />
                        </InputGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="expiry"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Expiry Date & Time</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            size="lg"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            <HugeiconsIcon
                              icon={Calendar01Icon}
                              className="size-4 shrink-0 text-muted-foreground mr-2"
                            />
                            {field.value ? (
                              format(field.value, "PPP p")
                            ) : (
                              <span>Pick expiry date and time</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            if (!date) return;
                            field.onChange(mergeDateWithTime(date, field.value));
                          }}
                          disabled={(date) => date < getStartOfToday()}
                        />
                        <div className="p-3 border-t border-border">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Time</span>
                            <Input
                              type="time"
                              className="w-full"
                              value={field.value ? format(field.value, "HH:mm") : ""}
                              min={
                                field.value && isSameCalendarDay(field.value, new Date())
                                  ? format(new Date(), "HH:mm")
                                  : undefined
                              }
                              onChange={(e) => {
                                const time = e.target.value;
                                if (!time) return;
                                const [hours, minutes] = time.split(":");
                                if (hours && minutes) {
                                  const newDate = field.value
                                    ? new Date(field.value)
                                    : getSuggestedExpiry();
                                  newDate.setHours(
                                    parseInt(hours, 10),
                                    parseInt(minutes, 10),
                                    0,
                                    0,
                                  );
                                  field.onChange(newDate);
                                }
                              }}
                            />
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <FormLabel>Public</FormLabel>
                      <FormDescription className="text-xs">
                        Anyone can view this form
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isProtected"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <FormLabel>Password Protected</FormLabel>
                      <FormDescription className="text-xs">
                        Require a password to submit
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {isProtected && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <InputGroup>
                          <InputGroupAddon>
                            <HugeiconsIcon icon={LockKeyIcon} className="size-4" />
                          </InputGroupAddon>
                          <InputGroupInput
                            type="password"
                            placeholder="Enter new form password (or leave empty to keep current)"
                            {...field}
                          />
                        </InputGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </form>
          </Form>
        </div>

        <SheetFooter className="px-6 py-4 border-t shrink-0 gap-3 flex flex-col">
          <Button
            form="edit-form"
            variant="info"
            size="lg"
            type="submit"
            disabled={updateFormIsPending}
          >
            {updateFormIsPending ? "Saving..." : "Save Changes"}
          </Button>
          <SheetClose asChild>
            <Button variant="secondary" size="lg" type="button">
              Cancel
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
