"use client"

import { useV3UserContext } from "@/context/V3UserContext"

export default function V3HomePage() {
  const { owner } = useV3UserContext()

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h1 className="font-roca text-3xl text-primary-1 mb-2">
        Welcome, {owner?.firstName}
      </h1>
      <p className="text-gray-500 text-sm">You&apos;re logged in.</p>
    </div>
  )
}
