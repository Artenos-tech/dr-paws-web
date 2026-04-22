"use client"

import { useRef, useState } from "react"
import api, { type V3Owner } from "@/services/api.v3"
import { ErrorResponseAPIError, SchemaAPIError } from "@/lib/apiclient"

type Step = "phone" | "otp" | "signup"

interface Props {
  onSuccess: (owner: V3Owner, token: string) => void
}

export default function V3LoginFlow({ onSuccess }: Props) {
  const [step, setStep] = useState<Step>("phone")
  const [mobile, setMobile] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [otp, setOtp] = useState(["", "", "", ""])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  const otpValue = otp.join("")

  function handleOtpInput(index: number, value: string) {
    if (!/^\d*$/.test(value)) return
    const next = [...otp]
    next[index] = value.slice(-1)
    setOtp(next)
    if (value && index < 3) otpRefs.current[index + 1]?.focus()
  }

  function handleOtpKeyDown(
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4)
    if (!text) return
    e.preventDefault()
    const next = ["", "", "", ""]
    text.split("").forEach((ch, i) => {
      next[i] = ch
    })
    setOtp(next)
    otpRefs.current[Math.min(text.length, 3)]?.focus()
  }

  function extractErrorMessage(err: unknown, fallback: string): string {
    if (err instanceof ErrorResponseAPIError) {
      const msg = (err.body as { message?: string })?.message
      return msg ?? fallback
    }
    if (err instanceof SchemaAPIError) {
      console.error("API response schema mismatch", err.schemaErrors)
      return "Something went wrong. Please try again."
    }
    return fallback
  }

  async function handleSendOTP() {
    const trimmed = mobile.trim()
    if (!/^\d{10}$/.test(trimmed)) {
      setError("Enter a valid 10-digit mobile number")
      return
    }
    setLoading(true)
    setError(null)
    const result = await api.loginOTP({ mobile: trimmed })
    setLoading(false)
    if (!result.ok) {
      setError(
        extractErrorMessage(
          result.error,
          "Failed to send OTP. Please try again.",
        ),
      )
      return
    }
    setStep("otp")
  }

  async function handleVerifyOTP() {
    if (otpValue.length !== 4) return
    setLoading(true)
    setError(null)
    const result = await api.loginVerify({
      mobile: mobile.trim(),
      otp: otpValue,
    })
    setLoading(false)
    if (!result.ok) {
      const body =
        result.error instanceof ErrorResponseAPIError
          ? (result.error.body as { errorCode?: string; message?: string })
          : null
      if (body?.errorCode === "USER_NOT_FOUND") {
        setError(null)
        setStep("signup")
        return
      }
      setError(
        extractErrorMessage(result.error, "Invalid OTP. Please try again."),
      )
      setOtp(["", "", "", ""])
      otpRefs.current[0]?.focus()
      return
    }
    const { token, owner } = result.value.body
    onSuccess(owner, token)
  }

  async function handleSignup() {
    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter your name")
      return
    }
    setLoading(true)
    setError(null)
    const result = await api.signupVerify({
      mobile: mobile.trim(),
      otp: otpValue,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    })
    setLoading(false)
    if (!result.ok) {
      setError(
        extractErrorMessage(
          result.error,
          "Failed to create account. Please try again.",
        ),
      )
      return
    }
    const { token, owner } = result.value.body
    onSuccess(owner, token)
  }

  const maskedMobile = `+91 XXXXXX${mobile.trim().slice(-4)}`

  return (
    <div className="space-y-4">
      {step === "phone" && (
        <>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Mobile number
            </label>
            <div className="flex items-center rounded-lg border border-gray-200 focus-within:border-primary-2 focus-within:ring-1 focus-within:ring-primary-2">
              <span className="border-r border-gray-200 px-3 py-2.5 text-sm text-gray-500 select-none">
                +91
              </span>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                onKeyDown={(e) => e.key === "Enter" && handleSendOTP()}
                placeholder="9876543210"
                autoFocus
                className="flex-1 bg-transparent px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            onClick={handleSendOTP}
            disabled={loading}
            className="w-full rounded-lg bg-secondary-1 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Sending OTP…" : "Send OTP"}
          </button>
        </>
      )}

      {step === "otp" && (
        <>
          <p className="text-sm text-gray-600">
            Enter the 4-digit code sent to{" "}
            <span className="font-medium text-gray-800">{maskedMobile}</span>
          </p>

          <div className="flex justify-center gap-3" onPaste={handleOtpPaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  otpRefs.current[i] = el
                }}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpInput(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                autoFocus={i === 0}
                className="h-12 w-12 rounded-lg border border-gray-200 text-center text-xl font-semibold text-gray-800 focus:border-primary-2 focus:outline-none focus:ring-1 focus:ring-primary-2"
              />
            ))}
          </div>

          {error && <p className="text-xs text-red-500 text-center">{error}</p>}

          <button
            onClick={handleVerifyOTP}
            disabled={loading || otpValue.length !== 4}
            className="w-full rounded-lg bg-secondary-1 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Verifying…" : "Continue"}
          </button>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <button
              onClick={() => {
                setStep("phone")
                setOtp(["", "", "", ""])
                setError(null)
              }}
              className="hover:text-gray-700"
            >
              ← Change number
            </button>
            <button
              onClick={handleSendOTP}
              disabled={loading}
              className="font-medium text-primary-2 hover:underline disabled:opacity-50"
            >
              Resend OTP
            </button>
          </div>
        </>
      )}

      {step === "signup" && (
        <>
          <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
            No account found for{" "}
            <span className="font-medium">{maskedMobile}</span>. Enter your name
            to create one.
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                First name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Jane"
                autoFocus
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-primary-2 focus:outline-none focus:ring-1 focus:ring-primary-2"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Last name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Smith"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-primary-2 focus:outline-none focus:ring-1 focus:ring-primary-2"
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full rounded-lg bg-secondary-1 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>

          <button
            onClick={() => {
              setStep("phone")
              setOtp(["", "", "", ""])
              setError(null)
            }}
            className="w-full text-center text-xs text-gray-500 hover:text-gray-700"
          >
            ← Use a different number
          </button>
        </>
      )}
    </div>
  )
}
