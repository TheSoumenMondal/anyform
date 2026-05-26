"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useForm, FormProvider, Controller, type Control, type FieldValues } from "react-hook-form";
import GamingCard from "./Card";
import GamingButton from "./Button";
import GamingInput from "./Input";
import GamingCheckbox from "./Checkbox";
import { RadioGroup, RadioGroupItem } from "./RadioGroup";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./Select";
import GamingSlider from "./Slider";
import GamingTextarea from "./Textarea";
import GamingRating from "./Rating";
import { usePublicFormBySlug } from "~/hooks/api/form/use-public-form-by-slug";
import { usePublicFormFields } from "~/hooks/api/form/use-public-form-fields";
import { useSubmitFormResponse } from "~/hooks/api/form/use-submit-form-response";
import { Skeleton } from "~/components/ui/skeleton";
import { toast } from "sonner";
import { CheckCircleIcon } from "lucide-react";
import { trpc } from "~/trpc/client";

type FormFieldOption = {
  label: string;
  value: string;
};

type FormFieldValidation = {
  min?: number;
  max?: number;
  step?: number;
};

type FormField = {
  id: string;
  label: string;
  labelKey: string;
  description: string | null;
  placeholder: string | null;
  fieldType: string;
  isRequired: boolean;
  sortOrder: number;
  stepNumber: number | null;
  options?: FormFieldOption[];
  validation?: FormFieldValidation;
};

type GameThemeProps = {
  slug: string;
};

const SuccessDisplay = ({ title, message }: { title: string; message: string }) => (
  <div className="w-full min-h-screen relative overflow-hidden flex items-center justify-center p-8">
    <div className="fixed inset-0 -z-10">
      <Image
        src="/theme/game/game-desktop.jpg"
        alt="Game Theme Background"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/60" />
    </div>
    <GamingCard className="w-full max-w-md p-8 text-center">
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-[#3de03d] border-4 border-[#1e1e1e] shadow-[4px_4px_0px_#1e1e1e]">
          <CheckCircleIcon className="size-12 text-white" />
        </div>
      </div>
      <h1 className="text-3xl font-bold text-[#3de03d] [text-shadow:2px_2px_0px_#ffffff] uppercase tracking-widest mb-4">
        {title}
      </h1>
      <p className="text-[#4e4e4e] font-bold uppercase text-sm mb-6">{message}</p>
      <GamingButton variant="success" onClick={() => window.location.reload()}>
        New Game
      </GamingButton>
    </GamingCard>
  </div>
);

const ErrorDisplay = ({ title, message }: { title: string; message: string }) => (
  <div className="w-full min-h-screen relative overflow-hidden flex items-center justify-center p-8">
    <div className="fixed inset-0 -z-10">
      <Image
        src="/theme/game/game-desktop.jpg"
        alt="Game Theme Background"
        fill
        className="object-cover grayscale"
        priority
      />
      <div className="absolute inset-0 bg-black/60" />
    </div>
    <GamingCard className="w-full max-w-md p-8 text-center">
      <h1 className="text-3xl font-bold text-red-600 [text-shadow:2px_2px_0px_#ffffff] uppercase tracking-widest mb-4">
        {title}
      </h1>
      <p className="text-[#4e4e4e] font-bold uppercase text-sm mb-6">{message}</p>
      <GamingButton variant="danger" onClick={() => (window.location.href = "/")}>
        Exit to Menu
      </GamingButton>
    </GamingCard>
  </div>
);

const PasswordPrompt = ({ formId, onSuccess }: { formId: string; onSuccess: () => void }) => {
  const [password, setPassword] = useState("");
  const verifyMutation = trpc.form.verifyFormPassword.useMutation({
    onSuccess: () => {
      toast.success("Form unlocked successfully!");
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.message || "Incorrect password");
    },
  });

  return (
    <div className="w-full min-h-screen relative overflow-hidden flex items-center justify-center p-8">
      <div className="fixed inset-0 -z-10">
        <Image
          src="/theme/game/game-desktop.jpg"
          alt="Game Theme Background"
          fill
          className="object-cover grayscale"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <GamingCard className="w-full max-w-md p-8 text-center">
        <h1 className="text-3xl font-bold text-[#ffae42] [text-shadow:2px_2px_0px_#ffffff] uppercase tracking-widest mb-4">
          Restricted Area
        </h1>
        <p className="text-[#4e4e4e] font-bold uppercase text-sm mb-6">
          Enter password to unlock this form.
        </p>
        <div className="flex flex-col gap-4">
          <GamingInput
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                verifyMutation.mutate({ formId, password });
              }
            }}
          />
          <GamingButton
            variant="default"
            onClick={() => verifyMutation.mutate({ formId, password })}
            disabled={verifyMutation.isPending || !password}
          >
            {verifyMutation.isPending ? "Unlocking..." : "Unlock"}
          </GamingButton>
        </div>
      </GamingCard>
    </div>
  );
};

const GameTheme = ({ slug }: GameThemeProps) => {
  const { form, formIsLoading, formIsError } = usePublicFormBySlug(slug);
  const { formFields, formFieldsIsLoading, formFieldsError, formFieldsIsError, refetchFormFields } =
    usePublicFormFields(form?.id || "");
  const {
    submitFormResponseAsync,
    submitFormResponseIsPending,
    submitFormResponseIsSuccess,
    createDraftSubmissionAsync,
  } = useSubmitFormResponse();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Determine if form is protected and currently unauthorized
  const isUnauthorized =
    form?.isProtected &&
    (formFieldsError as { data?: { code?: string } })?.data?.code === "UNAUTHORIZED";
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);

  // Safely check if we have full access to the form
  const hasAccess =
    !form?.isProtected || isPasswordVerified || (!formFieldsIsError && !formFieldsIsLoading);

  useEffect(() => {
    if (form?.id && !submissionId && hasAccess) {
      createDraftSubmissionAsync({ formId: form.id })
        .then((res) => setSubmissionId(res.submissionId))
        .catch((err) => console.error("Failed to create draft submission:", err));
    }
  }, [form?.id, createDraftSubmissionAsync, submissionId, hasAccess]);

  const methods = useForm();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  if (isUnauthorized && !isPasswordVerified) {
    return (
      <PasswordPrompt
        formId={form.id}
        onSuccess={() => {
          setIsPasswordVerified(true);
          refetchFormFields?.();
        }}
      />
    );
  }

  if (formIsLoading || (formFieldsIsLoading && !isUnauthorized)) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center p-8 bg-[#1e1e1e]">
        <GamingCard className="w-full max-w-xl p-8">
          <div className="flex flex-col gap-6">
            <Skeleton className="h-10 w-3/4 mx-auto bg-neutral-700" />
            <Skeleton className="h-6 w-1/2 mx-auto bg-neutral-700" />
            <div className="space-y-4">
              <Skeleton className="h-20 w-full bg-neutral-700" />
              <Skeleton className="h-20 w-full bg-neutral-700" />
              <Skeleton className="h-20 w-full bg-neutral-700" />
            </div>
          </div>
        </GamingCard>
      </div>
    );
  }

  if (formIsError || !form) {
    return (
      <ErrorDisplay
        title="Level Not Found"
        message="The world you are looking for does not exist or has been deleted."
      />
    );
  }

  if (submitFormResponseIsSuccess) {
    return (
      <SuccessDisplay
        title="Mission Accomplished"
        message="Your response has been saved to the database. Great job, player!"
      />
    );
  }

  const isExpired = form.expiry && new Date(form.expiry) < new Date();
  if (isExpired) {
    return (
      <ErrorDisplay
        title="Mission Expired"
        message="This form has reached its expiry date and is no longer accepting submissions."
      />
    );
  }

  if (form.formStatus !== "published") {
    return (
      <ErrorDisplay
        title="Not Published"
        message="This form is currently not published and cannot accept submissions."
      />
    );
  }

  const isMultiStep = form.formType === "multi_step";
  const fieldsByStep = isMultiStep
    ? (formFields as FormField[]).reduce((acc: Record<string, FormField[]>, field) => {
        const step = String(field.stepNumber || 1);
        if (!acc[step]) acc[step] = [];
        acc[step].push(field);
        return acc;
      }, {})
    : { "1": formFields as FormField[] };

  // Only include steps that have at least one field
  const steps = Object.keys(fieldsByStep)
    .filter((s) => (fieldsByStep[s]?.length ?? 0) > 0)
    .sort((a, b) => Number(a) - Number(b));
  const maxSteps = steps.length;
  const currentFields = fieldsByStep[steps[currentStepIndex] ?? "1"] || [];

  const onSubmit = async (data: Record<string, unknown>) => {
    // Safety Guard: If user somehow triggers submit on intermediate levels,
    // we redirect them to the next level instead of submitting.
    if (isMultiStep && currentStepIndex < maxSteps - 1) {
      await nextStep();
      return;
    }

    try {
      await submitFormResponseAsync({
        formId: form.id,
        responses: data,
        submissionId: submissionId || undefined,
      });
      toast.success("Form submitted successfully!");
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit form. Please try again.");
    }
  };

  const nextStep = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (isTransitioning) return;

    setIsTransitioning(true);
    try {
      const isStepValid = await methods.trigger(currentFields.map((f) => f.labelKey));
      if (isStepValid && currentStepIndex < maxSteps - 1) {
        setCurrentStepIndex(currentStepIndex + 1);
      }
    } finally {
      setIsTransitioning(false);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  return (
    <div className="w-full min-h-screen relative overflow-hidden flex items-center justify-center p-8">
      <div className="fixed inset-0 -z-10">
        <Image
          src="/theme/game/game-desktop.jpg"
          alt="Game Theme Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <GamingCard className="w-full max-w-xl">
        <div className="max-h-[80vh] overflow-y-auto custom-scrollbar p-2">
          <div className="flex flex-col gap-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-[#373737] [text-shadow:2px_2px_0px_#ffffff] uppercase tracking-[0.2em]">
                {form.title}
              </h1>
              {form.description && (
                <p className="mt-2 text-[#4e4e4e] font-medium text-sm">{form.description}</p>
              )}
              {isMultiStep && maxSteps > 1 && (
                <div className="mt-6 flex flex-col items-center gap-3">
                  <div className="flex w-full max-w-xs items-center gap-1.5 px-2">
                    {steps.map((_, index) => (
                      <div
                        key={index}
                        className={`h-2.5 flex-1 border-2 border-[#1e1e1e] shadow-[1px_1px_0px_0px_rgba(255,255,255,0.2)] ${
                          index <= currentStepIndex ? "bg-[#3de03d]" : "bg-[#313131]"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-black text-[#4e4e4e] uppercase tracking-[0.2em]">
                    Level {currentStepIndex + 1} of {maxSteps}
                  </span>
                </div>
              )}
            </div>

            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-6"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
                    if (isMultiStep && currentStepIndex < maxSteps - 1) {
                      nextStep(e as unknown as React.MouseEvent);
                    } else {
                      // Do not prevent default if on last step, let it submit
                    }
                  }
                }}
              >
                {currentFields
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((field) => (
                    <div key={field.id} className="flex flex-col gap-3">
                      <label className="text-xs font-bold text-[#4e4e4e] uppercase tracking-wider flex items-center gap-2">
                        {field.label}
                        {field.isRequired && <span className="text-red-600">*</span>}
                      </label>
                      <FormFieldRenderer field={field} control={control} />
                      {errors[field.labelKey] && (
                        <p className="text-xs font-bold text-red-600 uppercase">
                          {errors[field.labelKey]?.message as string}
                        </p>
                      )}
                    </div>
                  ))}

                <div className="flex justify-between gap-4 mt-6">
                  {isMultiStep && currentStepIndex > 0 && (
                    <GamingButton type="button" variant="danger" onClick={prevStep}>
                      Previous
                    </GamingButton>
                  )}
                  <div className="flex-1" />
                  {isMultiStep && currentStepIndex < maxSteps - 1 ? (
                    <GamingButton
                      type="button"
                      variant="success"
                      className="min-w-[120px]"
                      onClick={(e) => nextStep(e)}
                      disabled={isTransitioning}
                    >
                      {isTransitioning ? "Loading..." : "Next Level"}
                    </GamingButton>
                  ) : (
                    <GamingButton
                      type="submit"
                      variant="success"
                      className="min-w-[120px]"
                      disabled={submitFormResponseIsPending || isTransitioning}
                    >
                      {submitFormResponseIsPending ? "Submitting..." : "Submit"}
                    </GamingButton>
                  )}
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </GamingCard>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `,
        }}
      />
    </div>
  );
};

const FormFieldRenderer = ({
  field,
  control,
}: {
  field: FormField;
  control: Control<FieldValues>;
}) => {
  const options =
    field.options && field.options.length > 0
      ? field.options
      : [
          { label: "Option 1", value: "option-1" },
          { label: "Option 2", value: "option-2" },
        ];

  switch (field.fieldType) {
    case "short_text":
    case "email":
    case "phone":
    case "url":
    case "number":
    case "date":
    case "time":
    case "datetime-local":
      return (
        <Controller
          name={field.labelKey}
          control={control}
          rules={{ required: field.isRequired ? "This field is required" : false }}
          render={({ field: { onChange, value } }) => (
            <GamingInput
              type={
                field.fieldType === "number"
                  ? "number"
                  : field.fieldType === "date"
                    ? "date"
                    : field.fieldType === "time"
                      ? "time"
                      : field.fieldType === "datetime-local"
                        ? "datetime-local"
                        : "text"
              }
              placeholder={field.placeholder || "Enter value..."}
              onChange={onChange}
              value={(value as string) || ""}
              className={
                field.fieldType === "date" ||
                field.fieldType === "time" ||
                field.fieldType === "datetime-local"
                  ? "scheme-dark"
                  : ""
              }
            />
          )}
        />
      );

    case "long_text":
      return (
        <Controller
          name={field.labelKey}
          control={control}
          rules={{ required: field.isRequired ? "This field is required" : false }}
          render={({ field: { onChange, value } }) => (
            <GamingTextarea
              placeholder={field.placeholder || "Describe..."}
              onChange={onChange}
              value={(value as string) || ""}
            />
          )}
        />
      );

    case "select":
      return (
        <Controller
          name={field.labelKey}
          control={control}
          rules={{ required: field.isRequired ? "This field is required" : false }}
          render={({ field: { onChange, value } }) => (
            <Select onValueChange={onChange} value={value as string}>
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder || "Select mode"} />
              </SelectTrigger>
              <SelectContent>
                {options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      );

    case "radio":
      return (
        <Controller
          name={field.labelKey}
          control={control}
          rules={{ required: field.isRequired ? "This field is required" : false }}
          render={({ field: { onChange, value } }) => (
            <RadioGroup onValueChange={onChange} value={value as string}>
              <div className="flex flex-col gap-3">
                {options.map((opt, index: number) => (
                  <div key={opt.value} className="flex items-center gap-3">
                    <RadioGroupItem value={opt.value} id={`${field.id}-${index}`} />
                    <label
                      htmlFor={`${field.id}-${index}`}
                      className="text-sm font-medium text-[#373737]"
                    >
                      {opt.label}
                    </label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}
        />
      );

    case "checkbox":
    case "boolean":
      return (
        <Controller
          name={field.labelKey}
          control={control}
          rules={{ required: field.isRequired ? "This field is required" : false }}
          render={({ field: { onChange, value } }) => (
            <div className="flex items-center gap-3">
              <GamingCheckbox id={field.id} onCheckedChange={onChange} checked={!!value} />
              <label htmlFor={field.id} className="text-sm font-medium text-[#373737]">
                {field.placeholder || "Enable"}
              </label>
            </div>
          )}
        />
      );

    case "slider":
      return (
        <Controller
          name={field.labelKey}
          control={control}
          rules={{ required: field.isRequired ? "This field is required" : false }}
          render={({ field: { onChange, value } }) => (
            <GamingSlider
              defaultValue={[field.validation?.min || 0]}
              max={field.validation?.max || 100}
              step={field.validation?.step || 1}
              onValueChange={(vals) => onChange(vals[0])}
              value={value !== undefined ? [value as number] : undefined}
            />
          )}
        />
      );

    case "rating":
      return (
        <Controller
          name={field.labelKey}
          control={control}
          rules={{ required: field.isRequired ? "This field is required" : false }}
          render={({ field: { onChange, value } }) => (
            <GamingRating
              max={field.validation?.max || 5}
              onChange={onChange}
              value={value as number}
            />
          )}
        />
      );

    default:
      return (
        <div className="p-4 border-2 border-dashed border-red-500 text-red-500 text-xs font-bold uppercase">
          Unsupported Field Type: {field.fieldType}
        </div>
      );
  }
};

export default GameTheme;
