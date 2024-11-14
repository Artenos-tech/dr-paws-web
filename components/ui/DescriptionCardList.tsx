import { descriptionItems } from "@/model/mockData";
import React from "react";
import DescriptionCard from "./DescriptionCard";

interface DescriptionCardListProps {
  openContactModal?: () => void;
}

const DescriptionCardList:React.FC<DescriptionCardListProps> = ({openContactModal}) => {
  return (
    <div className="flex flex-col justify-center items-center gap-8 md:gap-14">
      {descriptionItems.map((description, index) => (
        <DescriptionCard key={index} index={index} description={description} openContactModal={openContactModal} />
      ))}
    </div>
  );
};

export default DescriptionCardList;
