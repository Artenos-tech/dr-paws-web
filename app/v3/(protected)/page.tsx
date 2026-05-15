"use client"

import { useEffect, useState } from "react"
import {
  Pencil,
  Plus,
  Dog,
  Cat,
  Bird,
  HelpCircle,
  User,
  Mail,
  Phone,
} from "lucide-react"
import { X } from "lucide-react"
import ClipLoader from "react-spinners/ClipLoader"
import { useV3UserContext } from "@/context/V3UserContext"
import AddPetModal from "@/components/v3/booking/AddPetModal"
import {
  v3FetchPets,
  v3FetchClinics,
  v3UpdateOwner,
  type V3Pet,
  type V3Clinic,
  type V3Owner,
} from "@/services/api.v3"

// ─── Pet species icon ─────────────────────────────────────────────────────────

function PetIcon({ species }: { species?: string | null }) {
  const cls = "h-5 w-5 text-primary-2"
  if (species === "canine") return <Dog className={cls} />
  if (species === "feline") return <Cat className={cls} />
  if (species === "avian") return <Bird className={cls} />
  return <HelpCircle className={cls} />
}

// ─── Edit profile modal ───────────────────────────────────────────────────────

function EditProfileModal({
  owner,
  onClose,
  onSaved,
}: {
  owner: V3Owner
  onClose: () => void
  onSaved: (updated: V3Owner) => void
}) {
  const [firstName, setFirstName] = useState(owner.firstName)
  const [lastName, setLastName] = useState(owner.lastName)
  const [email, setEmail] = useState(owner.email ?? "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!firstName.trim() || !lastName.trim()) {
      setError("First and last name are required")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const updated = await v3UpdateOwner({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim() || null,
      })
      onSaved(updated)
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Failed to update profile. Please try again.",
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
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-xl">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h3 className="font-roca text-xl text-primary-1">Edit profile</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                First name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoFocus
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 focus:border-primary-2 focus:outline-none focus:ring-1 focus:ring-primary-2"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Last name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 focus:border-primary-2 focus:outline-none focus:ring-1 focus:ring-primary-2"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-primary-2 focus:outline-none focus:ring-1 focus:ring-primary-2"
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
              {loading ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Home page ────────────────────────────────────────────────────────────────

export default function V3HomePage() {
  const { owner, setOwner } = useV3UserContext()

  const [pets, setPets] = useState<V3Pet[]>([])
  const [clinics, setClinics] = useState<V3Clinic[]>([])
  const [petsLoading, setPetsLoading] = useState(true)

  const [editingProfile, setEditingProfile] = useState(false)
  const [petModalOpen, setPetModalOpen] = useState(false)
  const [petToEdit, setPetToEdit] = useState<V3Pet | null>(null)

  useEffect(() => {
    Promise.all([v3FetchPets(), v3FetchClinics()])
      .then(([p, c]) => {
        setPets(p)
        setClinics(c)
      })
      .catch(console.error)
      .finally(() => setPetsLoading(false))
  }, [])

  if (!owner) return null

  const displayPhone = owner.countryCode
    ? `+${owner.countryCode} ${owner.phoneNumber}`
    : owner.phoneNumber

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-5">
      <h1 className="font-roca text-2xl text-primary-1">
        Welcome, {owner.firstName}
      </h1>

      {/* Profile section */}
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <span className="text-sm font-semibold text-gray-700">
            My Profile
          </span>
          <button
            onClick={() => setEditingProfile(true)}
            className="flex items-center gap-1 text-xs font-medium text-primary-2 hover:underline"
          >
            <Pencil className="h-3 w-3" />
            Edit
          </button>
        </div>

        <div className="divide-y divide-gray-50">
          <div className="flex items-center gap-3 px-4 py-3">
            <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-800">
              {owner.firstName} {owner.lastName}
            </span>
          </div>
          {owner.email && (
            <div className="flex items-center gap-3 px-4 py-3">
              <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-800">{owner.email}</span>
            </div>
          )}
          <div className="flex items-center gap-3 px-4 py-3">
            <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-700">{displayPhone}</span>
          </div>
        </div>
      </div>

      {/* Pets section */}
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <span className="text-sm font-semibold text-gray-700">My Pets</span>
          <button
            onClick={() => {
              setPetToEdit(null)
              setPetModalOpen(true)
            }}
            className="flex items-center gap-1 text-xs font-medium text-primary-2 hover:underline"
          >
            <Plus className="h-3.5 w-3.5" />
            Add pet
          </button>
        </div>

        {petsLoading ? (
          <div className="flex justify-center py-6">
            <ClipLoader color="#33495f" size={22} />
          </div>
        ) : pets.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6">
            No pets yet. Add your first pet to get started.
          </p>
        ) : (
          <div className="divide-y divide-gray-50">
            {pets.map((pet) => {
              const subtitle = [pet.species, pet.breed, pet.gender]
                .filter(Boolean)
                .map((s) => s!.charAt(0).toUpperCase() + s!.slice(1))
                .join(" · ")

              return (
                <div key={pet.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex-shrink-0 h-9 w-9 rounded-full bg-primary-2/10 flex items-center justify-center">
                    <PetIcon species={pet.species} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-primary-1">
                      {pet.name}
                    </div>
                    {subtitle && (
                      <div className="text-xs text-gray-500 mt-0.5">
                        {subtitle}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setPetToEdit(pet)
                      setPetModalOpen(true)
                    }}
                    className="flex items-center gap-1 text-xs font-medium text-primary-2 hover:underline flex-shrink-0"
                  >
                    <Pencil className="h-3 w-3" />
                    Edit
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      {editingProfile && (
        <EditProfileModal
          owner={owner}
          onClose={() => setEditingProfile(false)}
          onSaved={(updated) => {
            setOwner(updated)
            setEditingProfile(false)
          }}
        />
      )}

      {petModalOpen && (
        <AddPetModal
          clinics={clinics}
          petToEdit={petToEdit ?? undefined}
          onClose={() => setPetModalOpen(false)}
          onSaved={(saved) => {
            setPets((prev) =>
              petToEdit
                ? prev.map((p) => (p.id === saved.id ? saved : p))
                : [...prev, saved],
            )
            setPetModalOpen(false)
          }}
        />
      )}
    </div>
  )
}
