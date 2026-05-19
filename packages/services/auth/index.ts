import db, { and, eq, gt } from "@repo/database";
import * as schema from "@repo/database/schema";

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

  public async getSessionFromToken(token: string) {
    const [session] = await db
      .select({
        sessionId: schema.session.id,
        sessionExpiresAt: schema.session.expiresAt,
        sessionToken: schema.session.token,
        sessionUserId: schema.session.userId,
        userId: schema.user.id,
        userName: schema.user.name,
        userEmail: schema.user.email,
        userEmailVerified: schema.user.emailVerified,
        userImage: schema.user.image,
      })
      .from(schema.session)
      .innerJoin(schema.user, eq(schema.session.userId, schema.user.id))
      .where(and(eq(schema.session.token, token), gt(schema.session.expiresAt, new Date())))
      .limit(1);

    if (!session) {
      return null;
    }

    return {
      id: session.sessionId,
      token: session.sessionToken,
      userId: session.sessionUserId,
      expiresAt: session.sessionExpiresAt,
      user: {
        id: session.userId,
        name: session.userName,
        email: session.userEmail,
        emailVerified: session.userEmailVerified,
        image: session.userImage,
      },
    };
  }
}

export default AuthService;
