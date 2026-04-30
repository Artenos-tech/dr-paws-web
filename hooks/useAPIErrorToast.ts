import { useEffect, useRef } from "react"
import toast from "react-hot-toast"

type APIError = {
  apiClientError?: boolean
  apiClientErrorType?: string
  message?: string
  status?: number
  fetchError?: Error
}

type APIResult<T = any> =
  | { ok: true; value: T }
  | { ok: false; error: APIError }

type Options = {
  fallbackMessage?: string
}

export function useAPIErrorToastFromResult(
  result?: APIResult | null,
  options?: Options,
) {
  const lastErrorRef = useRef<APIError | null>(null)

  useEffect(() => {
    if (!result || result.ok) {
      lastErrorRef.current = null
      return
    }

    const error = result.error
    if (!error) return

    if (lastErrorRef.current === error) return
    lastErrorRef.current = error

    if (
      error.apiClientErrorType === "FetchAPIError" &&
      error.fetchError?.name === "AbortError"
    ) {
      return
    }

    const fallback =
      options?.fallbackMessage ?? "Something went wrong. Please try again."

    if (!error.apiClientError) {
      toast.error(fallback)
      return
    }

    const status = error.status ?? 0

    if (status >= 400 && status < 500) {
      toast.error(error.message || "Request failed")
      return
    }

    toast.error(fallback)
  }, [result, options?.fallbackMessage])
}
