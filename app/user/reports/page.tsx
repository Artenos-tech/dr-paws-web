"use client"

import { useEffect, useState, useMemo } from "react"
import PetCard from "@/components/ui/PetCard"
import { Pet } from "@/context/UserContext"
import { useAPICall } from "@/hooks/apicall"
import api from "@/services/api"
import { ClipLoader } from "react-spinners"
import { ExternalLink } from "lucide-react"
import { format } from "date-fns"

const ITEMS_PER_PAGE = 5

const Reports = () => {
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const {
    call: getMedicalHistoryForPet,
    result: medicalHistoryResult,
    loading: historyLoading,
  } = useAPICall(api.getMedicalHistoryForPet)

  const {
    call: getPets,
    result: petsResult,
    loading: petsLoading,
  } = useAPICall(api.getPets)

  useEffect(() => {
    getPets({})
  }, [])

  const handleFetchMedicalHistory = (pet: Pet) => {
    setSelectedPet(pet)
    setCurrentPage(1)
    getMedicalHistoryForPet({ pet_id: pet.id })
  }

  const pets =
    petsResult?.ok &&
    petsResult.value.body.pets.map((pet) => ({
      ...pet,
      profileImage: pet.profile_image,
      gender: pet.gender,
    }))

  const rawMedicalHistory =
    (medicalHistoryResult?.ok &&
      medicalHistoryResult.value.body.medical_history) ||
    []

  const filteredAndSortedHistory = useMemo(() => {
    return rawMedicalHistory
      .filter((entry) => {
        return (
          entry.bookingId ||
          entry.bookingDate ||
          (entry.attachments && entry.attachments.length > 0) ||
          (entry.soapNotes && entry.soapNotes.length > 0) ||
          (entry.notes && entry.notes.trim() !== "") ||
          (entry.groomingBookings && entry.groomingBookings.length > 0) ||
          (entry.resortServiceBookings &&
            entry.resortServiceBookings.length > 0)
        )
      })
      .sort((a, b) => {
        const dateA = new Date(a.bookingDate || "").getTime()
        const dateB = new Date(b.bookingDate || "").getTime()
        return dateB - dateA
      })
  }, [rawMedicalHistory])

  const totalPages = Math.ceil(filteredAndSortedHistory.length / ITEMS_PER_PAGE)
  const paginatedEntries = filteredAndSortedHistory.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  const paginate = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const formatReadableDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const day = date.getDate()
    const getOrdinal = (n: number) => {
      if (n > 3 && n < 21) return "th"
      switch (n % 10) {
        case 1:
          return "st"
        case 2:
          return "nd"
        case 3:
          return "rd"
        default:
          return "th"
      }
    }
    return `${day}${getOrdinal(day)} ${format(date, "MMMM yyyy")}`
  }

  return (
    <div className="flex flex-col w-full h-full items-center font-roca pb-20 flex-grow">
      <main className="flex flex-col w-full items-center px-8 md:px-32 lg:px-20 xl:px-40">
        <h1 className="text-3xl m-4 lg:m-12">Medical History</h1>
        <div className="flex flex-col gap-6 lg:w-full items-center">
          <div
            className={`flex justify-center items-center ${!petsLoading && "md:justify-start"} flex-wrap gap-4 my-8 md:my-4`}
          >
            {petsLoading && <ClipLoader color="#33495f" />}
            {pets &&
              pets.map((pet) => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  fetchMedicalHistory={handleFetchMedicalHistory}
                />
              ))}
          </div>

          {selectedPet && (
            <div className="w-full p-6">
              <h2 className="text-2xl font-semibold mb-4">
                {selectedPet.name}&apos;s Medical History
              </h2>
              {historyLoading ? (
                <div className="flex justify-center">
                  <ClipLoader color="#33495f" />
                </div>
              ) : filteredAndSortedHistory.length === 0 ? (
                <p className="text-gray-500 text-center">
                  No medical history found for {selectedPet.name}
                </p>
              ) : (
                <div className="space-y-8">
                  {paginatedEntries.map((entry, index) => {
                    const attachments = entry.attachments || []
                    const soapNotes = entry.soapNotes || []

                    return (
                      <div
                        key={index}
                        className="border border-gray-200 p-4 rounded-lg shadow-sm"
                      >
                        <h4 className="text-md font-bold text-primary-1 mb-2">
                          Visit to {entry.clinicName} on{" "}
                          {formatReadableDate(entry.bookingDate as string)}
                        </h4>

                        {/* Attachments Section */}
                        <div className="mb-4">
                          <h5 className="text-sm font-semibold mb-2">
                            Diagnostic Reports, Scans, and X-rays
                          </h5>
                          {attachments.length > 0 ? (
                            <div
                              className={
                                attachments.length === 1
                                  ? "flex flex-col gap-4"
                                  : attachments.length === 2
                                    ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
                                    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                              }
                            >
                              {attachments.map((attachment) => (
                                <div
                                  key={attachment.id}
                                  className="bg-primary-3 p-4 rounded-md w-full flex justify-between items-center gap-2"
                                >
                                  <p className="text-sm truncate text-gray-800 font-medium">
                                    {decodeURIComponent(attachment.name)}
                                  </p>
                                  <a
                                    href={
                                      attachment.importMetadata
                                        ?.attachmentUrl || attachment.fileId
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-500 hover:text-blue-600"
                                  >
                                    <ExternalLink size={18} />
                                  </a>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500">No reports found.</p>
                          )}
                        </div>

                        {/* SOAP Notes Section */}
                        <div>
                          <h5 className="text-sm font-semibold mb-2">
                            Prescriptions
                          </h5>
                          {soapNotes.length > 0 ? (
                            <ul className="space-y-3">
                              {soapNotes.map((note) => (
                                <li
                                  key={note.id}
                                  className="bg-primary-3 p-3 rounded-md"
                                >
                                  <ul className="list-disc pl-5 text-sm text-gray-800 space-y-1">
                                    {note.subjective && (
                                      <li>
                                        <strong>Subjective:</strong>{" "}
                                        {note.subjective}
                                      </li>
                                    )}
                                    {note.objective && (
                                      <li>
                                        <strong>Objective:</strong>{" "}
                                        {note.objective}
                                      </li>
                                    )}
                                    {note.assessment && (
                                      <li>
                                        <strong>Assessment:</strong>{" "}
                                        {note.assessment}
                                      </li>
                                    )}
                                    {note.plan && (
                                      <li>
                                        <strong>Plan:</strong> {note.plan}
                                      </li>
                                    )}
                                    {note.memo && (
                                      <li>
                                        <strong>Memo:</strong> {note.memo}
                                      </li>
                                    )}
                                  </ul>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-500">
                              No prescriptions found.
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md mr-2 disabled:opacity-50"
                      >
                        Prev
                      </button>
                      <span className="px-4 py-2 text-sm text-gray-700">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md ml-2 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Reports
