"use client"
import { useRouter } from "next/navigation"
import React from "react"
import { MdOutlineKeyboardArrowLeft } from "react-icons/md"

interface BackButtonProps {
  navigateBack?: () => void
}
const BackButton = ({ navigateBack }: BackButtonProps) => {
  const navigate = useRouter()
  return (
    <button
      type="button"
      onClick={() => (navigateBack ? navigateBack() : navigate.back())}
      className="flex gap-1 items-center self-start my-7"
    >
      <MdOutlineKeyboardArrowLeft /> Back
    </button>
  )
}

export default BackButton
