import React from "react"
import { ClipLoader } from "react-spinners"

const Loader = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <ClipLoader color="#33495f" />
    </div>
  )
}

export default Loader
