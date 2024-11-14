import React from "react";
import FaqItem from "./FaqItem";
import { FaqData } from "@/model/mockData";

const FaqList = () => {
  return (
    <div className="mx-auto mb-20 md:mb-40 px-8 md:px-32 lg:px-28 xl:px-40">
      {FaqData.map((faq, faqIndex) => (
        <FaqItem key={faqIndex} heading={faq.heading} items={faq.qaList} />
      ))}
    </div>
  );
};

export default FaqList;
