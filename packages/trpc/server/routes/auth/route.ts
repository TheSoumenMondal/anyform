import { publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
  createAccountWithEmailAndPasswordInputModel,
  createAccountWithEmailAndPasswordOutputModel,
} from "./model";
import { authService } from "../../services";

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
});
