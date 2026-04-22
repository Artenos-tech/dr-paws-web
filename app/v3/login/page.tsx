"use client"

import { useRouter } from "next/navigation"
import { useV3UserContext } from "@/context/V3UserContext"
import { type V3Owner } from "@/services/api.v3"
import V3LoginFlow from "@/components/v3/V3LoginFlow"

export default function V3LoginPage() {
  const { login } = useV3UserContext()
  const router = useRouter()

  function handleSuccess(owner: V3Owner, token: string) {
    login(owner, token)
    router.push("/v3")
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl p-8">
        <h1 className="font-roca text-2xl text-primary-1 mb-6">
          Sign in to Dr. Paws
        </h1>
        <V3LoginFlow onSuccess={handleSuccess} />
      </div>
    </div>
  )
}
