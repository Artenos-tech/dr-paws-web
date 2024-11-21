import { createAPIClient, RequestContext, z } from "../lib/apiclient";

export {
  FetchAPIError,
  ParseAPIError,
  SchemaAPIError,
  ErrorResponseAPIError,
} from "../lib/apiclient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

const AUTH_TOKEN_HEADER_NAME = "X-Auth-Token";

const AUTH_TOKEN_LOCALSTORAGE_KEY = "authToken";

function initRequestContext() {
  const ctx = new RequestContext();
  if (typeof window !== "undefined") {
    const authToken = localStorage.getItem(AUTH_TOKEN_LOCALSTORAGE_KEY);
    if (authToken) {
      ctx.addHeader(AUTH_TOKEN_HEADER_NAME, authToken);
    }
  }
  return ctx;
}

const requestContext = initRequestContext();

export function setAuthToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_TOKEN_LOCALSTORAGE_KEY, token);
    requestContext.addHeader(AUTH_TOKEN_HEADER_NAME, token);
  }
}

export function clearAuthToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_TOKEN_LOCALSTORAGE_KEY);
    requestContext.removeHeader(AUTH_TOKEN_HEADER_NAME);
  }
}

export default createAPIClient({
  baseUrl: API_BASE_URL,
  baseResponseSchema: z.object({
    status: z.number(),
    message: z.string(),
  }),
  requestContext,
  endpointConfig: {
    signupOTP: {
      method: "POST",
      path: "/signup/otp",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({
        name: z.string(),
        mobile: z.string(),
        role: z.enum(["ADMIN", "USER"]),
        profile_image: z.string().nullable(),
      }),
      responseSchema: z.object({
        status: z.number(),
        message: z.string(),
      }),
      errorResponseSchema: z.object({}),
    },
    signupVerify: {
      method: "POST",
      path: "/signup/verify",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({
        mobile: z.string(),
        role: z.enum(["ADMIN", "USER"]),
        otp: z.string(),
      }),
      responseSchema: z.object({
        status: z.number(),
        message: z.string(),
        token: z.string(),
        user: z.object({
          id: z.string(),
          mobile: z.string(),
          name: z.string(),
          role: z.enum(["ADMIN", "USER"]),
          email: z.string().nullable(),
          current_address: z.string().nullable(),
        }),
        user_pets: z
          .array(
            z.object({
              id: z.string(),
              name: z.string(),
              type: z.string(),
              breed: z.string().nullable(),
              weight: z.number().nullable(),
              gender: z.string().nullable(),
              dob: z.date().nullable(),
            })
          )
          .nullable(),
      }),
      errorResponseSchema: z.object({}),
    },

    loginOTP: {
      method: "POST",
      path: "/login/otp",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({
        mobile: z.string(),
        role: z.enum(["ADMIN", "USER"]),
      }),
      responseSchema: z.object({
        status: z.number(),
        message: z.string(),
      }),
      errorResponseSchema: z.object({}),
    },

    loginVerify: {
      method: "POST",
      path: "/login/verify",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({
        mobile: z.string(),
        role: z.enum(["ADMIN", "USER"]),
        otp: z.string(),
      }),
      responseSchema: z.object({
        status: z.number(),
        message: z.string(),
        token: z.string(),
        user: z.object({
          id: z.string(),
          mobile: z.string(),
          name: z.string(),
          role: z.enum(["ADMIN", "USER"]),
          email: z.string().nullable(),
          current_address: z.string().nullable(),
          profile_image: z.string().nullable(),
        }),
        user_pets: z
          .array(
            z.object({
              id: z.string(),
              name: z.string(),
              type: z.string(),
              breed: z.string().nullable(),
              weight: z.number().nullable(),
              gender: z.string().nullable(),
              dob: z.string().nullable(),
              profile_image: z.string().nullable(),
            })
          )
          .nullable(),
      }),
      errorResponseSchema: z.object({}),
    },

    logout: {
      method: "POST",
      path: "/login/logout",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({}),
      responseSchema: z.object({
        status: z.number(),
        message: z.string(),
      }),
      errorResponseSchema: z.object({}),
    },
  },
});
