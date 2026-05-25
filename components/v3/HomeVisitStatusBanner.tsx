import {
  Info,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Activity,
  XCircle,
} from "lucide-react"

interface Props {
  visitStatus: string
  doctorName: string
  startOtp: string | null
}

type BannerConfig = {
  icon: React.ReactNode
  bg: string
  border: string
  text: string
  title: string
  body: string
}

function getConfig(
  visitStatus: string,
  doctorName: string,
): BannerConfig | null {
  switch (visitStatus) {
    case "Awaiting Confirmation":
      return {
        icon: <Info className="h-4 w-4 shrink-0 mt-0.5" />,
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-800",
        title: "Booking received",
        body: "We're assigning a vet to your booking. Our team will call 30 min before arrival.",
      }
    case "Confirmed":
      return {
        icon: <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />,
        bg: "bg-secondary-1/10",
        border: "border-secondary-1/30",
        text: "text-primary-1",
        title: "Vet confirmed",
        body: `Your vet ${doctorName} has been confirmed for this visit.`,
      }
    case "Vet Delayed":
      return {
        icon: <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />,
        bg: "bg-red-50",
        border: "border-red-200",
        text: "text-red-800",
        title: "Your vet is running a bit late",
        body: "We apologise for the delay. You may cancel this visit for a full refund.",
      }
    case "Vet Arrived":
      return {
        icon: <MapPin className="h-4 w-4 shrink-0 mt-0.5" />,
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        text: "text-emerald-800",
        title: "Your vet has arrived!",
        body: "Please share the code below with your vet to begin the visit.",
      }
    case "In Progress":
      return {
        icon: <Activity className="h-4 w-4 shrink-0 mt-0.5 animate-pulse" />,
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-800",
        title: "Visit in progress",
        body: "Your vet is with your pet right now.",
      }
    case "Completed":
      return {
        icon: <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />,
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        text: "text-emerald-800",
        title: "Visit complete",
        body: "Your vet has finished the visit. Thank you for choosing Dr. Paws!",
      }
    case "Cancelled":
      return {
        icon: <XCircle className="h-4 w-4 shrink-0 mt-0.5" />,
        bg: "bg-gray-50",
        border: "border-gray-200",
        text: "text-gray-600",
        title: "Appointment cancelled",
        body: "This appointment was cancelled.",
      }
    case "No Show":
    case "Missed":
      return {
        icon: <XCircle className="h-4 w-4 shrink-0 mt-0.5" />,
        bg: "bg-gray-50",
        border: "border-gray-200",
        text: "text-gray-600",
        title: "Appointment not completed",
        body: "This appointment did not take place.",
      }
    default:
      return null
  }
}

export default function HomeVisitStatusBanner({
  visitStatus,
  doctorName,
  startOtp,
}: Props) {
  const config = getConfig(visitStatus, doctorName)
  if (!config) return null

  return (
    <div className={`rounded-xl border ${config.bg} ${config.border} p-4 mb-4`}>
      <div className={`flex items-start gap-2.5 ${config.text}`}>
        {config.icon}
        <div className="min-w-0">
          <p className="text-sm font-semibold">{config.title}</p>
          <p className="text-sm mt-0.5 opacity-90">{config.body}</p>
          {visitStatus === "Vet Arrived" && startOtp && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white border border-emerald-200 px-3 py-2">
              <span className="text-xs text-gray-500 font-medium">
                Visit code
              </span>
              <span className="text-xl font-bold tracking-widest text-emerald-700">
                {startOtp}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
