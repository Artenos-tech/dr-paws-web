import ClinicItem from "./ClinicItem";
import { clinicItems } from "@/model/mockData";

const ClinicItemList = () => {
  return (
    <div className="grid grid-cols-4 grid-rows-2 gap-4 w-fit mx-auto p-4">
      {clinicItems.map((clinic, clinicIndex) => (
        <ClinicItem key={clinicIndex} clinic={clinic} />
      ))}
    </div>
  );
};

export default ClinicItemList;
