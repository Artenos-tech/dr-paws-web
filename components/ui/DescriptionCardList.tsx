import { descriptionItems } from "@/model/mockData";
import React from "react";
import DescriptionCard from "./DescriptionCard";

const DescriptionCardList = () => {
  return (
    <div className="w-full flex flex-col justify-center items-center gap-8 md:gap-14">
      {descriptionItems.map((description, index) => (
        <DescriptionCard key={index} index={index} description={description} />
      ))}
    </div>
  );
};

export default DescriptionCardList;
