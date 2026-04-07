"use client"

import { format, parseISO } from "date-fns"
import { CheckCircle, PhoneCall, X } from "lucide-react"

type ActiveProps = {
  variant: "active"
  onCancelSOS: () => void
  loading?: boolean
  onCallUs: () => void
}

type ResolvedProps = {
  variant: "resolved"
  resolvedAt?: string
  resolutionNotes?: string
  onDismiss?: () => void
}

type ResolvedCompactProps = {
  variant: "resolved-compact"
  resolvedAt?: string
  resolutionNotes?: string
  onDismiss?: () => void
}

type Props = ActiveProps | ResolvedProps | ResolvedCompactProps

const SOSActivatedBanner = (props: Props) => {
  if (props.variant === "resolved-compact") {
    return (
      <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-6">
        <CheckCircle size={14} className="shrink-0" />
        <div className="flex-1">
          <span className="font-medium">SOS resolved</span>
          {props.resolvedAt && (
            <span className="text-green-600">
              {" · "}
              {format(parseISO(props.resolvedAt), "dd MMM yyyy, h:mm a")}
            </span>
          )}
          {props.resolutionNotes && (
            <p className="text-green-600 mt-0.5">{props.resolutionNotes}</p>
          )}
        </div>
        {props.onDismiss && (
          <button
            onClick={props.onDismiss}
            className="shrink-0 text-green-600 hover:text-green-800 transition"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        )}
      </div>
    )
  }

  if (props.variant === "resolved") {
    return (
      <div className="relative bg-green-700 w-[100%] text-white rounded-xl p-6 space-y-3 mb-6">
        {props.onDismiss && (
          <button
            onClick={props.onDismiss}
            className="absolute top-3 right-3 text-white/70 hover:text-white transition"
            aria-label="Dismiss"
          >
            <X size={18} />
          </button>
        )}
        <div className="flex items-center gap-2">
          <CheckCircle size={24} />
          <h2 className="text-2xl font-bold text-white">SOS Resolved</h2>
        </div>
        <p>Our support team has resolved your SOS alert.</p>
        {props.resolvedAt && (
          <p className="text-sm opacity-90">
            Resolved at{" "}
            {format(parseISO(props.resolvedAt), "dd MMM yyyy, h:mm a")}
          </p>
        )}
        {props.resolutionNotes && (
          <p className="text-sm opacity-90">Notes: {props.resolutionNotes}</p>
        )}
      </div>
    )
  }

  return (
    <div className="bg-red-700 w-[100%] text-white rounded-xl p-6 space-y-4 mb-6">
      <h2 className="text-2xl font-bold text-white">SOS Mode Activated</h2>

      <p>
        Help is on the way — the support team has been notified and will contact
        you shortly.
      </p>

      <p>
        If you need immediate assistance, you can also use one of the options
        below
      </p>

      <div className="space-y-2">
        <div className="flex items-center gap-2 cursor-pointer">
          <PhoneCall onClick={props.onCallUs} /> Call Us
        </div>
      </div>

      <p className="text-sm opacity-90">
        If this was a mistake or you no longer need help, you can always cancel
        the SOS
      </p>

      <button
        onClick={props.onCancelSOS}
        disabled={props.loading}
        className="w-full bg-white text-black py-3 rounded-lg font-semibold disabled:opacity-50"
      >
        Cancel SOS
      </button>
    </div>
  )
}

export default SOSActivatedBanner
