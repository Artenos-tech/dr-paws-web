"use client"

import { useAPICall } from "@/hooks/apicall"
import api from "@/services/api"
import { ExternalLink } from "lucide-react"
import { useEffect } from "react"
import { ClipLoader } from "react-spinners"

interface MedicalHistoryProps {
  petProfileId: string
}

const MedicalHistory: React.FC<MedicalHistoryProps> = ({ petProfileId }) => {
  const {
    call: getReports,
    result: reportsResult,
    loading: reportsLoading,
  } = useAPICall(api.getMedicalRecordsForPet)

  useEffect(() => {
    getReports({ pet_id: petProfileId })
  }, [])

  const reports = reportsResult?.ok && reportsResult.value.body.records
  
  return (
    <div className="bg-primary-3 rounded-lg p-3 md:p-6 lg:p-8 w-full my-5">
      <h1 className="text-3xl">Medical History</h1>
      <div className="flex flex-col gap-6 lg:w-full items-center my-4">
        <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
          {reportsLoading ? (
            <div className="flex justify-center">
              <ClipLoader color="#33495f" />
            </div>
          ) : reports && reports.length > 0 ? (
            <ul className="space-y-3">
              {reports.map((report: string, index: number) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <a
                    href={report}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex-grow truncate mr-4"
                  >
                    {decodeURIComponent(report.split("/").pop() || report)}
                  </a>
                  <ExternalLink
                    className="text-gray-500 hover:text-blue-600"
                    size={20}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center">
              No reports found.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default MedicalHistory