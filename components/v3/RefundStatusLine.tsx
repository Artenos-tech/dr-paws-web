import type { V3HomeVisitRefundSummary } from "@/services/api.v3"

interface Props {
  refund: V3HomeVisitRefundSummary
  // When true, show ISO timestamps spelled out with date + time (detail
  // page). When false, just the date (list card).
  verbose?: boolean
}

function fmtDate(iso: string, withTime: boolean): string {
  const d = new Date(iso)
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
    timeZone: "Asia/Kolkata",
  })
}

export default function RefundStatusLine({ refund, verbose = false }: Props) {
  const amount = `₹${refund.amount}`

  if (refund.status === "INITIATED") {
    return (
      <p className="text-sm text-amber-700 flex items-start gap-2">
        <span
          aria-hidden
          className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0"
        />
        <span>
          {amount} refund initiated
          {verbose && (
            <>
              {" "}
              on{" "}
              <span className="font-medium">
                {fmtDate(refund.initiatedAt, true)}
              </span>{" "}
              (processing)
            </>
          )}
        </span>
      </p>
    )
  }

  if (refund.status === "COMPLETED") {
    return (
      <p className="text-sm text-emerald-700 flex items-start gap-2">
        <span
          aria-hidden
          className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0"
        />
        <span>
          {amount} refunded
          {refund.completedAt && (
            <>
              {" "}
              on{" "}
              <span className="font-medium">
                {fmtDate(refund.completedAt, verbose)}
              </span>
            </>
          )}
        </span>
      </p>
    )
  }

  // FAILED
  return (
    <p className="text-sm text-red-700 flex items-start gap-2">
      <span
        aria-hidden
        className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-red-500 shrink-0"
      />
      <span>Refund failed — please contact support.</span>
    </p>
  )
}
