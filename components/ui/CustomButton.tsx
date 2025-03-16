"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { ClipLoader } from "react-spinners"

type ButtonProps = {
  buttonText: string
  buttonBackground: string
  buttonLink?: string
  buttonClickEvent?: () => void
  disabled?: boolean // Optional prop to disable the button
  loading?: boolean
}

const CustomButton: React.FC<ButtonProps> = ({
  buttonText,
  buttonBackground,
  buttonLink,
  buttonClickEvent,
  disabled = false,
  loading = false,
}) => {
  const router = useRouter()

  const handleClick = () => {
    if (disabled) return

    if (buttonLink) {
      router.push(buttonLink)
    } else if (buttonClickEvent) {
      buttonClickEvent()
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`font-open-sans btn rounded-full text-white px-4 md:px-10 py-2 tracking-wider text-xs md:text-base ${buttonBackground} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {loading ? <ClipLoader size={20} color="white" /> : buttonText}
    </button>
  )
}

export default CustomButton
