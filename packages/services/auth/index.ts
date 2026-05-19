import { auth } from "./auth";
import {
  type CreateAccountWithEmailAndPasswordInputType,
  SignInWithEmailAndPasswordInputType,
  createAccountWithEmailAndPasswordInput,
  signInWithEmailAndPasswordInput,
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

  /**
   * The function signInWithEmailAndPassword asynchronously signs in a user with their email and
   * password.
   * @param {SignInWithEmailAndPasswordInputType} payload - The `payload` parameter in the
   * `signInWithEmailAndPassword` function likely contains the user's email and password information
   * needed for signing in. It is of type `SignInWithEmailAndPasswordInputType`.
   * @returns The function `signInWithEmailAndPassword` is returning the user object if the sign-in
   * process is successful. If the sign-in process fails (i.e., if the user is not found or the
   * password is incorrect), an error with the message "Invalid email or password" will be thrown.
   */
  public async signInWithEmailAndPassword(payload: SignInWithEmailAndPasswordInputType) {
    const { email, password } = await signInWithEmailAndPasswordInput.parseAsync(payload);
    const user = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });
    if (!user) {
      throw new Error("Invalid email or password");
    }
    return user;
  }
}

export default AuthService;
