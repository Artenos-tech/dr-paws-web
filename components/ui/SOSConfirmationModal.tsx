"use client"

import React, { useState } from "react"
import { Modal, Input, Button } from "antd"

const { TextArea } = Input

type Props = {
  open: boolean
  loading?: boolean
  onConfirm: (description?: string) => void
  onCancel: () => void
}

const SOSConfirmationModal = ({
  open,
  loading,
  onConfirm,
  onCancel,
}: Props) => {
  const [description, setDescription] = useState("")

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      width={520}
      destroyOnClose
      maskClosable={false}
      maskStyle={{ backdropFilter: "blur(8px)" }}
    >
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          Are you sure you need urgent help?
        </h2>

        <p className="text-gray-600">
          The Dr Paws team will get in touch with you immediately if you do
        </p>

        <div className="space-y-1">
          <label className="text-sm text-gray-400 ">
            Briefly explain the situation (optional)
          </label>

          <TextArea
            rows={4}
            bordered
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button onClick={onCancel}>No</Button>

          <Button
            type="primary"
            danger
            loading={loading}
            onClick={() => onConfirm(description || undefined)}
          >
            Yes
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default SOSConfirmationModal