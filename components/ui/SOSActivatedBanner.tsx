"use client"

<<<<<<< HEAD
import { PhoneCall } from "lucide-react"
=======
import { PhoneCall, MessageCircle } from "lucide-react"
>>>>>>> d3c06ab (Added sos raise and cancel flow)

type Props = {
  onCancelSOS: () => void
  loading?: boolean
<<<<<<< HEAD
  onCallUs: () => void
}

const SOSActivatedBanner = ({ onCancelSOS, loading, onCallUs }: Props) => {
=======
  onCallUs:()=>void
}

const SOSActivatedBanner = ({ onCancelSOS, loading,onCallUs }: Props) => {
    
>>>>>>> d3c06ab (Added sos raise and cancel flow)
  return (
    <div className="bg-red-700 w-[100%] text-white rounded-xl p-6 space-y-4 mb-6">
      <h2 className="text-2xl font-bold text-white">SOS Mode Activated</h2>

      <p>
        Help is on the way — the support team has been notified and will contact
<<<<<<< HEAD
        you shortly. If you need immediate assistance, you can also
      </p>

      <div className="space-y-2">
=======
        you shortly.
      </p>

      <p>
        If you need immediate assistance, you can also use one of the options
        below
      </p>

      <div className="space-y-2">
      
>>>>>>> d3c06ab (Added sos raise and cancel flow)
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
