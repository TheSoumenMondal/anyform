import { z } from "zod";

export const createAccountWithEmailAndPasswordInputModel = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
});

export const createAccountWithEmailAndPasswordOutputModel = z.object({
  id: z.string(),
});
