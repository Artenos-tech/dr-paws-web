import React from 'react'
import { FiEdit2, FiPlus } from "react-icons/fi";

type outlineProps = {
    outlineBtnText: string
    outlineBtnLink?: string
}

const OutlineButton:React.FC<outlineProps> = ({outlineBtnText}) => {
    const icon = outlineBtnText.includes("Edit") ? <FiEdit2 /> : <FiPlus />
  return (
    <button className='btn border border-primary-1 text-primary-1 rounded-full'> {icon}
      {outlineBtnText}
    </button>
  )
}

export default OutlineButton
