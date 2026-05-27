"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider, Controller, type Control, type FieldValues } from "react-hook-form";
import StartupCard from "./Card";
import StartupButton from "./Button";
import StartupInput from "./Input";
import StartupCheckbox from "./Checkbox";
import { RadioGroup, RadioGroupItem } from "./RadioGroup";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./Select";
import StartupSlider from "./Slider";
import StartupTextarea from "./Textarea";
import StartupRating from "./Rating";
import { usePublicFormBySlug } from "~/hooks/api/form/use-public-form-by-slug";
import { usePublicFormFields } from "~/hooks/api/form/use-public-form-fields";
import { useSubmitFormResponse } from "~/hooks/api/form/use-submit-form-response";
import { Skeleton } from "~/components/ui/skeleton";
import { toast } from "sonner";
import { Check, X, Lock } from "lucide-react";
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

type StartupThemeProps = {
  slug: string;
};

const BackgroundImage = () => (
  <>
    <style
      dangerouslySetInnerHTML={{
        __html: `
      @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');
    `,
      }}
    />
    <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
      style={{ backgroundImage: "url('/images/desktop.png')" }}
    />
  </>
);

const SuccessDisplay = ({ title, message }: { title: string; message: string }) => (
  <div className="w-full min-h-screen relative overflow-hidden flex items-center justify-center p-4 sm:p-8 font-sans">
    <BackgroundImage />
    <StartupCard className="w-full max-w-md text-center items-center p-10">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="size-16 rounded-full bg-green-50/80 backdrop-blur-sm flex items-center justify-center mb-2 shadow-sm">
          <Check className="size-8 text-green-600" strokeWidth={3} />
        </div>
        <h1 className="text-3xl font-['Instrument_Serif'] font-normal text-gray-900 tracking-tight">
          {title}
        </h1>
        <p className="text-gray-600 font-medium text-[15px] mb-6">{message}</p>
        <StartupButton
          variant="default"
          onClick={() => window.location.reload()}
          className="w-full"
        >
          Done
        </StartupButton>
      </div>
    </StartupCard>
  </div>
);

const ErrorDisplay = ({ title, message }: { title: string; message: string }) => (
  <div className="w-full min-h-screen relative overflow-hidden flex items-center justify-center p-4 sm:p-8 font-sans">
    <BackgroundImage />
    <StartupCard className="w-full max-w-md text-center items-center p-10">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="size-16 rounded-full bg-red-50/80 backdrop-blur-sm flex items-center justify-center mb-2 shadow-sm">
          <X className="size-8 text-red-500" strokeWidth={3} />
        </div>
        <h1 className="text-3xl font-['Instrument_Serif'] font-normal text-gray-900 tracking-tight">
          {title}
        </h1>
        <p className="text-gray-600 font-medium text-[15px] mb-6">{message}</p>
        <StartupButton
          variant="secondary"
          onClick={() => (window.location.href = "/")}
          className="w-full bg-white/50"
        >
          Go Back
        </StartupButton>
      </div>
    </StartupCard>
  </div>
);

const PasswordPrompt = ({ formId, onSuccess }: { formId: string; onSuccess: () => void }) => {
  const [password, setPassword] = useState("");
  const verifyMutation = trpc.form.verifyFormPassword.useMutation({
    onSuccess: () => onSuccess(),
    onError: (error) => toast.error(error.message || "Incorrect password"),
  });

  return (
    <div className="w-full min-h-screen relative overflow-hidden flex items-center justify-center font-sans p-4">
      <BackgroundImage />
      <StartupCard className="relative z-10 w-full max-w-sm p-8 sm:p-10">
        <div className="flex flex-col items-center gap-6">
          <div className="size-14 rounded-2xl bg-white/60 shadow-sm flex items-center justify-center">
            <Lock className="size-6 text-gray-700" />
          </div>
          <div className="text-center space-y-1.5">
            <h1 className="text-[28px] font-['Instrument_Serif'] font-normal text-gray-900 tracking-tight">
              Protected Form
            </h1>
            <p className="text-[14px] text-gray-600 font-medium">
              Enter the password to access this form
            </p>
          </div>
          <div className="flex flex-col w-full gap-4 mt-2">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") verifyMutation.mutate({ formId, password });
              }}
              className="w-full h-12 rounded-2xl border border-gray-200/50 bg-white/50 px-4 text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black/30 focus:ring-1 focus:ring-black/30 transition-all backdrop-blur-md"
              autoFocus
            />
            <StartupButton
              onClick={() => verifyMutation.mutate({ formId, password })}
              disabled={verifyMutation.isPending}
              className="w-full shadow-lg"
            >
              {verifyMutation.isPending ? "Verifying..." : "Continue"}
            </StartupButton>
          </div>
        </div>
      </StartupCard>
    </div>
  );
};

const StartupTheme = ({ slug }: StartupThemeProps) => {
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
      <div className="w-full min-h-screen flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
        <BackgroundImage />
        <StartupCard className="w-full max-w-2xl relative z-10 p-10">
          <div className="flex flex-col gap-8">
            <Skeleton className="h-10 w-2/3 mx-auto bg-gray-200/50 rounded-lg" />
            <Skeleton className="h-5 w-1/2 mx-auto bg-gray-200/50 rounded-lg" />
            <div className="space-y-8 mt-6">
              <Skeleton className="h-14 w-full bg-white/40 rounded-2xl" />
              <Skeleton className="h-14 w-full bg-white/40 rounded-2xl" />
              <Skeleton className="h-14 w-full bg-white/40 rounded-2xl" />
            </div>
          </div>
        </StartupCard>
      </div>
    );
  }

  if (formIsError || !form) {
    return (
      <ErrorDisplay
        title="Form not found"
        message="This form does not exist or has been removed."
      />
    );
  }

  if (submitFormResponseIsSuccess) {
    return <SuccessDisplay title="Success" message="Your response has been recorded." />;
  }

  const isExpired = form.expiry && new Date(form.expiry) < new Date();
  if (isExpired) {
    return <ErrorDisplay title="Expired" message="This form is no longer accepting responses." />;
  }

  if (form.formStatus !== "published") {
    return <ErrorDisplay title="Unavailable" message="This form is not currently published." />;
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
      toast.success("Submitted successfully");
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit. Please try again.");
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

  const progressPercentage = maxSteps > 1 ? ((currentStepIndex + 1) / maxSteps) * 100 : 100;

  return (
    <div className="w-full min-h-screen relative overflow-hidden flex items-center justify-center p-4 sm:p-8 font-sans">
      <BackgroundImage />
      <StartupCard className="w-full max-w-2xl relative z-10">
        <div className="max-h-[85vh] overflow-y-auto scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden p-6 sm:p-8">
          <div className="flex flex-col gap-8">
            <div className="text-center space-y-2">
              <h1 className="text-[36px] sm:text-[42px] font-['Instrument_Serif'] font-normal text-gray-900 tracking-tight leading-tight">
                {form.title}
              </h1>
              {form.description && (
                <p className="text-gray-500 font-medium text-[15px] max-w-lg mx-auto leading-relaxed">
                  {form.description}
                </p>
              )}

              {isMultiStep && maxSteps > 1 && (
                <div className="mt-8 flex flex-col items-center gap-2.5">
                  <div className="h-1 w-full max-w-40 bg-black/6 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-black rounded-full transition-[width] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <span className="text-[12px] font-semibold text-gray-400 uppercase tracking-widest">
                    Step {currentStepIndex + 1} of {maxSteps}
                  </span>
                </div>
              )}
            </div>

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
                <div className="flex flex-col gap-7">
                  {currentFields.map((field) => (
                    <div key={field.id} className="flex flex-col gap-2.5">
                      <label className="text-[14px] font-medium text-gray-800 tracking-tight pl-0.5">
                        {field.label}
                        {field.isRequired && <span className="text-red-500 ml-1 font-bold">*</span>}
                      </label>
                      {field.description && (
                        <p className="text-[13px] text-gray-500 font-medium pl-1 -mt-1.5 mb-1">
                          {field.description}
                        </p>
                      )}
                      <FormFieldRenderer field={field} control={control} />
                      {errors[field.labelKey] && (
                        <p className="text-[13px] font-medium text-red-500 pl-1 mt-0.5">
                          {errors[field.labelKey]?.message as string}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center gap-4 mt-6 pt-8 border-t border-gray-200/50">
                  {isMultiStep && currentStepIndex > 0 ? (
                    <StartupButton
                      type="button"
                      variant="secondary"
                      onClick={prevStep}
                      className="px-6 bg-white border-black/10 hover:bg-gray-50 text-gray-700"
                    >
                      Back
                    </StartupButton>
                  ) : (
                    <div />
                  )}

                  {isMultiStep && currentStepIndex < maxSteps - 1 ? (
                    <StartupButton
                      type="button"
                      variant="default"
                      className="px-8 bg-black hover:bg-gray-900 text-white shadow-md shadow-black/10"
                      onClick={(e) => nextStep(e)}
                      disabled={isTransitioning}
                    >
                      {isTransitioning ? "Continuing..." : "Continue"}
                    </StartupButton>
                  ) : (
                    <StartupButton
                      type="submit"
                      variant="default"
                      className="px-8 bg-black hover:bg-gray-900 text-white shadow-md shadow-black/10"
                      disabled={submitFormResponseIsPending || isTransitioning}
                    >
                      {submitFormResponseIsPending ? "Submitting..." : "Submit"}
                    </StartupButton>
                  )}
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </StartupCard>
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
          rules={{ required: field.isRequired ? "Required field" : false }}
          render={({ field: { onChange, value } }) => (
            <StartupInput
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
              placeholder={field.placeholder || "Enter your answer..."}
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
          rules={{ required: field.isRequired ? "Required field" : false }}
          render={({ field: { onChange, value } }) => (
            <StartupTextarea
              placeholder={field.placeholder || "Type your response here..."}
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
          rules={{ required: field.isRequired ? "Required field" : false }}
          render={({ field: { onChange, value } }) => (
            <Select onValueChange={onChange} value={value as string}>
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder || "Select an option"} />
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
          rules={{ required: field.isRequired ? "Required field" : false }}
          render={({ field: { onChange, value } }) => (
            <RadioGroup onValueChange={onChange} value={value as string}>
              {options.map((opt, index: number) => (
                <div key={opt.value} className="flex items-center gap-3 group">
                  <RadioGroupItem value={opt.value} id={`${field.id}-${index}`} />
                  <label
                    htmlFor={`${field.id}-${index}`}
                    className="text-[15px] text-gray-700 font-medium cursor-pointer group-hover:text-black transition-colors"
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
          rules={{ required: field.isRequired ? "Required field" : false }}
          render={({ field: { onChange, value } }) => (
            <div className="flex items-center gap-3 mt-1 group">
              <StartupCheckbox id={field.id} onCheckedChange={onChange} checked={!!value} />
              <label
                htmlFor={field.id}
                className="text-[15px] font-medium text-gray-700 cursor-pointer group-hover:text-black transition-colors"
              >
                {field.placeholder || "Yes, I agree"}
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
          rules={{ required: field.isRequired ? "Required field" : false }}
          render={({ field: { onChange, value } }) => (
            <div className="pt-2 pb-1">
              <StartupSlider
                defaultValue={[field.validation?.min || 0]}
                max={field.validation?.max || 100}
                step={field.validation?.step || 1}
                onValueChange={(vals) => onChange(vals[0])}
                value={value !== undefined ? [value as number] : undefined}
              />
            </div>
          )}
        />
      );

    case "rating":
      return (
        <Controller
          name={field.labelKey}
          control={control}
          rules={{ required: field.isRequired ? "Required field" : false }}
          render={({ field: { onChange, value } }) => (
            <StartupRating
              max={field.validation?.max || 5}
              onChange={onChange}
              value={value as number}
            />
          )}
        />
      );

    default:
      return (
        <div className="p-4 bg-red-50 text-red-600 text-[13px] font-semibold rounded-2xl border border-red-100 shadow-sm">
          Unsupported field type: {field.fieldType}
        </div>
      );
  }
};

export default StartupTheme;
