import { photos } from "@/model/mockData";
import Image from "next/image";

function ClinicPhotos() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {photos.map((photo, index) => (
          <div
            key={index}
            className="w-full max-w-[245px] h-full max-h-[245px] rounded-[5px] overflow-hidden border border-gray-300 shadow-md"
          >
            <Image
              src={photo}
              alt={"clinic image"}
              // layout="responsive"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClinicPhotos;
