"use client"

import { useAPICall } from "@/hooks/apicall"
import api from "@/services/api"
import { ExternalLink } from "lucide-react"
import { useEffect, useState } from "react"
import { ClipLoader } from "react-spinners"

interface MedicalHistoryProps {
  petProfileId: string
}

const MedicalHistory: React.FC<MedicalHistoryProps> = ({ petProfileId }) => {
  const [currentPageReports, setCurrentPageReports] = useState(1)
  const [currentPagePrescriptions, setCurrentPagePrescriptions] = useState(1)
  const [prescriptionsPerPage, setPrescriptionsPerPage] = useState(2) // Default value for large screens
  const itemsPerPage = 6

  useEffect(() => {
    const updatePrescriptionsPerPage = () => {
      const width = window.innerWidth
      setPrescriptionsPerPage(width < 1024 ? 1 : 2)
    }
    updatePrescriptionsPerPage()
    window.addEventListener("resize", updatePrescriptionsPerPage)
    return () => window.removeEventListener("resize", updatePrescriptionsPerPage)
  }, [])

  const {
    call: getMedicalHistoryForPet,
    result: medicalHistoryResult,
    loading: historyLoading,
  } = useAPICall(api.getMedicalHistoryForPet)

  useEffect(() => {
    getMedicalHistoryForPet({ pet_id: petProfileId })
  }, [petProfileId])

  const medicalHistory = medicalHistoryResult?.ok && medicalHistoryResult.value.body.medical_history || null
  const currentAttachments = medicalHistory?.attachments?.slice(
    (currentPageReports - 1) * itemsPerPage,
    currentPageReports * itemsPerPage
  ) || []
  const prescriptions = medicalHistory?.prescriptions || {}

  const paginateReports = (pageNumber: number) => setCurrentPageReports(pageNumber)

  const paginatePrescriptions = (page: number) => {
    const totalPages = prescriptions && Math.ceil(Object.keys(prescriptions).length / prescriptionsPerPage)
    if (page >= 1 && totalPages && page <= totalPages) {
      setCurrentPagePrescriptions(page)
    }
  }

  const currentPrescriptions = Object.entries(prescriptions)
    .slice(
      (currentPagePrescriptions - 1) * prescriptionsPerPage,
      currentPagePrescriptions * prescriptionsPerPage
    )
    .map(([dateAndTime, prescriptionLines]) => ({
      dateAndTime,
      prescriptionLines,
    }))

  return (
    <div className="w-full">
      {historyLoading ? (
        <div className="flex justify-center">
          <ClipLoader color="#33495f" />
        </div>
      ) : (
        <div>
          {/* Prescriptions Section */}
          <div className="mb-8 flex flex-col justify-between">
            <h3 className="text-lg text-primary-1 font-semibold mb-4">Prescriptions</h3>
            {Object.keys(prescriptions).length > 0 ? (
              <>
                <ul className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
                  {currentPrescriptions.map(({ dateAndTime, prescriptionLines }, index) => (
                    <li key={index} className="bg-primary-3 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                      <div className="flex flex-col">
                        <div className="font-semibold text-sm text-secondary-1 p-2">{dateAndTime}</div>
                        <ul className="space-y-2">
                          {prescriptionLines.map((prescription, prescriptionIndex) => (
                            <li key={prescriptionIndex} className="p-2">
                              {prescription}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => paginatePrescriptions(currentPagePrescriptions - 1)}
                    disabled={currentPagePrescriptions === 1}
                    className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md mr-2 disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => paginatePrescriptions(currentPagePrescriptions + 1)}
                    disabled={
                      currentPagePrescriptions ===
                      Math.ceil(Object.keys(prescriptions).length / prescriptionsPerPage)
                    }
                    className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md ml-2 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-center">No prescriptions found</p>
            )}
          </div>

          {/* Diagnostic Reports Section */}
          <div className="mb-8 flex flex-col justify-between">
            <h3 className="text-lg font-semibold mb-4">Diagnostic Reports, Scans, and Xrays</h3>
            {medicalHistory && medicalHistory.attachments.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 min-h-80 md:min-h-80 lg:min-h-60">
                  {currentAttachments.map((record: string, index: number) => (
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
                        <ExternalLink className="absolute top-3 right-3 text-gray-500 hover:text-blue-600" size={20} />
                      </a>
                      <div className="flex">
                        <p className="text-lg font-semibold text-secondary-1 mb-3 mt-6 truncate overflow-hidden">
                          {decodeURIComponent(record.split("/").pop() || record)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => paginateReports(currentPageReports - 1)}
                    disabled={currentPageReports === 1}
                    className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md mr-2 disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => paginateReports(currentPageReports + 1)}
                    disabled={currentPageReports === Math.ceil(medicalHistory?.attachments?.length / itemsPerPage)}
                    className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md ml-2 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-center">No diagnostic reports found</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MedicalHistory
