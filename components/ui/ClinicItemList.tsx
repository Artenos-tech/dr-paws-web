import Image from "next/image"
import ClinicItem from "./ClinicItem"
import ClinicThumbnail from "@/public/assets/images/clinic/clinicThumbnail.svg"
import { useAPICall } from "@/hooks/apicall"
import api from "@/services/api"
import { useEffect, useState } from "react"
import Loader from "./Loader"

interface ClinicItemProps {
  showStaticCard: boolean
  enlargedView: boolean
}

const ClinicItemList = ({ showStaticCard, enlargedView }: ClinicItemProps) => {
  const [clinics, setClinics] = useState<
    {
      id: string
      name: string
      services: string
      image: {
        type: "url" | "ref"
        value: string
      }
      bookable: boolean
      contact: string
      comingSoon: boolean
    }[]
  >([])
  const { call: getClinicsList, loading: loadingClinicList } = useAPICall(
    api.getClinicsForDisplay,
  )

  useEffect(() => {
    const fetchClinics = async () => {
      const clinics = await getClinicsList({})
      if (clinics.ok && clinics.value.body.clinics) {
        setClinics(clinics.value.body.clinics)
      }
    }
    fetchClinics()
  }, [])

  if (loadingClinicList) {
    return <Loader />
  }
  return (
    <div
      className={`${clinics.length >= 4 ? "gap-4" : "gap-12"} ${
        enlargedView
          ? "grid grid-cols-1 lg:grid-cols-4 "
          : "flex flex-col lg:flex-row lg:flex-wrap lg:items-center lg:justify-center"
      }`}
    >
      {clinics.map((clinic) => (
        <ClinicItem
          key={clinic.id}
          clinic={clinic}
          enlargedView={enlargedView}
        />
      ))}
      {showStaticCard && (
        <div className="bg-primary-3 shadow-md rounded-md p-8 flex flex-col items-center justify-center text-center w-full">
          <div className="text-4xl mb-10">
            <Image
              src={ClinicThumbnail}
              alt="Clinic Thumbnail"
              width={40}
              height={40}
            />
          </div>
          <p className="font-bold text-sm text-primary-1 mb-2">
            Where Should The Next Dr. Paws Clinic Be?
          </p>
        </div>
      )}
    </div>
  )
}

export default ClinicItemList
