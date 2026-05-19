import { z } from "zod";

export const createAccountWithEmailAndPasswordInputModel = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
});

export const createAccountWithEmailAndPasswordOutputModel = z.object({
  id: z.string(),
});

export const signInWithEmailAndPasswordInputModel = z.object({
  email: z.email(),
  password: z.string(),
});

export const signInWithEmailAndPasswordOutputModel = z.object({
  user: z.object({
    id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    email: z.string(),
    emailVerified: z.boolean(),
    name: z.string(),
    image: z.string().nullable().optional(),
  }),
});

export const getUserInfoOutputModel = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().nullable().optional(),
});
