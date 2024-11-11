import React from "react";
import { FiEdit2, FiPlus } from "react-icons/fi";

type outlineProps = {
  outlineBtnText: string;
  outlineBtnLink?: () => void;
};

const OutlineButton: React.FC<outlineProps> = ({
  outlineBtnText,
  outlineBtnLink,
}) => {
  const icon = outlineBtnText.includes("Edit") ? <FiEdit2 /> : <FiPlus />;
  return (
    <button
      type="button"
      className="btn border border-secondary-1 text-secondary-1 px-4 py-2 flex items-center gap-1 text-sm rounded-full"
      onClick={outlineBtnLink}
    >
      {" "}
      {icon}
      {outlineBtnText}
    </button>
  );
};

export default OutlineButton;