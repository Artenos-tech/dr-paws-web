import React from "react"
import { FiEdit2, FiPlus } from "react-icons/fi"

type outlineProps = {
  outlineBtnText: string
  outlineBtnLink?: () => void
}

const OutlineButton: React.FC<outlineProps> = ({
  outlineBtnText,
  outlineBtnLink,
}) => {
  const icon = outlineBtnText.includes("Edit") ? (
    <FiEdit2 />
  ) : outlineBtnText.includes("Cancel") ? (
    ""
  ) : outlineBtnText.includes("View Details") ? (
    ""
  ) : (
    <FiPlus />
  )
  return (
    <button
      type="button"
  className="
    btn border border-secondary-1 text-secondary-1 px-4 py-2 flex items-center gap-1 text-xs rounded-full
    cursor-pointer
    transition-all duration-200
    hover:bg-secondary-1
    hover:text-white
    hover:shadow-md
  "
      onClick={outlineBtnLink}
    >
      {" "}
      {icon}
      {outlineBtnText}
    </button>
  )
}

export default OutlineButton
