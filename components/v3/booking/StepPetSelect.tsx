"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Dog, Cat, Bird, HelpCircle, ChevronRight } from "lucide-react"
import type { V3Pet, V3Clinic } from "@/services/api.v3"
import AddPetModal from "./AddPetModal"

// Why a pet can't be selected. `appointmentId` is set when the block is caused
// by an existing appointment, so we can link the user to it for cancel/reschedule.
export interface PetDisabledInfo {
  reason: string
  appointmentId?: string
}

interface Props {
  pets: V3Pet[]
  clinics: V3Clinic[]
  onSelect: (pet: V3Pet) => void
  onPetAdded: (pet: V3Pet) => void
  // Returns disabled info when the pet cannot be selected (rendered disabled,
  // with the reason shown and, if applicable, a link to the existing
  // appointment), or null when it's selectable.
  disabledInfo?: (pet: V3Pet) => PetDisabledInfo | null
}

function PetIcon({ species }: { species?: string | null }) {
  const cls = "h-8 w-8 text-primary-2"
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

export default function StepPetSelect({
  pets,
  clinics,
  onSelect,
  onPetAdded,
  disabledInfo,
}: Props) {
  const [showAddPet, setShowAddPet] = useState(false)
  const router = useRouter()

  return (
    <div>
      <div className="space-y-3">
        {pets.map((pet) => {
          const disabled = disabledInfo?.(pet) ?? null
          if (disabled) {
            return (
              <div
                key={pet.id}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50 text-left"
              >
                <div className="flex-shrink-0 h-14 w-14 rounded-full bg-gray-200 flex items-center justify-center opacity-50">
                  <PetIcon species={pet.species} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-primary-1 text-base opacity-50">
                    {pet.name}
                  </div>
                  <div className="text-sm text-gray-400">{disabled.reason}</div>
                  {disabled.appointmentId && (
                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          `/v3/appointments/${disabled.appointmentId}`,
                        )
                      }
                      className="mt-1 text-sm font-medium text-primary-2 hover:underline"
                    >
                      View appointment →
                    </button>
                  )}
                </div>
              </div>
            )
          }
          return (
            <button
              key={pet.id}
              onClick={() => onSelect(pet)}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-primary-2 hover:bg-primary-2/5 transition-all text-left group"
            >
              <div className="flex-shrink-0 h-14 w-14 rounded-full bg-primary-2/10 flex items-center justify-center">
                <PetIcon species={pet.species} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-primary-1 text-base">
                  {pet.name}
                </div>
                <div className="text-sm text-gray-500">{petSubtitle(pet)}</div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary-2 transition-colors flex-shrink-0" />
            </button>
          )
        })}

        <button
          onClick={() => setShowAddPet(true)}
          className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-primary-2 hover:bg-primary-2/5 transition-all text-left group"
        >
          <div className="flex-shrink-0 h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-primary-2/10 transition-colors">
            <Plus className="h-6 w-6 text-gray-400 group-hover:text-primary-2 transition-colors" />
          </div>
          <div>
            <div className="font-semibold text-gray-600 group-hover:text-primary-1 transition-colors">
              Add a new pet
            </div>
            <div className="text-sm text-gray-400">
              Register your pet to book appointments
            </div>
          </div>
        </button>
      </div>

      {showAddPet && (
        <AddPetModal
          clinics={clinics}
          onClose={() => setShowAddPet(false)}
          onSaved={(pet) => {
            setShowAddPet(false)
            onPetAdded(pet)
          }}
        />
      )}
    </div>
  )
}
