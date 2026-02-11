"use client"

import { PhoneCall } from "lucide-react"

type Props = {
  onCancelSOS: () => void
  loading?: boolean
  onCallUs: () => void
}

const SOSActivatedBanner = ({ onCancelSOS, loading, onCallUs }: Props) => {
  return (
    <div className="bg-red-700 w-[100%] text-white rounded-xl p-6 space-y-4 mb-6">
      <h2 className="text-2xl font-bold text-white">SOS Mode Activated</h2>

      <p>
        Help is on the way — the support team has been notified and will contact
        you shortly. If you need immediate assistance, you can also use
      </p>

      <div className="space-y-2">
        <div className="flex items-center gap-2 cursor-pointer">
          <PhoneCall onClick={onCallUs} /> Call Us
        </div>
      </div>

      <p className="text-sm opacity-90">
        If this was a mistake or you no longer need help, you can always cancel
        the SOS
      </p>

      <button
        onClick={onCancelSOS}
        disabled={loading}
        className="w-full bg-white text-black py-3 rounded-lg font-semibold disabled:opacity-50"
      >
        Cancel SOS
      </button>
    </div>
  )
}

export default SOSActivatedBanner
