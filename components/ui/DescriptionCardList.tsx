import { descriptionItems } from "@/model/mockData";
import React from "react";
import DescriptionCard from "./DescriptionCard";

const DescriptionCardList = () => {
  return (
    <div className="flex flex-col gap-16">
      {descriptionItems.map((description, index) => (
        <DescriptionCard key={index} index={index} description={description} />
      ))}
    </div>
  );
};

export default DescriptionCardList;
