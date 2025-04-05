import React from "react"
import ReviewImageCard from "./ReviewImageCard"
interface ReviewImageCardListProps {
  reviews: {
    id: string
    author: string
    review_text: string
    review_created_at: string
    rating: number
    profile_image: string | null
  }[]
}

const ReviewImageCardList: React.FC<ReviewImageCardListProps> = ({
  reviews,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
      {reviews.map((review, index) => (
        <ReviewImageCard key={index} data={review} />
      ))}
    </div>
  )
}

export default ReviewImageCardList
