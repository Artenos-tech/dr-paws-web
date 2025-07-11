import Image from "next/image"
import React from "react"
import { formatDistanceToNow } from "date-fns"

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
  const { profile_image, author, review_text, review_created_at, rating } = data

  const formattedDate = formatDistanceToNow(review_created_at.length > 0 ? new Date(review_created_at) : new Date(), {
    addSuffix: true,
  })

  const stars = Array.from({ length: 5 }).map((_, i) => (
    <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
      ★
    </span>
  ))

  return (
    <div className="max-w-sm bg-primary-3 rounded-lg overflow-hidden shadow-lg p-4">
      <div className="flex items-start mb-4">
        <div className="w-12 h-12 rounded-full bg-primary-2 relative overflow-hidden flex-shrink-0">
          {profile_image && (
            <Image
              src={profile_image}
              alt={author}
              fill
              className="object-cover rounded-full"
            />
          )}
        </div>
        <div className="ml-4 flex flex-col">
          <h3 className="text-lg italic text-gray-800">{author}</h3>
          <div className="text-sm text-gray-500 flex items-center gap-2">
            {stars} • {formattedDate}
          </div>
        </div>
      </div>

      <p className="text-base italic text-gray-600">{review_text}</p>
    </div>
  )
}

export default ReviewImageCard
