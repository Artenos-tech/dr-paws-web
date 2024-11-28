import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import Modal from "react-modal";

interface fileRenameProps {
  isOpen: boolean;
  currentFileName: string;
  onClose: () => void;
  onConfirm: (newFileName: string) => void;
}

const FileRenameModal: React.FC<fileRenameProps> = ({
  isOpen,
  onClose,
  currentFileName,
  onConfirm,
}) => {
  const [newFileName, setNewFileName] = useState<string>(currentFileName);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const appElement = document.getElementById("__next");
    if (appElement) {
      Modal.setAppElement(appElement);
    } else {
      console.warn("ReactModal: App element with id '__next' not found.");
    }
  }, []);

  useEffect(() => {
    setNewFileName(currentFileName);
  }, [currentFileName]);

  const handleConfirm = () => {
    onConfirm(newFileName);
    // setNewFileName("");
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="mt-20 mb-5 mx-auto p-4 bg-white rounded-xl shadow-lg overflow-y-auto z-50"
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

        <div className="w-full">
          <h1 className="text-center my-3">Rename the file</h1>

          <div className="flex flex-col gap-3">
            <p className="bg-primary-3 w-full px-3 py-2 rounded-md">
              Filename.pdf
            </p>
            <input
              type="text"
              value={newFileName}
              placeholder="Rename the file"
              className="border border-secondary-1 rounded-md px-3 py-2 w-full"
              onChange={(e) => setNewFileName(e.target.value)}
            />
            <button
              type="button"
              className="rounded-full font-semibold text-white tracking-wider bg-secondary-1 px-10 py-2"
              onClick={handleConfirm}
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FileRenameModal;
