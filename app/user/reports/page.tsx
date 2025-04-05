"use client"

import PetCard from "@/components/ui/PetCard"
import { Pet } from "@/context/UserContext"
import { useAPICall } from "@/hooks/apicall"
import api from "@/services/api"
import { ExternalLink } from "lucide-react"
import { useEffect, useState } from "react"
import { ClipLoader } from "react-spinners"

const Reports = () => {
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [currentPageReports, setCurrentPageReports] = useState(1)
  const [currentPagePrescriptions, setCurrentPagePrescriptions] = useState(1)
  const prescriptionsPerPage = 2
  const itemsPerPage = 6
  const indexOfLastItemReports = currentPageReports * itemsPerPage
  const indexOfFirstItemReports = indexOfLastItemReports - itemsPerPage
  const indexOfLastItemPrescriptions =
    currentPagePrescriptions * prescriptionsPerPage
  const indexOfFirstItemPrescriptions =
    indexOfLastItemPrescriptions - prescriptionsPerPage

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
    getMedicalHistoryForPet({ pet_id: pet.vetPortId.toString() })
  }

  const pets =
    petsResult?.ok &&
    petsResult.value.body.pets.map((pet) => ({
      ...pet,
      profileImage: pet.profile_image,
      vetPortId: pet.vetport_id,
      gender: pet.gender,
    }))

  const medicalHistory =
    (medicalHistoryResult?.ok &&
      medicalHistoryResult.value.body.medical_history) ||
    null
  const currentAttachments =
    medicalHistory?.attachments?.slice(
      indexOfFirstItemReports,
      indexOfLastItemReports,
    ) || []
  const prescriptions = medicalHistory?.prescriptions || {}

  const paginateReports = (pageNumber: number) =>
    setCurrentPageReports(pageNumber)

  const paginatePrescriptions = (page: number) => {
    const totalPages =
      prescriptions &&
      Math.ceil(Object.keys(prescriptions).length / prescriptionsPerPage)
    if (page >= 1 && totalPages && page <= totalPages) {
      setCurrentPagePrescriptions(page)
    }
  }

  const currentPrescriptions = Object.entries(prescriptions)
    .slice(indexOfFirstItemPrescriptions, indexOfLastItemPrescriptions)
    .map(([dateAndTime, prescriptionLines]) => ({
      dateAndTime,
      prescriptionLines,
    }))

  return (
    <div className="flex flex-col w-full h-full items-center font-roca pb-20 flex-grow ">
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
                  key={pet.vetPortId}
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
              ) : (
                <div>
                  {/* Prescriptions Section */}
                  <div className="mb-8 flex flex-col justify-between">
                    {Object.keys(prescriptions).length > 0 ? (
                      <>
                        <h3 className="text-lg font-semibold mb-4">
                          Prescriptions
                        </h3>
                        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {currentPrescriptions.map(
                            ({ dateAndTime, prescriptionLines }, index) => (
                              <li
                                key={index}
                                className="bg-primary-3 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                              >
                                <div className="flex flex-col">
                                  <div className="font-semibold text-sm text-secondary-1 p-2">
                                    {dateAndTime}
                                  </div>
                                  <ul className="space-y-2">
                                    {prescriptionLines.map(
                                      (prescription, prescriptionIndex) => (
                                        <li
                                          key={prescriptionIndex}
                                          className="p-2"
                                        >
                                          {prescription}
                                        </li>
                                      ),
                                    )}
                                  </ul>
                                </div>
                              </li>
                            ),
                          )}
                        </ul>
                        <div className="flex justify-center mt-4">
                          <button
                            onClick={() =>
                              paginatePrescriptions(
                                currentPagePrescriptions - 1,
                              )
                            }
                            disabled={currentPagePrescriptions === 1}
                            className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md mr-2 disabled:opacity-50"
                          >
                            Prev
                          </button>
                          <button
                            onClick={() =>
                              paginatePrescriptions(
                                currentPagePrescriptions + 1,
                              )
                            }
                            disabled={
                              currentPagePrescriptions ===
                              Math.ceil(
                                Object.keys(prescriptions).length /
                                  prescriptionsPerPage,
                              )
                            }
                            className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md ml-2 disabled:opacity-50"
                          >
                            Next
                          </button>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-500 text-center">
                        No prescriptions found for {selectedPet.name}
                      </p>
                    )}
                  </div>

                  <div className="mb-8 flex flex-col justify-between">
                    {/* Diagnostic Reports, Scans, and Xrays Section */}
                    {medicalHistory && medicalHistory.attachments.length > 0 ? (
                      <>
                        <h3 className="text-lg font-semibold mb-4">
                          Diagnostic Reports, Scans, and Xrays
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 min-h-80 md:min-h-80 lg:min-h-60">
                          {currentAttachments.map(
                            (record: string, index: number) => (
                              <div
                                key={index}
                                className="relative bg-primary-3 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col max-w-xs max-h-24"
                              >
                                <a
                                  href={record}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 block truncate"
                                >
                                  <ExternalLink
                                    className="absolute top-3 right-3 text-gray-500 hover:text-blue-600"
                                    size={20}
                                  />
                                </a>
                                <div className="flex">
                                  {/* <FileDown /> */}
                                  <p className="text-lg font-semibold text-secondary-1 mb-3 mt-6 truncate overflow-hidden">
                                    {decodeURIComponent(
                                      record.split("/").pop() || record,
                                    )}
                                  </p>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                        <div className="flex justify-center mt-4">
                          <button
                            onClick={() =>
                              paginateReports(currentPageReports - 1)
                            }
                            disabled={currentPageReports === 1}
                            className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md mr-2 disabled:opacity-50"
                          >
                            Prev
                          </button>
                          <button
                            onClick={() =>
                              paginateReports(currentPageReports + 1)
                            }
                            disabled={
                              currentPageReports ===
                              Math.ceil(
                                medicalHistory?.attachments?.length /
                                  itemsPerPage,
                              )
                            }
                            className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md ml-2 disabled:opacity-50"
                          >
                            Next
                          </button>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-500 text-center">
                        No diagnostic reports found for {selectedPet.name}
                      </p>
                    )}
                  </div>
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
