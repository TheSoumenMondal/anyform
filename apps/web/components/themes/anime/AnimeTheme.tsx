"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider, Controller, type Control, type FieldValues } from "react-hook-form";
import AnimeCard from "./Card";
import AnimeButton from "./Button";
import AnimeInput from "./Input";
import AnimeCheckbox from "./Checkbox";
import { RadioGroup, RadioGroupItem } from "./RadioGroup";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./Select";
import AnimeSlider from "./Slider";
import AnimeTextarea from "./Textarea";
import AnimeRating from "./Rating";
import { usePublicFormBySlug } from "~/hooks/api/form/use-public-form-by-slug";
import { usePublicFormFields } from "~/hooks/api/form/use-public-form-fields";
import { useSubmitFormResponse } from "~/hooks/api/form/use-submit-form-response";
import { Skeleton } from "~/components/ui/skeleton";
import { toast } from "sonner";
import { HeartIcon } from "lucide-react";
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

type AnimeThemeProps = {
  slug: string;
};

const SuccessDisplay = ({ title, message }: { title: string; message: string }) => (
  <div
    className="w-full min-h-screen relative overflow-hidden flex items-center justify-center p-2 sm:p-8 font-sans bg-[#11100f] bg-cover bg-center bg-no-repeat bg-fixed"
    style={{ backgroundImage: "url('/theme/anime/anime-desktop.png')" }}
  >
    <AnimeCard className="w-full max-w-md p-4 sm:p-8 text-center">
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-[#c41e3a]/10 rounded-none shadow-[0_0_15px_rgba(196,30,58,0.2)]">
          <HeartIcon className="size-12 text-[#c41e3a] fill-[#c41e3a]" />
        </div>
      </div>
      <h1 className="text-3xl font-serif text-white tracking-wide mb-4">{title}</h1>
      <p className="text-gray-400 font-medium text-sm mb-6">{message}</p>
      <AnimeButton variant="success" onClick={() => window.location.reload()}>
        Submit Another
      </AnimeButton>
    </AnimeCard>
  </div>
);

const ErrorDisplay = ({ title, message }: { title: string; message: string }) => (
  <div
    className="w-full min-h-screen relative overflow-hidden flex items-center justify-center p-2 sm:p-8 font-sans bg-[#11100f] bg-cover bg-center bg-no-repeat bg-fixed"
    style={{ backgroundImage: "url('/theme/anime/anime-desktop.png')" }}
  >
    <AnimeCard className="w-full max-w-md p-4 sm:p-8 text-center">
      <h1 className="text-3xl font-serif text-red-500 tracking-wide mb-4">{title}</h1>
      <p className="text-gray-400 font-medium text-sm mb-6">{message}</p>
      <AnimeButton variant="danger" onClick={() => (window.location.href = "/")}>
        Return Home
      </AnimeButton>
    </AnimeCard>
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
    <div
      className="w-full min-h-screen relative overflow-hidden flex items-center justify-center p-2 sm:p-8 font-sans bg-[#11100f] bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "url('/theme/anime/anime-desktop.png')" }}
    >
      <AnimeCard className="w-full max-w-md p-4 sm:p-8 text-center">
        <h1 className="text-3xl font-serif text-white tracking-wide mb-4">Secret Area</h1>
        <p className="text-gray-400 font-medium text-sm mb-6">
          Enter password to unlock this magical form.
        </p>
        <div className="flex flex-col gap-4">
          <AnimeInput
            type="password"
            placeholder="Enter Password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <AnimeButton
            onClick={() => verifyMutation.mutate({ formId, password })}
            disabled={verifyMutation.isPending}
          >
            {verifyMutation.isPending ? "Unlocking..." : "Unlock Form"}
          </AnimeButton>
        </div>
      </AnimeCard>
    </div>
  );
};

const AnimeTheme = ({ slug }: AnimeThemeProps) => {
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
      <div
        className="w-full min-h-screen flex items-center justify-center p-2 sm:p-8 bg-[#11100f] bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ backgroundImage: "url('/theme/anime/anime-desktop.png')" }}
      >
        <AnimeCard className="w-full max-w-xl p-4 sm:p-8">
          <div className="flex flex-col gap-6">
            <Skeleton className="h-10 w-3/4 mx-auto bg-white/10" />
            <Skeleton className="h-6 w-1/2 mx-auto bg-white/10" />
            <div className="space-y-4">
              <Skeleton className="h-20 w-full bg-white/5" />
              <Skeleton className="h-20 w-full bg-white/5" />
              <Skeleton className="h-20 w-full bg-white/5" />
            </div>
          </div>
        </AnimeCard>
      </div>
    );
  }

  if (formIsError || !form) {
    return (
      <ErrorDisplay
        title="Form Not Found"
        message="The page you are looking for does not exist or has been deleted."
      />
    );
  }

  if (submitFormResponseIsSuccess) {
    return (
      <SuccessDisplay
        title="Mission Accomplished!"
        message="Your response has been magically saved. Thank you!"
      />
    );
  }

  const isExpired = form.expiry && new Date(form.expiry) < new Date();
  if (isExpired) {
    return (
      <ErrorDisplay
        title="Time's Up!"
        message="This form has reached its expiry date and is no longer accepting submissions."
      />
    );
  }

  if (form.formStatus !== "published") {
    return (
      <ErrorDisplay
        title="Not Available"
        message="This form is currently resting and cannot accept submissions."
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
    <div
      className="w-full min-h-screen relative overflow-hidden flex items-center justify-center p-2 sm:p-8 font-sans bg-[#11100f] bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "url('/theme/anime/anime-desktop.png')" }}
    >
      <AnimeCard className="w-full max-w-xl">
        <div className="max-h-[80vh] overflow-y-auto scrollbar-hide p-2 sm:p-4">
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <h1 className="text-4xl font-serif text-white tracking-tight leading-tight">
                {form.title}
              </h1>
              {form.description && (
                <p className="mt-4 text-gray-400 font-medium text-sm max-w-md mx-auto">
                  {form.description}
                </p>
              )}
              {isMultiStep && maxSteps > 1 && (
                <div className="mt-8 flex flex-col items-center gap-3">
                  <div className="flex w-full max-w-xs items-center gap-2 px-2">
                    {steps.map((_, index) => (
                      <div
                        key={index}
                        className={`h-1.5 flex-1 rounded-none transition-all duration-300 ${
                          index <= currentStepIndex ? "bg-[#c41e3a]" : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    Step {currentStepIndex + 1} of {maxSteps}
                  </span>
                </div>
              )}
            </div>

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                <div className="flex flex-col gap-6">
                  {currentFields.map((field) => (
                    <div key={field.id} className="flex flex-col gap-3">
                      <label className="text-sm font-semibold text-gray-300 ml-1">
                        {field.label}
                        {field.isRequired && <span className="text-[#c41e3a] ml-1">*</span>}
                      </label>
                      <FormFieldRenderer field={field} control={control} />
                      {errors[field.labelKey] && (
                        <p className="text-xs font-medium text-red-400 ml-1">
                          {errors[field.labelKey]?.message as string}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between gap-4 mt-8 pt-4 border-t border-white/5">
                  {isMultiStep && currentStepIndex > 0 && (
                    <AnimeButton
                      type="button"
                      variant="default"
                      onClick={prevStep}
                      className="bg-white/5 hover:bg-white/10 text-white border border-white/10"
                    >
                      Back
                    </AnimeButton>
                  )}
                  <div className="flex-1" />
                  {isMultiStep && currentStepIndex < maxSteps - 1 ? (
                    <AnimeButton
                      type="button"
                      variant="success"
                      className="min-w-35"
                      onClick={(e) => nextStep(e)}
                      disabled={isTransitioning}
                    >
                      {isTransitioning ? "Loading..." : "Next Step"}
                    </AnimeButton>
                  ) : (
                    <AnimeButton
                      type="submit"
                      variant="success"
                      className="min-w-35"
                      disabled={submitFormResponseIsPending || isTransitioning}
                    >
                      {submitFormResponseIsPending ? "Sending..." : "Submit Response"}
                    </AnimeButton>
                  )}
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </AnimeCard>
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
            <AnimeInput
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
            <AnimeTextarea
              placeholder={field.placeholder || "Type here..."}
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
                <SelectValue placeholder={field.placeholder || "Select option"} />
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
                      className="text-sm font-medium text-gray-300"
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
              <AnimeCheckbox id={field.id} onCheckedChange={onChange} checked={!!value} />
              <label htmlFor={field.id} className="text-sm font-medium text-gray-300">
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
            <AnimeSlider
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
            <AnimeRating
              max={field.validation?.max || 5}
              onChange={onChange}
              value={value as number}
            />
          )}
        />
      );

    default:
      return (
        <div className="p-4 border border-red-900/50 bg-red-900/10 text-red-500 text-xs font-bold uppercase rounded-none">
          Unsupported Field Type: {field.fieldType}
        </div>
      );
  }
};

export default AnimeTheme;
