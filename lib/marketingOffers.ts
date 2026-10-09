export interface MarketingOffer {
  id: string
  title: string
  points: string[]
}

export const MARKETING_OFFERS: MarketingOffer[] = [
  {
    id: "spa-bath-499",
    title: "Spa Bath at ₹499",
    points: [
      "Offer price: ₹499 for an eligible Spa Bath service at participating Dr. Paws clinics.",
      "Includes shampoo & conditioning, ear cleaning, nail trimming & filing, teeth brushing, sanitary & under-paw trims, drying and a light finishing perfume.",
      "Pets with **more than 2-3 ticks/fleas** may require treatment before grooming and rescheduling. Treatment costs **₹400-₹2,800**, depending on the infestation and treatment required.",
      "Heavy knots or matting may require de-matting at an additional cost.",
      "Offer is subject to appointment and clinic availability.",
      "Cannot be combined with other grooming offers or discounts.",
      "Dr. Paws reserves the right to modify or discontinue the offer.",
    ],
  },
  {
    id: "spa-bath-haircut-1199",
    title: "Spa Bath + Haircut at ₹1,199",
    points: [
      "Offer price: ₹1,199 for an eligible Spa Bath + Haircut service at participating Dr. Paws clinics.",
      "Includes haircut, shampoo & conditioning, ear cleaning, nail trimming & filing, teeth brushing, sanitary & under-paw trims, drying and a light finishing perfume.",
      "Pets with **more than 2-3 ticks/fleas** may require treatment before grooming and rescheduling. Treatment costs **₹400-₹2,800**, depending on the infestation and treatment required.",
      "Heavy knots or matting may require de-matting at an additional cost.",
      "Haircut style and feasibility depend on the pet’s coat condition, temperament and groomer assessment.",
      "Offer is subject to appointment and clinic availability.",
      "Cannot be combined with other grooming offers or discounts.",
      "Dr. Paws reserves the right to modify or discontinue the offer.",
    ],
  },
]
