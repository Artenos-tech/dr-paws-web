import React from "react";
import { IoClose } from "react-icons/io5";

interface fileDisplayCardProps {
  fileName: string;
  onRemove?: () => void;
}

const FileDisplayCard: React.FC<fileDisplayCardProps> = ({
  fileName,
  onRemove,
}) => {
  return (
    <div className="bg-primary-3 w-[180px] h-[120px] flex flex-col rounded-md relative">
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-0 right-0"
        >
          <IoClose />
        </button>
      )}
      <div className="mt-auto bg-[#FFFCF3] rounded-b-md py-2">
        <p className="text-xs text-secondary-1 text-center font-medium">
          {fileName}
        </p>
      </div>
    </div>
  );
};

export default FileDisplayCard;
