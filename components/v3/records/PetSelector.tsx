"use client"

import { Dog, Cat, Bird, HelpCircle, ChevronRight } from "lucide-react"
import type { V3Pet } from "@/services/api.v3"

function PetIcon({ species }: { species?: string | null }) {
  const cls = "h-7 w-7 text-primary-2"
  if (species === "canine") return <Dog className={cls} />
  if (species === "feline") return <Cat className={cls} />
  if (species === "avian") return <Bird className={cls} />
  return <HelpCircle className={cls} />
}

function petSubtitle(pet: V3Pet): string {
  const parts: string[] = []
  if (pet.species)
    parts.push(pet.species.charAt(0).toUpperCase() + pet.species.slice(1))
  if (pet.breed) parts.push(pet.breed)
  return parts.join(" · ") || "Pet"
}

interface Props {
  pets: V3Pet[]
  onSelect: (pet: V3Pet) => void
}

export default function PetSelector({ pets, onSelect }: Props) {
  if (pets.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-sm">No pets found. Add a pet to get started.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {pets.map((pet) => (
        <button
          key={pet.id}
          onClick={() => onSelect(pet)}
          className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:border-primary-2 hover:bg-primary-2/5 transition-all text-left group shadow-sm"
        >
          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary-2/10 flex items-center justify-center">
            <PetIcon species={pet.species} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-primary-1">{pet.name}</div>
            <div className="text-sm text-gray-500">{petSubtitle(pet)}</div>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary-2 transition-colors flex-shrink-0" />
        </button>
      ))}
    </div>
  )
}
