import React from "react";
import { IoClose } from "react-icons/io5";

interface fileDisplayCardProps {
  fileName: string;
  onClose: () => void;
}

const FileDisplayCard: React.FC<fileDisplayCardProps> = ({
  fileName,
  onClose,
}) => {
  return (
    <div className="bg-primary-3 w-[180px] h-[120px] flex flex-col rounded-md relative">
      <button
        type="button"
        onClick={onClose}
        className="absolute top-0 right-0"
      >
        <IoClose />
      </button>
      <div className="mt-auto bg-[#FFFCF3] py-2">
        <p className="text-xs text-secondary-1 text-center font-medium">
          {fileName}
        </p>
      </div>
    </div>
  );
};

export default FileDisplayCard;
