import { Doctor } from "@/model/typeDefinitions";
import Modal from "react-modal";
import React from "react";

interface doctorDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor;
}

const DoctorDetailsModal: React.FC<doctorDetailsProps> = ({
  isOpen,
  onClose,
}) => {
  return <Modal isOpen={isOpen} onRequestClose={onClose}></Modal>;
};

export default DoctorDetailsModal;
