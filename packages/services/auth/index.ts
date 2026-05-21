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
