"use client";
import { descriptionItems } from "@/model/mockData";
import React, { useState } from "react";
import DescriptionCard from "./DescriptionCard";
import ContactInfoModal from "./ContactInfoModal";

interface DescriptionCardListProps {
  openLoginModal: (val: string) => void;
}

const DescriptionCardList: React.FC<DescriptionCardListProps> = ({
  openLoginModal,
}) => {
  const [contactModalOpen, setContactModalOpen] = useState<boolean>(false);
  return (
    <>
      <div className="w-full flex flex-col justify-center items-center gap-8 md:gap-14">
        {descriptionItems.map((description, index) => (
          <DescriptionCard
            key={index}
            index={index}
            description={description}
            openLoginModal={openLoginModal}
            openContactModal={() => setContactModalOpen(true)}
          />
        ))}
      </div>

      <ContactInfoModal
        isOpen={contactModalOpen}
        onRequestClose={() => setContactModalOpen(false)}
      />
    </>
  );
};

export default DescriptionCardList;
