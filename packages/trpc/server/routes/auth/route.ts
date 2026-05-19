import { publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
  createAccountWithEmailAndPasswordInputModel,
  createAccountWithEmailAndPasswordOutputModel,
  signInWithEmailAndPasswordInputModel,
  signInWithEmailAndPasswordOutputModel,
} from "./model";
import { authService } from "../../services";
import { setAuthenticationTokenInCookie } from "../../utils/cookie";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

export const authRouter = router({
  createAccountWithEmailAndPassword: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/createAccountWithEmailAndPassword"),
        tags: TAGS,
      },
    })
    .input(createAccountWithEmailAndPasswordInputModel)
    .output(createAccountWithEmailAndPasswordOutputModel)
    .mutation(async ({ input }) => {
      const { name, email, password } = input;
      const user = await authService.createAccountWithEmailAndPassword({
        name,
        email,
        password,
      });
      return {
        id: user.user.id,
      };
    }),

  signInWithEmailAndPassword: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/signInWithEmailAndPassword"),
        tags: TAGS,
      },
    })
    .input(signInWithEmailAndPasswordInputModel)
    .output(signInWithEmailAndPasswordOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;
      const userData = await authService.signInWithEmailAndPassword({
        email,
        password,
      });
      setAuthenticationTokenInCookie(ctx, userData.token);
      return {
        user: userData.user,
      };
    }),
});
