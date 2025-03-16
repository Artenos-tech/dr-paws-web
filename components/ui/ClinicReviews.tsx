"use client"

import { Review } from "@/model/typeDefinitions"
import ReviewImageCardList from "./ReviewImageCardList"

interface ClinicReviewsProps {
  reviews: Review[]
}
function ClinicReviews({ reviews }: ClinicReviewsProps) {
  return (
    <div className="w-full">
      <ReviewImageCardList reviews={reviews} />
    </div>
  )
}

export default ClinicReviews
