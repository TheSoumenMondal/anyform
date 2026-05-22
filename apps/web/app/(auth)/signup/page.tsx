"use client";

import * as React from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "~/components/ui/input-group";
import { HugeiconsIcon } from "@hugeicons/react";
import { LockKeyIcon, MailLove01Icon, UserCircleIcon } from "@hugeicons/core-free-icons";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import LogInWithGithub from "~/components/features/auth/LoginWithGithub";
import LogInWithGoogle from "~/components/features/auth/LogInWithGoogle";
import { useForm } from "react-hook-form";
import { LoadingButton } from "~/components/common/LoadingButton";
import { useSignUp } from "~/hooks/api/auth/use-signup";
import { toast } from "sonner";

type SignupFormValues = {
  name: string;
  email: string;
  password: string;
};

type SignupValidationIssue = {
  code?: unknown;
  message?: unknown;
  minimum?: unknown;
  origin?: unknown;
  path?: unknown;
};

const getFieldLabel = (path: unknown) => {
  if (!Array.isArray(path)) {
    return null;
  }

  for (let index = path.length - 1; index >= 0; index -= 1) {
    const field = path[index];

    if (typeof field === "string") {
      return `${field.charAt(0).toUpperCase()}${field.slice(1)}`;
    }
  }

  return null;
};

const getFirstIssueMessage = (issues: unknown) => {
  if (!Array.isArray(issues)) {
    return null;
  }

  const [issue] = issues as SignupValidationIssue[];
  if (!issue) {
    return null;
  }

  const field = getFieldLabel(issue.path);
  if (
    field &&
    issue.code === "too_small" &&
    issue.origin === "string" &&
    typeof issue.minimum === "number"
  ) {
    return `${field} must be at least ${issue.minimum} characters long`;
  }

  return typeof issue.message === "string" ? issue.message : null;
};

const getSignupErrorMessage = (error: unknown) => {
  if (error && typeof error === "object" && "issues" in error) {
    const firstIssueMessage = getFirstIssueMessage(error.issues);

    if (firstIssueMessage) {
      return firstIssueMessage;
    }
  }

  if (!(error instanceof Error)) {
    return "An unknown error occurred";
  }

  try {
    const firstIssueMessage = getFirstIssueMessage(JSON.parse(error.message));

    return firstIssueMessage ?? error.message;
  } catch {
    return error.message;
  }
};

const SignupPage = () => {
  const { formState, handleSubmit, register } = useForm<SignupFormValues>();
  const { createAccountWithEmailAndPasswordAsync } = useSignUp();
  const onSubmit = async (values: SignupFormValues) => {
    try {
      if (!values.name || !values.email || !values.password) {
        toast.error("All fields are required", {
          description: "Please fill in all the fields before submitting the form.",
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
        return;
      }
      await createAccountWithEmailAndPasswordAsync({
        email: values.email,
        password: values.password,
        name: values.name,
      });
    } catch (error) {
      toast.error("Account creation failed", {
        description: getSignupErrorMessage(error),
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
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <h1 className="text-4xl font-instrumental-serif leading-tight">Create a new account</h1>

          <p className="text-muted-foreground mt-2 text-sm ">
            Build elegant forms, collect responses, and customize every detail.
          </p>
        </div>
        <div className="mb-4 flex-col flex gap-3">
          <LogInWithGoogle />
          <LogInWithGithub />
        </div>
        <form className="gap-4 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <div className="gap-2 flex flex-col">
            <Label htmlFor="name">Full Name</Label>
            <InputGroup>
              <InputGroupAddon>
                <HugeiconsIcon icon={UserCircleIcon} />
              </InputGroupAddon>
              <InputGroupInput
                readOnly={formState.isSubmitting}
                id="name"
                type="text"
                placeholder="Enter your full name"
                {...register("name")}
              />
            </InputGroup>
          </div>
          <div className="gap-2 flex flex-col">
            <Label htmlFor="email">Email</Label>
            <InputGroup>
              <InputGroupAddon>
                <HugeiconsIcon icon={MailLove01Icon} />
              </InputGroupAddon>
              <InputGroupInput
                readOnly={formState.isSubmitting}
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
              />
            </InputGroup>
          </div>
          <div className="gap-2 flex flex-col">
            <Label htmlFor="password">Password</Label>
            <InputGroup>
              <InputGroupAddon>
                <HugeiconsIcon icon={LockKeyIcon} />
              </InputGroupAddon>
              <InputGroupInput
                readOnly={formState.isSubmitting}
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password")}
              />
            </InputGroup>
          </div>
          <LoadingButton
            animation="none"
            initialText="Sign Up"
            loading={formState.isSubmitting}
            loadingText="Submitting"
            size="lg"
            type="submit"
            variant="info"
          />
          <Link href="/login" className="text-primary hover:underline mx-auto">
            <Button
              disabled={formState.isSubmitting}
              variant="link"
              animation="none"
              className="text-sm text-muted-foreground"
            >
              Already have an account? Log in
            </Button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
