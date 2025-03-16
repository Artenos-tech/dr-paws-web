"use client"

import React from "react"
import CustomButton from "./CustomButton"
import { useRouter } from "next/navigation"

interface NoAppointmentsProps {
  displayText: string
  showButton?: boolean
}

const NoAppointments = ({ displayText, showButton }: NoAppointmentsProps) => {
  const navigate = useRouter()
  return (
    <div className="w-full flex flex-col justify-start gap-3 items-center">
      <h1 className="text-secondary-1 text-lg text-center">{displayText}</h1>
      {showButton && (
        <CustomButton
          buttonText="Book a Visit"
          buttonBackground="bg-secondary-1"
          buttonClickEvent={() => navigate.push("/user/book-appointment")}
        />
      )}
    </div>
  )
}

export default NoAppointments
