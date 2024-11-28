import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import Modal from "react-modal";

interface filePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  currentIndex: number;
  currentCategory: string;
}

const PetFilePreview: React.FC<filePreviewProps> = ({
  isOpen,
  onClose,
  currentCategory,
  currentIndex,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [currentId, setCurrentId] = useState(currentIndex);
  const [files, setFiles] = useState();

  useEffect(() => {
    setIsMounted(true);
    const appElement = document.getElementById("__next");
    if (appElement) {
      Modal.setAppElement(appElement);
    } else {
      console.warn("ReactModal: App element with id '__next' not found.");
    }
  }, []);

  //   useEffect(() => {
  //     const storedFiles = localStorage.getItem("pets-history");
  //     if (storedFiles) {
  //       const parsedFiles = JSON.parse(storedFiles);
  //       const categoryFiles = parsedFiles.find(
  //         (record: { petId: string }) => record.petName === currentCategory
  //       );
  //       if (categoryFiles) {
  //         setFiles(categoryFiles.diagnosticReports || []);
  //       }
  //     }
  //   }, [currentId]);

  if (!isMounted) {
    return null;
  }
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="mt-20 mb-5 mx-auto p-4 bg-transparent rounded-xl shadow-lg overflow-y-auto z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center"
    >
      <div className="flex flex-col lg:flex-row justify-between w-full items-center p-5 text-primary-1 relative">
        <button
          className="absolute top-0 right-0 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close modal"
          onClick={onClose}
        >
          <IoClose />
        </button>
      </div>
    </Modal>
  );
};

export default PetFilePreview;
