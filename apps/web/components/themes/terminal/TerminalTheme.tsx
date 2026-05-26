"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider, Controller, type Control, type FieldValues } from "react-hook-form";
import TerminalCard from "./Card";
import TerminalButton from "./Button";
import TerminalInput from "./Input";
import TerminalCheckbox from "./Checkbox";
import { RadioGroup, RadioGroupItem } from "./RadioGroup";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./Select";
import TerminalSlider from "./Slider";
import TerminalTextarea from "./Textarea";
import TerminalRating from "./Rating";
import { usePublicFormBySlug } from "~/hooks/api/form/use-public-form-by-slug";
import { usePublicFormFields } from "~/hooks/api/form/use-public-form-fields";
import { useSubmitFormResponse } from "~/hooks/api/form/use-submit-form-response";
import { Skeleton } from "~/components/ui/skeleton";
import { toast } from "sonner";
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

type TerminalThemeProps = {
  slug: string;
};

const SuccessDisplay = ({ title, message }: { title: string; message: string }) => (
  <div className="w-full min-h-screen relative overflow-hidden flex items-center justify-center p-4 sm:p-8 bg-black font-mono">
    <TerminalCard className="w-full max-w-xl p-12 text-center">
      <div className="flex flex-col items-center gap-6">
        <div className="text-[#00FF41] text-6xl">✓</div>
        <div className="space-y-4">
          <h1 className="text-[24px] font-bold text-[#00FF41] uppercase tracking-widest">
            {title}
          </h1>
          <p className="text-[#00FF41]/70 text-[15px]">{message}</p>
        </div>
        <div className="mt-4">
          <TerminalButton
            variant="default"
            onClick={() => window.location.reload()}
            className="px-10"
          >
            [ OK ]
          </TerminalButton>
        </div>
      </div>
    </TerminalCard>
  </div>
);

const ErrorDisplay = ({ title, message }: { title: string; message: string }) => (
  <div className="w-full min-h-screen relative overflow-hidden flex items-center justify-center p-4 sm:p-8 bg-black font-mono">
    <TerminalCard className="w-full max-w-xl p-12 text-center border-red-500/50 shadow-[0_0_20px_rgba(255,0,0,0.1)]">
      <div className="flex flex-col items-center gap-6">
        <div className="text-red-500 text-6xl font-bold">X</div>
        <div className="space-y-4">
          <h1 className="text-[24px] font-bold text-red-500 uppercase tracking-widest">{title}</h1>
          <p className="text-red-500/70 text-[15px]">{message}</p>
        </div>
        <div className="mt-4">
          <TerminalButton
            variant="secondary"
            onClick={() => (window.location.href = "/")}
            className="px-10 border-red-500 text-red-500 hover:bg-red-500/10 hover:border-red-500"
          >
            [ RETURN ]
          </TerminalButton>
        </div>
      </div>
    </TerminalCard>
  </div>
);

const PasswordPrompt = ({ formId, onSuccess }: { formId: string; onSuccess: () => void }) => {
  const [password, setPassword] = useState("");
  const verifyMutation = trpc.form.verifyFormPassword.useMutation({
    onSuccess: () => onSuccess(),
    onError: (error) => toast.error(error.message || "ACCESS DENIED"),
  });

  return (
    <div className="w-full min-h-screen relative overflow-hidden flex items-center justify-center bg-black font-mono p-4">
      <TerminalCard className="w-full max-w-xl p-10 sm:p-14">
        <div className="flex flex-col gap-10">
          <div className="space-y-2">
            <h1 className="text-[24px] font-bold text-[#00FF41] uppercase tracking-widest">
              &gt; SYSTEM_LOCKED
            </h1>
            <p className="text-[15px] text-[#00FF41]/70">
              Authentication required. Enter password to proceed.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <TerminalInput
              type="password"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") verifyMutation.mutate({ formId, password });
              }}
              autoFocus
            />
            <TerminalButton
              onClick={() => verifyMutation.mutate({ formId, password })}
              disabled={verifyMutation.isPending}
              className="w-full"
            >
              {verifyMutation.isPending ? "AUTHENTICATING..." : "LOGIN"}
            </TerminalButton>
          </div>
        </div>
      </TerminalCard>
    </div>
  );
};

const TerminalTheme = ({ slug }: TerminalThemeProps) => {
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
      <div className="w-full min-h-screen flex items-center justify-center p-4 sm:p-8 bg-black font-mono">
        <TerminalCard className="w-full max-w-3xl p-10 sm:p-14">
          <div className="flex flex-col gap-12">
            <div className="space-y-4">
              <Skeleton className="h-8 w-2/3 bg-[#00FF41]/20 rounded-none" />
              <Skeleton className="h-4 w-1/2 bg-[#00FF41]/10 rounded-none" />
            </div>
            <div className="space-y-12">
              <Skeleton className="h-12 w-full bg-[#00FF41]/5 rounded-none" />
              <Skeleton className="h-12 w-full bg-[#00FF41]/5 rounded-none" />
              <Skeleton className="h-12 w-full bg-[#00FF41]/5 rounded-none" />
            </div>
          </div>
        </TerminalCard>
      </div>
    );
  }

  if (formIsError || !form) {
    return (
      <ErrorDisplay
        title="ERR_NOT_FOUND"
        message="Target form could not be located in the mainframe."
      />
    );
  }

  if (submitFormResponseIsSuccess) {
    return (
      <SuccessDisplay
        title="TRANSMISSION_COMPLETE"
        message="Data successfully uploaded to server."
      />
    );
  }

  const isExpired = form.expiry && new Date(form.expiry) < new Date();
  if (isExpired) {
    return <ErrorDisplay title="ERR_EXPIRED" message="This endpoint is no longer active." />;
  }

  if (form.formStatus !== "published") {
    return <ErrorDisplay title="ERR_OFFLINE" message="This form is currently offline." />;
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
      toast.success("TRANSMISSION SUCCESSFUL", {
        style: { background: "black", color: "#00FF41", border: "1px solid #00FF41" },
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("TRANSMISSION FAILED", {
        style: { background: "black", color: "red", border: "1px solid red" },
      });
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
    <div className="w-full min-h-screen relative overflow-hidden flex items-center justify-center p-4 sm:p-8 bg-black font-mono">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
      <TerminalCard className="w-full max-w-3xl relative z-10">
        <div className="max-h-[85vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden p-8 sm:p-14">
          <div className="flex flex-col gap-12">
            <div className="space-y-6 border-b border-[#00FF41]/20 pb-8">
              <h1 className="text-[32px] sm:text-[40px] font-bold text-[#00FF41] tracking-widest uppercase">
                &gt; {form.title}_
              </h1>
              {form.description && (
                <p className="text-[#00FF41]/70 text-[16px] leading-relaxed max-w-2xl">
                  {form.description}
                </p>
              )}

              {isMultiStep && maxSteps > 1 && (
                <div className="mt-8 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-[13px] font-bold text-[#00FF41]/70 uppercase tracking-widest">
                    <span>Process</span>
                    <span>
                      [{currentStepIndex + 1}/{maxSteps}]
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#00FF41]/10 rounded-none overflow-hidden">
                    <div
                      className="h-full bg-[#00FF41] rounded-none transition-[width] duration-[300ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-14">
                <div className="flex flex-col gap-12">
                  {currentFields.map((field) => (
                    <div key={field.id} className="flex flex-col gap-4">
                      <div className="space-y-1">
                        <label className="text-[16px] font-bold text-[#00FF41] tracking-wider uppercase flex items-center gap-2">
                          {field.label}
                          {field.isRequired && (
                            <span className="text-[#00FF41] font-bold text-lg">*</span>
                          )}
                        </label>
                        {field.description && (
                          <p className="text-[14px] text-[#00FF41]/60 leading-relaxed">
                            {field.description}
                          </p>
                        )}
                      </div>
                      <FormFieldRenderer field={field} control={control} />
                      {errors[field.labelKey] && (
                        <p className="text-[14px] font-bold text-red-500 mt-2 flex items-center gap-2">
                          <span className="text-xl leading-none">!</span>{" "}
                          {errors[field.labelKey]?.message as string}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center gap-6 mt-8 pt-10 border-t border-[#00FF41]/20">
                  {isMultiStep && currentStepIndex > 0 ? (
                    <TerminalButton
                      type="button"
                      variant="secondary"
                      onClick={prevStep}
                      className="px-8"
                    >
                      [ BACK ]
                    </TerminalButton>
                  ) : (
                    <div />
                  )}

                  {isMultiStep && currentStepIndex < maxSteps - 1 ? (
                    <TerminalButton
                      type="button"
                      variant="default"
                      className="px-10"
                      onClick={(e) => nextStep(e)}
                      disabled={isTransitioning}
                    >
                      {isTransitioning ? "[ PROCESSING... ]" : "[ CONTINUE ]"}
                    </TerminalButton>
                  ) : (
                    <TerminalButton
                      type="submit"
                      variant="default"
                      className="px-12"
                      disabled={submitFormResponseIsPending || isTransitioning}
                    >
                      {submitFormResponseIsPending ? "[ TRANSMITTING... ]" : "[ EXECUTE ]"}
                    </TerminalButton>
                  )}
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </TerminalCard>
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
          rules={{ required: field.isRequired ? "REQUIRED" : false }}
          render={({ field: { onChange, value } }) => (
            <TerminalInput
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
              placeholder={field.placeholder || "INPUT..."}
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
          rules={{ required: field.isRequired ? "REQUIRED" : false }}
          render={({ field: { onChange, value } }) => (
            <TerminalTextarea
              placeholder={field.placeholder || "INPUT_STREAM..."}
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
          rules={{ required: field.isRequired ? "REQUIRED" : false }}
          render={({ field: { onChange, value } }) => (
            <Select onValueChange={onChange} value={value as string}>
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder || "SELECT_OPTION"} />
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
          rules={{ required: field.isRequired ? "REQUIRED" : false }}
          render={({ field: { onChange, value } }) => (
            <RadioGroup onValueChange={onChange} value={value as string}>
              {options.map((opt, index: number) => (
                <div key={opt.value} className="flex items-center gap-4 group">
                  <RadioGroupItem value={opt.value} id={`${field.id}-${index}`} />
                  <label
                    htmlFor={`${field.id}-${index}`}
                    className="text-[15px] text-[#00FF41]/80 font-mono cursor-pointer group-hover:text-[#00FF41] transition-colors uppercase tracking-wider"
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
          rules={{ required: field.isRequired ? "REQUIRED" : false }}
          render={({ field: { onChange, value } }) => (
            <div className="flex items-center gap-4 group mt-2">
              <TerminalCheckbox id={field.id} onCheckedChange={onChange} checked={!!value} />
              <label
                htmlFor={field.id}
                className="text-[15px] font-mono font-bold text-[#00FF41]/80 cursor-pointer group-hover:text-[#00FF41] transition-colors uppercase tracking-wider"
              >
                {field.placeholder || "ACKNOWLEDGE"}
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
          rules={{ required: field.isRequired ? "REQUIRED" : false }}
          render={({ field: { onChange, value } }) => (
            <div className="pt-4 pb-2">
              <TerminalSlider
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
          rules={{ required: field.isRequired ? "REQUIRED" : false }}
          render={({ field: { onChange, value } }) => (
            <TerminalRating
              max={field.validation?.max || 5}
              onChange={onChange}
              value={value as number}
            />
          )}
        />
      );

    default:
      return (
        <div className="p-4 bg-red-500/10 text-red-500 border border-red-500 text-[14px] font-mono font-bold">
          [ERR] UNSUPPORTED_FIELD_TYPE: {field.fieldType}
        </div>
      );
  }
};

export default TerminalTheme;
