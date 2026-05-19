import { z } from "zod";

export const createAccountWithEmailAndPasswordInput = z.object({
  name: z.string().min(1).describe("Name is required"),
  email: z.email().describe("Valid email is required"),
  password: z.string().min(8).describe("Password must be at least 8 characters long"),
});

export type CreateAccountWithEmailAndPasswordInputType = z.infer<
  typeof createAccountWithEmailAndPasswordInput
>;

export const signInWithEmailAndPasswordInput = z.object({
  email: z.email().describe("Valid email is required"),
  password: z.string().describe("Password is required"),
});

export type SignInWithEmailAndPasswordInputType = z.infer<typeof signInWithEmailAndPasswordInput>;
