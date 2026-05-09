"use client"

import { useEffect, useState } from "react"
import { ArrowLeft } from "lucide-react"
import ClipLoader from "react-spinners/ClipLoader"
import {
  v3FetchPets,
  v3FetchDocuments,
  type V3Pet,
  type V3DocumentCounts,
} from "@/services/api.v3"
import PetSelector from "@/components/v3/records/PetSelector"
import DocumentTabs, { type TabDef } from "@/components/v3/records/DocumentTabs"

const HEALTH_TABS: TabDef[] = [
  { type: "diagnostic", label: "Diagnostics", countKey: "diagnostics" },
  { type: "emr", label: "Medical Records", countKey: "emrs" },
  { type: "prescription", label: "Prescriptions", countKey: "prescriptions" },
  { type: "vaccination", label: "Vaccinations", countKey: "vaccinations" },
  { type: "consent_form", label: "Consent Forms", countKey: "consent_forms" },
]

export default function MedicalHistoryPage() {
  const [pets, setPets] = useState<V3Pet[]>([])
  const [selectedPet, setSelectedPet] = useState<V3Pet | null>(null)
  const [counts, setCounts] = useState<V3DocumentCounts | null>(null)
  const [petsLoading, setPetsLoading] = useState(true)
  const [countsLoading, setCountsLoading] = useState(false)

  useEffect(() => {
    v3FetchPets()
      .then(setPets)
      .finally(() => setPetsLoading(false))
  }, [])

  useEffect(() => {
    if (!selectedPet) {
      setCounts(null)
      return
    }
    setCountsLoading(true)
    v3FetchDocuments({ petId: selectedPet.id })
      .then(({ counts }) => setCounts(counts))
      .catch(() => setCounts(null))
      .finally(() => setCountsLoading(false))
  }, [selectedPet])

  if (petsLoading) {
    return (
      <div className="flex justify-center items-center my-20">
        <ClipLoader color="#33495f" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {selectedPet ? (
        <>
          <button
            onClick={() => setSelectedPet(null)}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-1 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            All pets
          </button>
          <h1 className="font-roca text-2xl text-primary-1 mb-5">
            {selectedPet.name}&apos;s Medical History
          </h1>
          {countsLoading ? (
            <div className="flex justify-center py-8">
              <ClipLoader color="#33495f" size={24} />
            </div>
          ) : (
            <DocumentTabs
              tabs={HEALTH_TABS}
              counts={counts}
              petId={selectedPet.id}
            />
          )}
        </>
      ) : (
        <>
          <h1 className="font-roca text-2xl text-primary-1 mb-5">
            Medical History
          </h1>
          <p className="text-sm text-gray-500 mb-5">
            Select a pet to view their medical history.
          </p>
          <PetSelector pets={pets} onSelect={setSelectedPet} />
        </>
      )}
    </div>
  )
}
