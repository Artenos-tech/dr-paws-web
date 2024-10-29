"use client";

import ReviewImageCardList from "./ReviewImageCardList";
import { reviews } from "@/model/mockData";
function ClinicReviews() {
  return (
    <div className="w-full">
      <ReviewImageCardList reviews={reviews} />
    </div>
  );
}

export default ClinicReviews;
