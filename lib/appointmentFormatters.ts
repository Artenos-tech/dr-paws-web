export function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number)
  const period = h >= 12 ? "PM" : "AM"
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, "0")} ${period}`
}

export function formatAppointmentType(name: string | null): string | null {
  if (!name) return null
  if (name === "Consultation") return "Vet Consultation"
  return name
}

const STATUS_PILL_CLASSES: Record<string, string> = {
  // Active / upcoming — blue
  Scheduled: "bg-blue-50 text-blue-700 ring-blue-200",
  "Awaiting Confirmation": "bg-blue-50 text-blue-700 ring-blue-200",
  Confirmed: "bg-blue-50 text-blue-700 ring-blue-200",
  "Vet Arrived": "bg-blue-50 text-blue-700 ring-blue-200",
  "Checked In": "bg-blue-50 text-blue-700 ring-blue-200",
  "In Progress": "bg-blue-50 text-blue-700 ring-blue-200",
  "In Consultation": "bg-blue-50 text-blue-700 ring-blue-200",
  // Delayed — red
  "Vet Delayed": "bg-red-50 text-red-700 ring-red-200",
  // End / completed — green
  "Checking Out": "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  // Terminal / inactive — grey
  Cancelled: "bg-gray-100 text-gray-500 ring-gray-200",
  "No Show": "bg-gray-100 text-gray-500 ring-gray-200",
  Missed: "bg-gray-100 text-gray-500 ring-gray-200",
}

export function statusPillClasses(status: string): string {
  return (
    STATUS_PILL_CLASSES[status] ?? "bg-gray-100 text-gray-700 ring-gray-200"
  )
}

const NON_CANCELLABLE_STATUSES = new Set([
  "Cancelled",
  "Completed",
  "Checking Out",
  "No Show",
  "Missed",
])

export function isCancellableStatus(status: string): boolean {
  return !NON_CANCELLABLE_STATUSES.has(status)
}
