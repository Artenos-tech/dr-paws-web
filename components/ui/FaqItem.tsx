"use client";

import { useState } from "react";
import { Open_Sans } from "next/font/google";
import { AiOutlineDown, AiOutlineRight } from "react-icons/ai"; // Import icons



interface FaqItem {
  question: string;
  answer: string;
}

interface FaqProps {
  items: FaqItem[];
  heading: string;
}

const FaqItem: React.FC<FaqProps> = ({ items = [], heading }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleCollapse = (index: number) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <div className="max-w-lg lg:max-w-3xl xl:max-w-4xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
      {/* Ensuring proper padding on different screen sizes */}
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4">
        {heading}
      </h2>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="border-b pl-10">
            <button
              onClick={() => toggleCollapse(index)}
              className="flex justify-between w-full py-3 text-left text-base sm:text-lg lg:text-xl font-medium text-gray-700"
            >
              {item.question}
              <span>
                {openIndex === index ? <AiOutlineDown /> : <AiOutlineRight />}
              </span>
            </button>
            {openIndex === index && (
              <div className="py-2 text-gray-600 text-sm sm:text-base lg:text-lg">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqItem;
