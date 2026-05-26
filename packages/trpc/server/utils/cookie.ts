import { CookieOptions, Request, type Response } from "express";
import { TRPCContext } from "../context";
import { env } from "../env";

const ONE_MINUTE = 60 * 1000;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;
const ONE_WEEK = 7 * ONE_DAY;
const ONE_MONTH = 30 * ONE_DAY;
const ONE_YEAR = 365 * ONE_DAY;

const defaultCookieOptions: CookieOptions = {
  path: "/",
  httpOnly: true,
  secure: env.NODE_ENV !== "development",
  sameSite: "strict",
  maxAge: ONE_YEAR,
};

/**
 * The function `createCookieFactory` returns a function `createCookie` that sets a cookie with the
 * provided name, value, and options on the response object.
 * @param {Response} res - The `res` parameter in the `createCookieFactory` function is typically the
 * response object that is used to send HTTP responses back to the client in a web application. It is
 * commonly used in frameworks like Express.js in Node.js to set cookies in the response headers.
 * @returns A function named `createCookie` is being returned.
 */
export function createCookieFactory(res: Response) {
  return function createCookie(
    name: string,
    value: string,
    options: CookieOptions = defaultCookieOptions,
  ) {
    res.cookie(name, value, options);
  };
}

/**
 * The function `getCookieFactory` returns a function that retrieves a cookie value by name from a
 * request object.
 * @param {Request} req - Request object containing cookies
 * @returns A function named `getCookieFactory` is being returned. This function takes a `Request`
 * object as a parameter and returns another function named `getCookie`. The `getCookie` function takes
 * a `name` parameter of type string and returns either the value of the cookie with the specified name
 * from the `req.cookies` object or `undefined` if the cookie does not exist.
 */
export function getCookieFactory(req: Request) {
  return function getCookie(name: string): string | undefined {
    return req.cookies?.[name];
  };
}

/**
 * The function clearCookieFactory returns a function that clears a specific cookie using the Response
 * object provided as an argument.
 * @param {Response} res - The `res` parameter is typically an object representing the HTTP response
 * that will be sent back to the client. It is commonly used in web development to interact with the
 * response, set headers, cookies, and send data back to the client.
 * @returns A function named `clearCookieFactory` is being exported. This function takes a `Response`
 * object as a parameter and returns another function named `clearCookie`. The `clearCookie` function
 * takes a `name` parameter and calls the `clearCookie` method on the provided `Response` object with
 * the given `name`.
 */
export function clearCookieFactory(res: Response) {
  return function clearCookie(name: string) {
    res.clearCookie(name);
  };
}

const AUTHENTICATION_TOKEN_COOKIE_NAME = "authentication_token";

export function setAuthenticationTokenInCookie(ctx: TRPCContext, token: string) {
  ctx.createCookie(AUTHENTICATION_TOKEN_COOKIE_NAME, token);
}

export function getAuthenticationTokenFromCookie(ctx: TRPCContext): string | undefined {
  return (
    ctx.getCookie(AUTHENTICATION_TOKEN_COOKIE_NAME) ||
    ctx.getCookie("anyform.session_token") ||
    ctx.getCookie("__Secure-anyform.session_token")
  );
}

export function clearAuthenticationTokenFromCookie(ctx: TRPCContext) {
  ctx.clearCookie(AUTHENTICATION_TOKEN_COOKIE_NAME);
}
