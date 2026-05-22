"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Calendar01Icon,
  Note01Icon,
  LockKeyIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { useCreateForm } from "~/hooks/api/form/use-create-form";
import { cn } from "~/lib/utils";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "~/components/ui/dialog";
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

export const CreateFormDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { createForm, createFormIsPending } = useCreateForm();

  const form = useForm<FormInput, undefined, FormOutput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      formType: "single_step",
      isPublic: false,
      isProtected: false,
      password: "",
      maxSubmissionLimit: 100,
    },
  });

  const isProtected = form.watch("isProtected");

  const onSubmit = (values: FormOutput) => {
    if (!values.expiry) return;
    createForm(
      {
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
            description: "Your form has been created.",
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
          setIsDialogOpen(false);
          form.reset();
        },
        onError: (error) => {
          toast.error("Failed to create form", {
            description: error.message,
          });
        },
      },
    );
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          form.reset();
        }
      }}
    >
      <DialogTrigger
        render={
          <Button variant="info" size="lg">
            <HugeiconsIcon icon={Add01Icon} className="size-3.5 shrink-0" />
            New Form
          </Button>
        }
      />
      <DialogPopup
        animationPreset="scale"
        transitionPreset="outCubic"
        className="sm:max-w-2xl"
        containerClassName="max-h-[calc(100dvh-2rem)] min-h-0 gap-6 sm:max-w-2xl"
      >
        <DialogHeader>
          <DialogTitle>Create New Form</DialogTitle>
          <DialogDescription>Configure your form settings to get started.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
            <div className="flex px-1 min-h-0 w-full min-w-0 flex-1 flex-col gap-4 overflow-y-auto overflow-x-hidden pr-1 pb-1">
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
                            min={100}
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
                            placeholder="Enter form password"
                            {...field}
                          />
                        </InputGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <DialogFooter className="shrink-0 mt-3">
              <DialogClose
                render={
                  <Button variant="ghost" size="default" type="button">
                    Cancel
                  </Button>
                }
              />
              <Button variant="default" size="default" type="submit" disabled={createFormIsPending}>
                {createFormIsPending ? "Creating..." : "Create Form"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogPopup>
    </Dialog>
  );
};
