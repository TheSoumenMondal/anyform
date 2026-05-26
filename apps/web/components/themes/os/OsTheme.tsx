"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider, Controller, type Control, type FieldValues } from "react-hook-form";
import OsCard from "./Card";
import OsButton from "./Button";
import OsInput from "./Input";
import OsCheckbox from "./Checkbox";
import { RadioGroup, RadioGroupItem } from "./RadioGroup";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./Select";
import OsSlider from "./Slider";
import OsTextarea from "./Textarea";
import OsRating from "./Rating";
import { usePublicFormBySlug } from "~/hooks/api/form/use-public-form-by-slug";
import { usePublicFormFields } from "~/hooks/api/form/use-public-form-fields";
import { useSubmitFormResponse } from "~/hooks/api/form/use-submit-form-response";
import { Skeleton } from "~/components/ui/skeleton";
import { toast } from "sonner";
import { CheckCircle2, XCircle } from "lucide-react";
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

type OsThemeProps = {
  slug: string;
};

const SuccessDisplay = ({ title, message }: { title: string; message: string }) => (
  <div
    className="w-full min-h-screen relative overflow-hidden flex items-center justify-center p-4 sm:p-8 font-sans bg-cover bg-center bg-no-repeat bg-fixed"
    style={{ backgroundImage: "url('/theme/os/os-deaktop.jpg')" }}
  >
    <OsCard className="w-full max-w-sm text-center" title="System Alert">
      <div className="flex flex-col items-center justify-center p-8 gap-4">
        <CheckCircle2 className="size-16 text-[#27C93F]" />
        <h1 className="text-xl font-medium text-gray-900 dark:text-white tracking-wide">{title}</h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{message}</p>
        <OsButton variant="default" onClick={() => window.location.reload()} className="w-full">
          OK
        </OsButton>
      </div>
    </OsCard>
  </div>
);

const ErrorDisplay = ({ title, message }: { title: string; message: string }) => (
  <div
    className="w-full min-h-screen relative overflow-hidden flex items-center justify-center p-4 sm:p-8 font-sans bg-cover bg-center bg-no-repeat bg-fixed"
    style={{ backgroundImage: "url('/theme/os/os-deaktop.jpg')" }}
  >
    <OsCard className="w-full max-w-sm text-center" title="System Error">
      <div className="flex flex-col items-center justify-center p-8 gap-4">
        <XCircle className="size-16 text-[#FF5F56]" />
        <h1 className="text-xl font-medium text-gray-900 dark:text-white tracking-wide">{title}</h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{message}</p>
        <OsButton variant="default" onClick={() => (window.location.href = "/")} className="w-full">
          OK
        </OsButton>
      </div>
    </OsCard>
  </div>
);

const PasswordPrompt = ({ formId, onSuccess }: { formId: string; onSuccess: () => void }) => {
  const [password, setPassword] = useState("");
  const verifyMutation = trpc.form.verifyFormPassword.useMutation({
    onSuccess: () => {
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.message || "Incorrect password");
    },
  });

  return (
    <div
      className="w-full min-h-screen relative overflow-hidden flex items-center justify-center font-sans bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "url('/theme/os/os-deaktop.jpg')" }}
    >
      <div className="absolute inset-0 backdrop-blur-xl bg-black/20" />

      <div className="relative z-10 flex flex-col items-center gap-5">
        <div className="size-24 rounded-full overflow-hidden shadow-2xl bg-white/10 p-0.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
            alt="User Avatar"
            className="w-full h-full object-cover rounded-full bg-white/20"
          />
        </div>
        <h1 className="text-2xl font-semibold text-white tracking-wide drop-shadow-md">
          Administrator
        </h1>
        <div className="flex flex-col gap-3 items-center">
          <div className="relative flex items-center w-56">
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") verifyMutation.mutate({ formId, password });
              }}
              className="w-full bg-white/20 backdrop-blur-md border border-white/30 rounded-full pl-4 pr-10 py-1.5 text-white placeholder-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 transition-all shadow-sm"
              autoFocus
            />
            {verifyMutation.isPending && (
              <div className="absolute right-3">
                <div className="w-3 h-3 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          <p className="text-[11px] text-white/80 font-medium">Touch ID or Enter Password</p>
        </div>
      </div>
    </div>
  );
};

const OsTheme = ({ slug }: OsThemeProps) => {
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

  const isUnauthorized =
    form?.isProtected &&
    (formFieldsError as { data?: { code?: string } })?.data?.code === "UNAUTHORIZED";
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);

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
        className="w-full min-h-screen flex items-center justify-center p-4 sm:p-8 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ backgroundImage: "url('/theme/os/os-deaktop.jpg')" }}
      >
        <OsCard className="w-full max-w-xl">
          <div className="flex flex-col gap-6 p-8">
            <Skeleton className="h-8 w-3/4 mx-auto bg-black/10 dark:bg-white/10" />
            <Skeleton className="h-4 w-1/2 mx-auto bg-black/10 dark:bg-white/10" />
            <div className="space-y-4 mt-6">
              <Skeleton className="h-16 w-full bg-black/5 dark:bg-white/5" />
              <Skeleton className="h-16 w-full bg-black/5 dark:bg-white/5" />
              <Skeleton className="h-16 w-full bg-black/5 dark:bg-white/5" />
            </div>
          </div>
        </OsCard>
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
        title="Form Submitted"
        message="Your response has been securely saved to the system."
      />
    );
  }

  const isExpired = form.expiry && new Date(form.expiry) < new Date();
  if (isExpired) {
    return (
      <ErrorDisplay
        title="Time's Up"
        message="This form has reached its expiry date and is no longer accepting submissions."
      />
    );
  }

  if (form.formStatus !== "published") {
    return (
      <ErrorDisplay
        title="Not Available"
        message="This form is currently unavailable for submissions."
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
      className="w-full min-h-screen relative overflow-hidden flex items-center justify-center p-4 sm:p-8 font-sans bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "url('/theme/os/os-deaktop.jpg')" }}
    >
      <OsCard className="w-full max-w-xl" title={form.title || "Form"}>
        <div className="max-h-[80vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden p-6 sm:p-10">
          <div className="flex flex-col gap-6">
            <div className="mb-4">
              <h1 className="text-3xl font-semibold text-gray-900 dark:text-white tracking-tight">
                {form.title}
              </h1>
              {form.description && (
                <p className="mt-2 text-gray-600 dark:text-gray-300 font-medium text-[13px]">
                  {form.description}
                </p>
              )}
              {isMultiStep && maxSteps > 1 && (
                <div className="mt-6 flex flex-col gap-2">
                  <div className="flex w-full items-center gap-1.5">
                    {steps.map((_, index) => (
                      <div
                        key={index}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          index <= currentStepIndex
                            ? "bg-[#007AFF]"
                            : "bg-black/10 dark:bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                    Step {currentStepIndex + 1} of {maxSteps}
                  </span>
                </div>
              )}
            </div>

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                <div className="flex flex-col gap-5">
                  {currentFields.map((field) => (
                    <div key={field.id} className="flex flex-col gap-2">
                      <label className="text-[13px] font-semibold text-gray-800 dark:text-gray-200">
                        {field.label}
                        {field.isRequired && <span className="text-[#FF5F56] ml-1">*</span>}
                      </label>
                      <FormFieldRenderer field={field} control={control} />
                      {errors[field.labelKey] && (
                        <p className="text-[11px] font-medium text-[#FF5F56]">
                          {errors[field.labelKey]?.message as string}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between gap-3 mt-6 pt-6 border-t border-black/10 dark:border-white/10">
                  {isMultiStep && currentStepIndex > 0 && (
                    <OsButton type="button" variant="secondary" onClick={prevStep}>
                      Back
                    </OsButton>
                  )}
                  <div className="flex-1" />
                  {isMultiStep && currentStepIndex < maxSteps - 1 ? (
                    <OsButton
                      type="button"
                      variant="default"
                      className="min-w-[100px]"
                      onClick={(e) => nextStep(e)}
                      disabled={isTransitioning}
                    >
                      {isTransitioning ? "Loading..." : "Next"}
                    </OsButton>
                  ) : (
                    <OsButton
                      type="submit"
                      variant="default"
                      className="min-w-[100px]"
                      disabled={submitFormResponseIsPending || isTransitioning}
                    >
                      {submitFormResponseIsPending ? "Sending..." : "Submit"}
                    </OsButton>
                  )}
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </OsCard>
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
            <OsInput
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
            <OsTextarea
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
              {options.map((opt, index: number) => (
                <div key={opt.value} className="flex items-center gap-2.5">
                  <RadioGroupItem value={opt.value} id={`${field.id}-${index}`} />
                  <label
                    htmlFor={`${field.id}-${index}`}
                    className="text-[13px] font-medium text-gray-700 dark:text-gray-300"
                  >
                    {opt.label}
                  </label>
                </div>
              ))}
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
            <div className="flex items-center gap-2.5 mt-1">
              <OsCheckbox id={field.id} onCheckedChange={onChange} checked={!!value} />
              <label
                htmlFor={field.id}
                className="text-[13px] font-medium text-gray-700 dark:text-gray-300"
              >
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
            <OsSlider
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
            <OsRating
              max={field.validation?.max || 5}
              onChange={onChange}
              value={value as number}
            />
          )}
        />
      );

    default:
      return (
        <div className="p-3 bg-[#FF5F56]/10 border border-[#FF5F56]/30 text-[#FF5F56] text-[11px] font-semibold uppercase rounded-md">
          Unsupported Field Type: {field.fieldType}
        </div>
      );
  }
};

export default OsTheme;
