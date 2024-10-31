import ClinicItem from "./ClinicItem";
import { clinicItems } from "@/model/mockData";

const ClinicItemList = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-2 gap-4 mx-auto pt-5 px-8 md:px-32 lg:px-40">
      {clinicItems.map((clinic, clinicIndex) => (
        <ClinicItem key={clinicIndex} clinic={clinic} />
      ))}
    </div>
  );
};

export default ClinicItemList;
