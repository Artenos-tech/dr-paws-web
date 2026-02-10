"use client"

import React from "react"
import { Phone, AlertTriangle } from "lucide-react"

type SupportActionsProps = {
  isVisitFinished?: boolean
  onCallUs: () => void
  onSOS?: () => void
  SOSActive: boolean
}

const SupportActions: React.FC<SupportActionsProps> = ({
  isVisitFinished = false,
  onCallUs,
  onSOS,
  SOSActive,
}) => {
  return (
    <div className="space-y-1">
      <p className="font-semibold mb-4">
        {isVisitFinished
          ? "Let us know if we can help with anything!"
          : "Need help?"}
      </p>

      <div className="flex flex-wrap justify-between items-start gap-3">
        <button
          onClick={onCallUs}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-secondary-1 text-secondary-1 hover:bg-secondary-1 hover:text-white transition"
        >
          <Phone size={16} />
          Call Us
        </button>

        {SOSActive === false && (
          <button
            onClick={onSOS}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition"
          >
            <AlertTriangle size={18} />
            SOS
          </button>
        )}
      </div>
    </div>
  )
}

export default SupportActions
