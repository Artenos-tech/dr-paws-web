import Image from "next/image";
import ClinicItem from "./ClinicItem";
import { clinicItems } from "@/model/mockData";
import ClinicThumbnail from "@/public/assets/images/clinic/clinicThumbnail.svg";

interface ClinicItemProps {
  showStaticCard: boolean;
  enlargedView: boolean;
}

const ClinicItemList = ({ showStaticCard, enlargedView }: ClinicItemProps) => {
  return (
    <div
      className={`${clinicItems.length >= 4 ? "gap-4" : "gap-12"} ${
        enlargedView
          ? "grid grid-cols-1 lg:grid-cols-4 "
          : "flex flex-col lg:flex-row lg:flex-wrap lg:items-center lg:justify-center"
      }`}
    >
      {clinicItems.map((clinic) => (
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
  );
};

export default ClinicItemList;
