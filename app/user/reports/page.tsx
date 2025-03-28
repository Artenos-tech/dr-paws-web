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
  const {
    call: getReports,
    result: reportsResult,
    loading: reportsLoading,
  } = useAPICall(api.getMedicalRecordsForPet)
  const {
    call: getPets,
    result: petsResult,
    loading: petsLoading,
  } = useAPICall(api.getPets)

  useEffect(() => {
    getPets({})
  }, [])

  const handleGetReports = (pet: Pet) => {
    setSelectedPet(pet)
    getReports({ pet_id: pet.vetPortId.toString() })
  }

  const pets =
    petsResult?.ok &&
    petsResult.value.body.pets.map((pet) => ({
      ...pet,
      profileImage: pet.profile_image,
      vetPortId: pet.vetport_id,
      gender: pet.gender,
    }))

  const reports = reportsResult?.ok && reportsResult.value.body.records

  return (
    <div className="flex flex-col w-full h-full items-center font-roca pb-20 flex-grow ">
      <main className="flex flex-col w-full items-center px-8 md:px-32 lg:px-20 xl:px-40">
        <h1 className="text-3xl m-4 lg:m-12">Medical History</h1>
        <div className="flex flex-col gap-6 lg:w-full items-center">
          <div
            className={`flex justify-center items-center ${
              !petsLoading && "md:justify-start"
            }  flex-wrap gap-4 my-8 md:my-4`}
          >
            {petsLoading && <ClipLoader color="#33495f" />}
            {pets &&
              pets.map((pet) => (
                <PetCard
                  key={pet.vetPortId}
                  pet={pet}
                  fetchMedicalRecords={handleGetReports}
                />
              ))}
          </div>
          {selectedPet && (
            <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Reports for {selectedPet.name}
              </h2>

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
                  No reports found for {selectedPet.name}
                </p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Reports
