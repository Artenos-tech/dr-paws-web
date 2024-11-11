"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";

const BackButton = () => {
  const navigate = useRouter();
  return (
    <button type="button" onClick={() => navigate.back()} className="flex gap-1 items-center self-start my-7">
      <MdOutlineKeyboardArrowLeft /> Back
    </button>
  );
};

export default BackButton;
