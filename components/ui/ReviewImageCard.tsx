import Image from "next/image"
import React from "react"

interface ReviewData {
  id: string
  author: string
  review_text: string
  review_created_at: string
  rating: number
  profile_image: string | null
}

interface ReviewImageCardProps {
  data: ReviewData
}

const ReviewImageCard: React.FC<ReviewImageCardProps> = ({ data }) => {
  const { profile_image, author, review_text } = data

  return (
    <div className="max-w-sm bg-primary-3 rounded-lg overflow-hidden shadow-lg">
      {/* Image section */}
      <div className="relative h-56 w-[80%] p-4 justify-self-center">
        {profile_image && (
          <Image
            src={profile_image}
            alt={author}
            layout="fill"
            objectFit="contain"
            className="w-full h-full object-contain py-4"
          />
        )}
      </div>

      {/* Text content */}
      <div className="p-4 flex flex-col items-start">
        <div className="flex items-center justify-center mb-3">
          <span className="bg-primary-2 rounded-full w-10 h-10 mr-2"></span>
          <h3 className="text-lg italic text-gray-800">{author}</h3>
        </div>
        <p className="text-base italic text-gray-600">{review_text}</p>
      </div>
    </div>
  )
}

export default ReviewImageCard
