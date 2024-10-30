import ClinicItem from "./ClinicItem";
import { clinicItems } from "@/model/mockData";

const ClinicItemList = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-4 lg:grid-rows-2  gap-4 mx-auto p-4 pt-5">
      {clinicItems.map((clinic, clinicIndex) => (
        <ClinicItem key={clinicIndex} clinic={clinic} />
      ))}
    </div>
  );
};

export default ClinicItemList;
