"use client"

import { FC } from "react"
import { useRouter } from "next/navigation"
import Modal from "react-modal"

type UnserviceableModalProps = {
  isOpen: boolean
  onClose: () => void
}

const UnserviceableModal: FC<UnserviceableModalProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter()

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      className="bg-white rounded-xl p-6 w-[90%] max-w-sm outline-none"
      shouldCloseOnOverlayClick
    >
      <h2 className="text-lg font-semibold mb-2">Location not serviceable</h2>

      <p className="text-sm text-gray-600 mb-6">
        Sorry, your location is too far for a home visit.
      </p>

      <div className="flex flex-col gap-3">
        <button
          className="w-full rounded-full px-4 py-2 bg-secondary-1 text-white"
          onClick={() => {
            onClose()
            router.replace("/user/book-appointment?clinic=true")
          }}
        >
          Book Clinic Visit
        </button>

        <button
          className="w-full rounded-full px-4 py-2 border border-gray-400 text-gray-800"
          onClick={() => {
            onClose()
            router.replace("/user/book-appointment?home=true")
          }}
        >
          Select Another Address
        </button>
      </div>
    </Modal>
  )
}

export default UnserviceableModal
