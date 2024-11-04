import Image from "next/image";
import ClinicItem from "./ClinicItem";
import { clinicItems } from "@/model/mockData";
import ClinicThumbnail from "@/public/assets/images/clinic/ClinicThumbnail.svg";

interface ClinicItemProps {
  showStaticCard: boolean;
  enlargedView: boolean;
}
const ClinicItemList = ({ showStaticCard, enlargedView }: ClinicItemProps) => {
  return (
    <div
      className={`grid grid-cols-1 ${
        enlargedView
          ? "lg:grid-cols-3 lg:grid-rows-3"
          : "lg:grid-cols-4 lg:grid-rows-2"
      } gap-4`}
    >
      {clinicItems.map((clinic) => (
        <ClinicItem key={clinic.id} clinic={clinic} />
      ))}
      {showStaticCard && (
        <div className="bg-primary-3 shadow-md rounded-md p-8 flex flex-col items-center justify-center text-center w-full">
          <div className="text-4xl mb-4">
            <Image
              src={ClinicThumbnail}
              alt="Clinic Thumbnail"
              width={40}
              height={40}
            />
          </div>
          <p className="font-bold text-xl mb-2">
            Where Should The Next Dr. Paws Clinic Be?
          </p>
        </div>
      )}
    </div>
  );
};

export default ClinicItemList;
