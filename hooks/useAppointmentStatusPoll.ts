import { useEffect, useRef, useState } from "react"
import {
  v3GetAppointmentStatus,
  type V3AppointmentStatus,
} from "@/services/api.v3"

const POLL_INTERVAL_MS = 30_000

const TERMINAL_STATUSES = new Set([
  "Completed",
  "Cancelled",
  "No Show",
  "Missed",
])

export function useAppointmentStatusPoll(
  id: string,
  enabled: boolean,
  initialStatus: string,
): V3AppointmentStatus | null {
  const [status, setStatus] = useState<V3AppointmentStatus | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!enabled || TERMINAL_STATUSES.has(initialStatus)) return

    function clear() {
      if (intervalRef.current != null) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    async function poll() {
      try {
        const result = await v3GetAppointmentStatus(id)
        setStatus(result)
        if (TERMINAL_STATUSES.has(result.visitStatus)) clear()
      } catch {
        // silently ignore poll failures
      }
    }

    poll()
    intervalRef.current = setInterval(poll, POLL_INTERVAL_MS)
    return clear
  }, [id, enabled, initialStatus])

  return status
}
