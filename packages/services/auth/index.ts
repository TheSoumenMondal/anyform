import { auth } from "./auth";
import {
  type CreateAccountWithEmailAndPasswordInputType,
  createAccountWithEmailAndPasswordInput,
} from "./model";

class AuthService {
  /**
   * The function creates a user account with email and password authentication.
   * @param {CreateAccountWithEmailAndPasswordInputType} payload - The `payload` parameter in the
   * `createAccountWithEmailAndPassword` function is of type
   * `CreateAccountWithEmailAndPasswordInputType`. This parameter likely contains the necessary
   * information required to create a new account with an email and password, such as the user's name,
   * email address, and password.
   * @returns The `createAccountWithEmailAndPassword` function is returning the `user` object after
   * signing up a new user with the provided name, email, and password.
   */
  public async createAccountWithEmailAndPassword(
    payload: CreateAccountWithEmailAndPasswordInputType,
  ) {
    const { name, email, password } =
      await createAccountWithEmailAndPasswordInput.parseAsync(payload);
    const user = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });
    return user;
  }
}

export default AuthService;
