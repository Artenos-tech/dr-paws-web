import { createAPIClient, RequestContext, z } from "../lib/apiclient"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string

export const V3_AUTH_TOKEN_HEADER = "X-Auth-Token"
export const V3_AUTH_TOKEN_KEY = "v3AuthToken"
export const V3_OWNER_KEY = "v3Owner"

function initRequestContext() {
  const ctx = new RequestContext()
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(V3_AUTH_TOKEN_KEY)
    if (token) ctx.addHeader(V3_AUTH_TOKEN_HEADER, token)
  }
  return ctx
}

const requestContext = initRequestContext()

export function setV3AuthToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(V3_AUTH_TOKEN_KEY, token)
    requestContext.addHeader(V3_AUTH_TOKEN_HEADER, token)
  }
}

export function clearV3Auth() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(V3_AUTH_TOKEN_KEY)
    localStorage.removeItem(V3_OWNER_KEY)
    requestContext.removeHeader(V3_AUTH_TOKEN_HEADER)
  }
}

const ownerSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string(),
  countryCode: z.string().nullish(),
  email: z.string().nullish(),
  address: z.string().nullish(),
  city: z.string().nullish(),
  state: z.string().nullish(),
  postalCode: z.string().nullish(),
})

export type V3Owner = z.infer<typeof ownerSchema>

export default createAPIClient({
  baseUrl: API_BASE_URL,
  baseResponseSchema: z.object({
    status: z.number(),
    message: z.string(),
  }),
  requestContext,
  endpointConfig: {
    loginOTP: {
      method: "POST",
      path: "/v3/login/otp",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({ mobile: z.string() }),
      responseSchema: z.object({}),
      errorResponseSchema: z.object({}),
    },

    loginVerify: {
      method: "POST",
      path: "/v3/login/verify",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({
        mobile: z.string(),
        otp: z.string(),
      }),
      responseSchema: z.object({
        token: z.string(),
        owner: ownerSchema,
      }),
      errorResponseSchema: z.object({ errorCode: z.string().optional() }),
    },

    signupOTP: {
      method: "POST",
      path: "/v3/signup/otp",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({ mobile: z.string() }),
      responseSchema: z.object({}),
      errorResponseSchema: z.object({}),
    },

    signupVerify: {
      method: "POST",
      path: "/v3/signup/verify",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({
        mobile: z.string(),
        otp: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().nullable().optional(),
      }),
      responseSchema: z.object({
        token: z.string(),
        owner: ownerSchema,
      }),
      errorResponseSchema: z.object({}),
    },

    logout: {
      method: "POST",
      path: "/v3/logout",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({}),
      responseSchema: z.object({}),
      errorResponseSchema: z.object({}),
    },
  },
})
