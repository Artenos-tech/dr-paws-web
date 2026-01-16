import React from "react"
import { ClipLoader } from "react-spinners"
import Modal from "react-modal"
type DeleteModalProps = {
  loading: boolean
  isOpen: boolean
  onCancel: () => void
  onConfirm: () => void
}

const DeleteModal = ({
  loading,
  isOpen,
  onCancel,
  onConfirm,
}: DeleteModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCancel}
      shouldCloseOnOverlayClick={!loading}
      overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 outline-none"
    >
      <h3 className="text-lg font-semibold mb-2">Delete address?</h3>
      <p className="text-sm text-gray-600 mb-6">
        This action cannot be undone. Are you sure?
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>

        <button
          onClick={onConfirm}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-red-600 text-white disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading && <ClipLoader size={14} color="#ffffff" />}
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </Modal>
  )
}

export default DeleteModal
