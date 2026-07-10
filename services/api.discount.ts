// Client for the new discount-code-applications backend (api.drpaws.care).
// This is a distinct service from the main booking API in `services/api.ts`
// (different host, different auth scheme, different response envelope) — kept
// as its own file since it's expected to grow into the replacement for a lot
// of what api.ts currently does.
import { createAPIClient, RequestContext, z } from "../lib/apiclient"

export { ErrorResponseAPIError } from "../lib/apiclient"

const DISCOUNT_API_BASE_URL = process.env
  .NEXT_PUBLIC_DISCOUNT_API_BASE_URL as string

export const discountRequestContext = new RequestContext()

export default createAPIClient({
  baseUrl: DISCOUNT_API_BASE_URL,
  baseResponseSchema: z.object({}),
  requestContext: discountRequestContext,
  endpointConfig: {
    applyDiscountCode: {
      method: "POST",
      path: "/drpaws/discount-code-applications",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({
        appointment_id: z.string().uuid(),
        user_id: z.string().uuid(),
        discount_code: z.string(),
      }),
      responseSchema: z.object({
        id: z.number(),
        appointment_id: z.string(),
        user_id: z.string(),
        discount_code: z.string(),
        applied_at: z.string(),
      }),
      // 400 (invalid code) and 409 (already used) share this shape; the
      // caller distinguishes them via the error's `status` field.
      errorResponseSchema: z.object({
        detail: z.union([z.string(), z.array(z.unknown())]),
      }),
    },
  },
})
