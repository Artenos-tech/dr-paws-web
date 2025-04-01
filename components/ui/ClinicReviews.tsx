"use client"

import ReviewImageCardList from "./ReviewImageCardList"

interface ClinicReviewsProps {
  reviews?: {
    id: string
    author: string
    review_text: string
    review_created_at: string
    rating: number
    profile_image: string | null
  }[]
}
function ClinicReviews({ reviews }: ClinicReviewsProps) {
  return (
    <div className="w-full">
      {reviews && reviews.length > 0 ? (
        <ReviewImageCardList reviews={reviews} />
      ) : (
        <div>No reviews available</div>
      )}
    </div>
  )
}

export default ClinicReviews
