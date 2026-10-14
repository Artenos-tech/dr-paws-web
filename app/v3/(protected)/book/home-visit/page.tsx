"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"

import HomeVisitFlow from "@/components/v3/booking/HomeVisitFlow"

function HomeVisitContent() {
  const couponCode = useSearchParams().get("couponCode") ?? undefined
  return <HomeVisitFlow couponCode={couponCode} />
}

export default function HomeVisitPage() {
  return (
    <Suspense fallback={null}>
      <HomeVisitContent />
    </Suspense>
  )
}
