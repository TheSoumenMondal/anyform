"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider, Controller, type Control, type FieldValues } from "react-hook-form";
import MovieCard from "./Card";
import MovieButton from "./Button";
import MovieInput from "./Input";
import MovieCheckbox from "./Checkbox";
import { RadioGroup, RadioGroupItem } from "./RadioGroup";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./Select";
import MovieSlider from "./Slider";
import MovieTextarea from "./Textarea";
import MovieRating from "./Rating";
import { usePublicFormBySlug } from "~/hooks/api/form/use-public-form-by-slug";
import { usePublicFormFields } from "~/hooks/api/form/use-public-form-fields";
import { useSubmitFormResponse } from "~/hooks/api/form/use-submit-form-response";
import { Skeleton } from "~/components/ui/skeleton";
import { toast } from "sonner";
import { ShieldCheck, ShieldAlert, Lock } from "lucide-react";
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

type MovieThemeProps = {
  slug: string;
};

const BackgroundEffects = () => (
  <>
    <style
      dangerouslySetInnerHTML={{
        __html: `
      @keyframes ken-burns {
        0% { transform: scale(1) translate(0, 0); }
        100% { transform: scale(1.15) translate(-1%, -1%); }
      }
      .animate-ken-burns {
        animation: ken-burns 20s ease-in-out infinite alternate;
      }
      .clip-angled { clip-path: polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px); }
      .clip-button { clip-path: polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px); }
    `,
      }}
    />
    <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50 mix-blend-luminosity animate-ken-burns"
      style={{ backgroundImage: "url('/theme/movie/movie-desktop.jpg')" }}
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/80 to-black/95 pointer-events-none" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_120%)] pointer-events-none" />
    <div
      className="absolute inset-0 opacity-10 mix-blend-screen pointer-events-none"
      style={{
        backgroundImage:
          "linear-gradient(#E23636 1px, transparent 1px), linear-gradient(90deg, #E23636 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }}
    />
  </>
);

const SuccessDisplay = ({ title, message }: { title: string; message: string }) => (
  <div className="w-full min-h-screen relative overflow-hidden flex items-center justify-center p-4 sm:p-8 font-sans bg-[#0B0C10]">
    <BackgroundEffects />
    <MovieCard className="w-full max-w-md text-center items-center relative z-10">
      <div className="flex flex-col items-center justify-center p-8 gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-[#0059CF] blur-[30px] opacity-60 rounded-full" />
          <ShieldCheck className="size-24 text-[#0059CF] relative z-10 drop-shadow-[0_0_15px_rgba(0,89,207,0.8)]" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-widest uppercase mt-4 drop-shadow-md">
          {title}
        </h1>
        <p className="text-gray-400 font-medium text-sm mb-6 uppercase tracking-wider">{message}</p>
        <MovieButton
          variant="success"
          onClick={() => window.location.reload()}
          className="w-full tracking-widest"
        >
          ACKNOWLEDGE
        </MovieButton>
      </div>
    </MovieCard>
  </div>
);

const ErrorDisplay = ({ title, message }: { title: string; message: string }) => (
  <div className="w-full min-h-screen relative overflow-hidden flex items-center justify-center p-4 sm:p-8 font-sans bg-[#0B0C10]">
    <BackgroundEffects />
    <MovieCard className="w-full max-w-md text-center items-center relative z-10">
      <div className="flex flex-col items-center justify-center p-8 gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-[#E23636] blur-[30px] opacity-60 rounded-full" />
          <ShieldAlert className="size-24 text-[#E23636] relative z-10 drop-shadow-[0_0_15px_rgba(226,54,54,0.8)]" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-widest uppercase mt-4 drop-shadow-md">
          {title}
        </h1>
        <p className="text-gray-400 font-medium text-sm mb-6 uppercase tracking-wider">{message}</p>
        <MovieButton
          variant="danger"
          onClick={() => (window.location.href = "/")}
          className="w-full tracking-widest"
        >
          ABORT
        </MovieButton>
      </div>
    </MovieCard>
  </div>
);

const PasswordPrompt = ({ formId, onSuccess }: { formId: string; onSuccess: () => void }) => {
  const [password, setPassword] = useState("");
  const verifyMutation = trpc.form.verifyFormPassword.useMutation({
    onSuccess: () => {
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.message || "Access Denied");
    },
  });

  return (
    <div className="w-full min-h-screen relative overflow-hidden flex items-center justify-center font-sans bg-[#0B0C10]">
      <BackgroundEffects />

      <MovieCard className="relative z-10 w-full max-w-md p-8 shadow-[0_0_60px_rgba(226,54,54,0.3)]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-[#E23636] blur-[25px] opacity-50 rounded-full animate-pulse" />
            <Lock className="size-20 text-[#E23636] relative z-10 drop-shadow-[0_0_10px_rgba(226,54,54,1)]" />
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black text-white tracking-[0.2em] uppercase drop-shadow-[0_0_10px_rgba(226,54,54,0.5)]">
              Restricted Access
            </h1>
            <p className="text-[11px] text-[#E23636] font-bold tracking-[0.3em] uppercase">
              Stark Industries Protocol
            </p>
          </div>

          <div className="flex flex-col w-full gap-5 mt-4">
            <div className="relative w-full">
              <input
                type="password"
                placeholder="ENTER CLEARANCE CODE"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") verifyMutation.mutate({ formId, password });
                }}
                className="w-full bg-black/60 border-b-2 border-[#E23636]/50 px-4 py-4 text-white placeholder-[#E23636]/40 text-center font-mono tracking-[0.3em] focus:outline-none focus:border-[#E23636] focus:bg-[#E23636]/10 focus:shadow-[0_10px_20px_-10px_rgba(226,54,54,0.6)] transition-all clip-angled"
                autoFocus
              />
            </div>
            <MovieButton
              onClick={() => verifyMutation.mutate({ formId, password })}
              disabled={verifyMutation.isPending}
              className="w-full tracking-[0.3em]"
            >
              {verifyMutation.isPending ? "VERIFYING..." : "AUTHORIZE"}
            </MovieButton>
          </div>
        </div>
      </MovieCard>
    </div>
  );
};

const MovieTheme = ({ slug }: MovieThemeProps) => {
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
      <div className="w-full min-h-screen flex items-center justify-center p-4 sm:p-8 bg-[#0B0C10] relative overflow-hidden">
        <BackgroundEffects />
        <MovieCard className="w-full max-w-xl relative z-10">
          <div className="flex flex-col gap-6 p-10">
            <Skeleton className="h-10 w-3/4 mx-auto bg-white/10" />
            <Skeleton className="h-4 w-1/2 mx-auto bg-white/10" />
            <div className="space-y-6 mt-8">
              <Skeleton className="h-16 w-full bg-white/5 clip-angled" />
              <Skeleton className="h-16 w-full bg-white/5 clip-angled" />
              <Skeleton className="h-16 w-full bg-white/5 clip-angled" />
            </div>
          </div>
        </MovieCard>
      </div>
    );
  }

  if (formIsError || !form) {
    return (
      <ErrorDisplay
        title="404 Not Found"
        message="The target coordinates do not exist in our database."
      />
    );
  }

  if (submitFormResponseIsSuccess) {
    return (
      <SuccessDisplay
        title="Mission Accomplished"
        message="Your intel has been securely transmitted."
      />
    );
  }

  const isExpired = form.expiry && new Date(form.expiry) < new Date();
  if (isExpired) {
    return (
      <ErrorDisplay
        title="Time Expired"
        message="This operation has timed out and is no longer active."
      />
    );
  }

  if (form.formStatus !== "published") {
    return (
      <ErrorDisplay
        title="Offline"
        message="This form is currently offline and not accepting transmissions."
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
      toast.success("Transmission successful!");
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Transmission failed. Retrying required.");
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
    <div className="w-full min-h-screen relative overflow-hidden flex items-center justify-center p-4 sm:p-8 font-sans bg-[#0B0C10]">
      <BackgroundEffects />
      <MovieCard className="w-full max-w-xl relative z-10">
        <div className="max-h-[85vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden p-6 sm:p-10">
          <div className="flex flex-col gap-10">
            <div className="mb-2 text-center">
              <h1 className="text-3xl font-black text-white tracking-[0.15em] uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                {form.title}
              </h1>
              {form.description && (
                <p className="mt-4 text-gray-400 font-medium text-[13px] tracking-wider uppercase">
                  {form.description}
                </p>
              )}
              {isMultiStep && maxSteps > 1 && (
                <div className="mt-10 flex flex-col items-center gap-4">
                  <div className="flex w-full max-w-xs items-center gap-2">
                    {steps.map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 flex-1 clip-angled transition-all duration-700 ${
                          index <= currentStepIndex
                            ? "bg-gradient-to-r from-[#0059CF] to-[#E23636] shadow-[0_0_15px_rgba(226,54,54,0.6)]"
                            : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-black text-[#0059CF] uppercase tracking-[0.4em] drop-shadow-[0_0_5px_rgba(0,89,207,0.8)]">
                    Phase {currentStepIndex + 1} {"//"} {maxSteps}
                  </span>
                </div>
              )}
            </div>

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
                <div className="flex flex-col gap-6">
                  {currentFields.map((field) => (
                    <div key={field.id} className="flex flex-col gap-3 relative group">
                      <label className="text-[13px] font-black text-white/90 tracking-[0.15em] uppercase ml-1 drop-shadow-md">
                        {field.label}
                        {field.isRequired && (
                          <span className="text-[#E23636] ml-2 drop-shadow-[0_0_8px_rgba(226,54,54,0.9)]">
                            *
                          </span>
                        )}
                      </label>
                      <FormFieldRenderer field={field} control={control} />
                      {errors[field.labelKey] && (
                        <p className="text-[11px] font-bold text-[#E23636] ml-1 uppercase tracking-widest drop-shadow-[0_0_5px_rgba(226,54,54,0.5)]">
                          {errors[field.labelKey]?.message as string}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between gap-4 mt-6 pt-8 border-t-2 border-white/5">
                  {isMultiStep && currentStepIndex > 0 && (
                    <MovieButton type="button" variant="secondary" onClick={prevStep}>
                      BACK
                    </MovieButton>
                  )}
                  <div className="flex-1" />
                  {isMultiStep && currentStepIndex < maxSteps - 1 ? (
                    <MovieButton
                      type="button"
                      variant="success"
                      className="min-w-[160px]"
                      onClick={(e) => nextStep(e)}
                      disabled={isTransitioning}
                    >
                      {isTransitioning ? "PROCESSING..." : "NEXT PHASE"}
                    </MovieButton>
                  ) : (
                    <MovieButton
                      type="submit"
                      variant="default"
                      className="min-w-[160px]"
                      disabled={submitFormResponseIsPending || isTransitioning}
                    >
                      {submitFormResponseIsPending ? "TRANSMITTING..." : "TRANSMIT"}
                    </MovieButton>
                  )}
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </MovieCard>
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
          rules={{ required: field.isRequired ? "REQUIRED FIELD" : false }}
          render={({ field: { onChange, value } }) => (
            <MovieInput
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
              placeholder={field.placeholder || "INPUT DATA..."}
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
          rules={{ required: field.isRequired ? "REQUIRED FIELD" : false }}
          render={({ field: { onChange, value } }) => (
            <MovieTextarea
              placeholder={field.placeholder || "INPUT EXTENDED DATA..."}
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
          rules={{ required: field.isRequired ? "REQUIRED FIELD" : false }}
          render={({ field: { onChange, value } }) => (
            <Select onValueChange={onChange} value={value as string}>
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder || "SELECT PARAMETER"} />
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
          rules={{ required: field.isRequired ? "REQUIRED FIELD" : false }}
          render={({ field: { onChange, value } }) => (
            <RadioGroup onValueChange={onChange} value={value as string}>
              {options.map((opt, index: number) => (
                <div
                  key={opt.value}
                  className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-md transition-colors"
                >
                  <RadioGroupItem value={opt.value} id={`${field.id}-${index}`} />
                  <label
                    htmlFor={`${field.id}-${index}`}
                    className="text-sm font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
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
          rules={{ required: field.isRequired ? "REQUIRED FIELD" : false }}
          render={({ field: { onChange, value } }) => (
            <div className="flex items-center gap-4 mt-2 p-3 bg-white/5 clip-angled border border-white/10 hover:border-[#E23636]/50 transition-colors">
              <MovieCheckbox id={field.id} onCheckedChange={onChange} checked={!!value} />
              <label
                htmlFor={field.id}
                className="text-sm font-black text-white tracking-[0.1em] uppercase cursor-pointer"
              >
                {field.placeholder || "ACTIVATE SUBROUTINE"}
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
          rules={{ required: field.isRequired ? "REQUIRED FIELD" : false }}
          render={({ field: { onChange, value } }) => (
            <div className="pt-2 pb-1 px-1">
              <MovieSlider
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
          rules={{ required: field.isRequired ? "REQUIRED FIELD" : false }}
          render={({ field: { onChange, value } }) => (
            <MovieRating
              max={field.validation?.max || 5}
              onChange={onChange}
              value={value as number}
            />
          )}
        />
      );

    default:
      return (
        <div className="p-4 bg-[#E23636]/10 border-l-4 border-[#E23636] text-[#E23636] text-[11px] font-black uppercase tracking-[0.2em] shadow-inner">
          ERR: UNSUPPORTED DATATYPE [{field.fieldType}]
        </div>
      );
  }
};

export default MovieTheme;
