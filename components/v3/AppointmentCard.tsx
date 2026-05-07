import { CalendarDays, Clock, MapPin, Stethoscope, Home } from "lucide-react"
import type { V3AppointmentListItem } from "@/services/api.v3"

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number)
  const period = h >= 12 ? "PM" : "AM"
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, "0")} ${period}`
}

interface Props {
  item: V3AppointmentListItem
}

export default function AppointmentCard({ item }: Props) {
  const isHomeVisit = item.bookingType === "HOME_VISIT"
  const status = isHomeVisit ? item.visitStatus : item.clinicStatus

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-semibold text-primary-1 truncate">
              {item.petName}
            </h3>
            {isHomeVisit ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-1/10 text-primary-1 text-xs px-2 py-0.5">
                <Home className="h-3 w-3" /> Home Visit
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 text-gray-600 text-xs px-2 py-0.5">
                <Stethoscope className="h-3 w-3" /> Clinic Visit
              </span>
            )}
          </div>
          {item.appointmentTypeName && (
            <p className="text-sm text-gray-500">{item.appointmentTypeName}</p>
          )}
        </div>
        <span className="shrink-0 rounded-full bg-primary-2/10 text-primary-2 text-xs px-2 py-1">
          {status}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-1.5 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-gray-400 shrink-0" />
          <span>{formatDate(item.date)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-400 shrink-0" />
          <span>
            {formatTime(item.startTime)} – {formatTime(item.endTime)}
          </span>
        </div>
        {isHomeVisit ? (
          item.address ? (
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
              <span className="min-w-0">
                {item.address.line1}
                {item.address.line2 ? `, ${item.address.line2}` : ""},{" "}
                {item.address.pincode}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-500 italic">
              <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
              <span>Address not available</span>
            </div>
          )
        ) : (
          <div className="flex items-start gap-2">
            {/* <MapPin className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
            <span className="min-w-0">{item.clinicName}</span> */}
          </div>
        )}
        <div className="text-sm text-gray-600 mt-1">
          With <span className="font-medium">{item.doctorName}</span>
        </div>
        {item.reasonForVisit && (
          <p className="text-sm text-gray-500 italic mt-1 line-clamp-2">
            “{item.reasonForVisit}”
          </p>
        )}
      </div>
    </div>
  )
}
