"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import {
  v3CreatePet,
  v3FetchSpecies,
  v3FetchBreeds,
  type V3Pet,
  type V3Clinic,
  type V3SpeciesOption,
  type V3BreedOption,
} from "@/services/api.v3"

interface Props {
  clinics: V3Clinic[]
  onClose: () => void
  onAdded: (pet: V3Pet) => void
}

const GENDERS = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Unknown", label: "Unknown" },
]

export default function AddPetModal({ clinics, onClose, onAdded }: Props) {
  const [name, setName] = useState("")
  const [species, setSpecies] = useState("")
  const [breed, setBreed] = useState("")
  const [gender, setGender] = useState("Unknown")
  const [dateOfBirth, setDateOfBirth] = useState("")

  const [speciesOptions, setSpeciesOptions] = useState<V3SpeciesOption[]>([])
  const [breedOptions, setBreedOptions] = useState<V3BreedOption[]>([])
  const [loadingBreeds, setLoadingBreeds] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    v3FetchSpecies().then(setSpeciesOptions).catch(console.error)
  }, [])

  useEffect(() => {
    if (!species) {
      setBreedOptions([])
      setBreed("")
      return
    }
    setLoadingBreeds(true)
    setBreed("")
    v3FetchBreeds(species)
      .then(setBreedOptions)
      .catch(console.error)
      .finally(() => setLoadingBreeds(false))
  }, [species])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError("Pet name is required")
      return
    }
    if (!clinics.length) {
      setError("No clinics available. Please try again later.")
      return
    }

    setLoading(true)
    setError(null)
    try {
      const pet = await v3CreatePet({
        name: name.trim(),
        clinicId: clinics[0].id,
        species: species || undefined,
        breed: breed || undefined,
        gender: gender || undefined,
        dateOfBirth: dateOfBirth || null,
      })
      onAdded(pet)
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to add pet. Please try again.",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h3 className="font-roca text-xl text-primary-1">Add a new pet</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Pet name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Buddy"
              autoFocus
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-primary-2 focus:outline-none focus:ring-1 focus:ring-primary-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Species
              </label>
              <select
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 focus:border-primary-2 focus:outline-none focus:ring-1 focus:ring-primary-2 bg-white"
              >
                <option value="">Select…</option>
                {speciesOptions.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 focus:border-primary-2 focus:outline-none focus:ring-1 focus:ring-primary-2 bg-white"
              >
                {GENDERS.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {species && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Breed
              </label>
              <select
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                disabled={loadingBreeds}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 focus:border-primary-2 focus:outline-none focus:ring-1 focus:ring-primary-2 bg-white disabled:opacity-60"
              >
                <option value="">
                  {loadingBreeds ? "Loading…" : "Select breed…"}
                </option>
                {breedOptions.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Date of birth
            </label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 focus:border-primary-2 focus:outline-none focus:ring-1 focus:ring-primary-2"
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-secondary-1 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Adding…" : "Add pet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
